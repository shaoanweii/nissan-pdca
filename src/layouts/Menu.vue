<template>
  <div class="menu-wrapper">
    <a-menu
      v-model:selected-keys="active"
      v-model:open-keys="openKeys"
      show-collapse-button
      @menu-item-click="handleClick"
      @collapse="(val: any) => onCollapse(val)"
    >
      <template v-for="item in menuList">
        <template v-if="!item.meta?.hidden">
          <a-menu-item v-if="item.meta?.alwaysShow" :key="item.redirect">
            <template #icon>
              <i :class="getMenuIconClass(item.meta?.icon)" style="font-size: 20px"></i>
            </template>
            <span
              class="menu-title"
              style="font-size: 14px"
              v-html="formatMenuTitle(item?.meta?.title)"
            ></span>
          </a-menu-item>
          <a-sub-menu v-else-if="item.children && item.children.length" :key="item.path">
            <template #icon>
              <i :class="getMenuIconClass(item.meta?.icon)" style="font-size: 20px"></i>
            </template>
            <template #title>
              <span
                class="menu-title"
                style="font-size: 14px"
                v-html="formatMenuTitle(item.meta?.title)"
              ></span>
            </template>
            <a-menu-item v-for="it in item.children" :key="it.path">
              <template #icon>
                <i :class="getMenuIconClass(it.meta?.icon)" style="font-size: 20px"></i>
              </template>
              <span
                class="menu-title"
                style="font-size: 14px"
                v-html="formatMenuTitle(it.meta?.title)"
              ></span>
            </a-menu-item>
          </a-sub-menu>
          <template v-else>
            <a-menu-item :key="item.path">
              <template #icon>
                <i :class="getMenuIconClass(item.meta?.icon)" style="font-size: 20px"></i>
              </template>
              <span
                class="menu-title"
                style="font-size: 14px"
                v-html="formatMenuTitle(item.meta?.title)"
              ></span>
            </a-menu-item>
          </template>
        </template>
      </template>
    </a-menu>
  </div>
</template>

<script lang="ts" setup>
import useUserStore from '@/stores/modules/user'
import { useRoute, useRouter } from 'vue-router'

interface MenuItem {
  icon: string
  name: string
  path?: string
  redirect?: string
  meta?: Record<string, any>
  children?: MenuItem[]
}

const emit = defineEmits(['onCollapse'])
const active = ref(['/home'])
const openKeys = ref<any[]>([])
const userStore = useUserStore()

const route = useRoute()
const router = useRouter()

const getMenuIconClass = (icon?: string) => {
  if (!icon) return 'ri-circle-fill'
  return icon.startsWith('ri-') ? icon : `iconfont ${icon}`
}

// 获取所有菜单的path作为key，用于默认展开所有菜单
const getAllMenuKeys = (items: MenuItem[]): string[] => {
  const keys: string[] = []
  items.forEach(item => {
    if (item.path) {
      keys.push(item.path)
    }
  })
  return keys
}

onMounted(() => {
  active.value = [userStore.homePath || '/voc/view']
  setCurRoute(route.path)

  // 默认展开所有菜单
  const allMenuKeys = getAllMenuKeys(userStore.menuList)
  openKeys.value = allMenuKeys
})

const menuList = computed((): MenuItem[] => {
  // 确保每个菜单项如果没有path值则使用name
  const processMenuItems = (items: MenuItem[]): MenuItem[] => {
    return items.map(item => {
      // 如果path不存在或为空，则使用name
      if (!item.path && item.name) {
        item.path = item.name
      }

      return item
    })
  }

  return processMenuItems([...userStore.menuList])
})

const setCurRoute = (path: string) => {
  let subMenuKey = path.startsWith('/') && path.substring(1).split('/')[0]
  active.value = [path]
  // 不重置openKeys，保持菜单展开状态
  if (!openKeys.value.length) {
    openKeys.value = (subMenuKey && [`/${subMenuKey}`]) || []
  }
}

watch(
  () => route.path,
  (val: string) => {
    setCurRoute(val)
  }
)

/**
 * @description: 根据id查询对应linkUrl的地址
 * @param {*} id
 * @return {*}
 */
const getLinkUrlById = (id: string) => {
  const list = menuList.value.filter((el: any) => el.permissionKey === 'linkUrl')
  let apiPath = ''
  if (list.length > 0) {
    list.forEach((el: any) => {
      if (el.children) {
        const result = el.children.find((item: any) => {
          if (item.id === id) {
            return item
          }
        })
        apiPath = result.apiPath
      } else {
        if (el.id === id) {
          apiPath = el.apiPath
        }
      }
    })
  }

  return apiPath
}

const handleClick = (key: string) => {
  if (key.startsWith('linkUrl_')) {
    const id = key.split('_')[1]
    const url = getLinkUrlById(id)
    window.open(url)
  } else {
    router.push(key)
  }
  // if (key.startsWith('http')) {
  //   window.open(key)
  // } else {
  //   router.push(key)
  // }
}

const onCollapse = (val: boolean) => {
  emit('onCollapse', val)
}

/**
 * @description: 格式化菜单标题，对特定标题进行处理
 * @param {string} title 菜单标题
 * @return {string} 格式化后的菜单标题
 */
const formatMenuTitle = (title: string) => {
  if (!title) return ''
  // 特殊处理 "VOC全面分析(CCSI专题洞察)" 标题，将其分成两行
  if (title === 'VOC全面分析(CCSI专题洞察)') {
    return 'VOC全面分析<br>(CCSI专题洞察)'
  }
  return title
}
</script>

<style lang="scss" scoped>
.menu-wrapper {
  position: relative;
  height: 100%;
  &::v-deep(
      .arco-menu-light .arco-menu-item,
      .arco-menu-light .arco-menu-inline-content .arco-menu-item
    ) {
    color: #6e7b91;
  }
  &::v-deep(.arco-menu-title) {
    line-height: initial;
    padding: 10px 0 11px 0;
    .menu-title {
      display: block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  &::v-deep(.arco-menu-inline-header) {
    color: #6e7b91 !important;
  }
  &::v-deep(.arco-menu-light .arco-menu-item.arco-menu-selected) {
    background-color: #fbeef1;
    .menu-title {
      color: #c3002f;
      font-weight: 600;
    }
    .arco-menu-icon {
      color: #c3002f;
    }
  }
  &::v-deep(.arco-menu-light .arco-menu-item.arco-menu-selected) {
    color: #c3002f;
  }
  &::v-deep(.arco-menu-light .arco-menu-inline-header.arco-menu-selected) {
    .menu-title {
      color: #c3002f;
      font-weight: 600;
    }
    .arco-menu-icon,
    .arco-icon {
      color: #c3002f;
    }
  }

  &::v-deep(.arco-menu-light .arco-menu-item) {
    &:hover {
      background-color: #fbeef1;
    }
  }
  &::v-deep(.arco-menu-light .arco-menu-inline-header) {
    font-size: 16px;
    &:hover {
      background-color: #fbeef1;
    }
  }

  &::v-deep(.arco-menu-inline .arco-menu-title) {
    .menu-title {
      /* font-size: 16px; */
      font-size: 14px;
    }
  }
  &::v-deep(.arco-menu-item .arco-menu-title) {
    .menu-title {
      /* font-size: 16px; */
    }
  }

  .arco-menu {
    height: 100%;
    width: 100%;

    &.arco-menu-collapsed {
      width: 48px;
    }
  }
}
</style>
