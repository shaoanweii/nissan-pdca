<template>
  <div class="f-card" :style="cStyle">
    <div class="fc-header">
      <div class="fch-l">
        <slot name="titleIcon">
          <SvgIcon
            v-if="isTitleIcon"
            :name="titleIcon"
            :color="titleIconColor"
            :width="px2rem(titleIconWidth)"
            :height="px2rem(titleIconHeight)"
            class="mr-8"
          ></SvgIcon>
          <!-- <i v-if="isTitleIcon" class="iconfont font-18 mr-10" :class="titleIcon"></i> -->
        </slot>
        <span class="fch-title">{{ title }}</span>
        <a-tooltip :content="toolTipContent">
          <slot name="toolTip">
            <SvgIcon
              v-if="isToolTip"
              name="information-line"
              width="16px"
              height="16px"
              class="ml-8"
            ></SvgIcon>
            <!-- <i v-if="isToolTip" class="iconfont ml-8" :class="toolTipIcon"></i> -->
          </slot>
        </a-tooltip>
      </div>
      <div class="fch-r">
        <slot name="extra"></slot>
        <a-dropdown @select="(val: any) => dropDownSelect(val)">
          <img v-if="isMoreByAuth" class="more" src="@/assets/icon/more.png" alt="" />
          <template #content>
            <a-doption v-if="userStore.isDownload" value="1">下载图片</a-doption>
            <a-doption v-if="extraDropdownKey?.includes('2') && userStore.isExport" value="2"
              >指数维护</a-doption
            >
          </template>
        </a-dropdown>

        <!-- <i class="iconfont icon-more-line more"></i> -->
      </div>
    </div>
    <div v-if="isHeaderBorder" class="fc-border"></div>
    <div :class="['fc-content', contentClass]" ref="cardContentRef">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useUserStore from '@/stores/modules/user'
import { fnSaveImg } from '@/utils/echartsToImg'
import { px2rem } from '@/utils/rem'
interface Props {
  width?: number | string
  height?: number | string
  title?: string
  isMore?: boolean
  isToolTip?: boolean
  isTitleIcon?: boolean
  toolTipContent?: string
  contentClass?: string
  titleIcon?: string
  titleIconWidth?: string
  titleIconHeight?: string
  titleIconColor?: string
  extraDropdownKey?: string[]
  isHeaderBorder?: boolean
}
const {
  width = '100%',
  height = 412,
  title = '标题',
  isMore = true,
  isToolTip = true,
  isTitleIcon = true,
  toolTipContent = 'This is tooltip content',
  contentClass,
  titleIcon = 'account-pin-circle-line',
  titleIconWidth = '24px',
  titleIconHeight = '24px',
  titleIconColor,
  extraDropdownKey = [],
  isHeaderBorder = false
} = defineProps<Props>()

const emits = defineEmits(['handleDropdown'])
const userStore = useUserStore()

const cStyle = computed(() => {
  return {
    width: typeof width === 'string' ? px2rem(width) : px2rem(`${width}px`),
    height: typeof height === 'string' ? px2rem(height) : px2rem(`${height}px`)
  }
})

const cardContentRef = ref<HTMLDivElement | null>(null)
const dropDownSelect = (val: string) => {
  // console.log('val', val)
  if (val === '1') {
    // console.log('cardContentRef', cardContentRef.value)
    fnSaveImg(cardContentRef.value, title, () => {})
  } else if (val === '2') {
    emits('handleDropdown', val)
  }
}

const isMoreByAuth = computed(() => {
  // isExport 维护数据
  // isDownload 下载图表
  // console.log('isExport', hasPermission('isExport '))
  // console.log('isExport', hasPermission('isDownload '))
  if (isMore) {
    // 指数维护 下载图表 权限
    if (extraDropdownKey?.length) {
      return userStore.isExport || userStore.isDownload
    }
    return userStore.isDownload
  } else {
    return false
  }
})
</script>

<style lang="scss" scoped>
.f-card {
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #dde3ee;
  padding: 24px;
  display: flex;
  flex-direction: column;
  .fc-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: none;
    .fch-title {
      font-weight: 400;
      font-size: 16px;
      color: #09121f;
      line-height: 24px;
    }

    .fch-l {
      display: flex;
      align-items: center;
    }

    .fch-r {
      display: flex;
      align-items: center;
      .more {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }
  }
  .fc-border {
    width: calc(100% + 48px);
    height: 19px;
    /* background: linear-gradient(90deg, #f4f7fd 0%, #f4f7fd 100%), #dde3ee; */
    border-bottom: 1px solid #dde3ee;
    margin: 0 -24px;
  }
  .fc-content {
    flex: 1;
    height: calc(100% - 28px);
  }
}
</style>
