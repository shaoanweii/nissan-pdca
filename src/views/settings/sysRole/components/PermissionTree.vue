<template>
  <div class="permissionTree w-full flex-direction-column">
    <a-checkbox
      v-model="tree.allPermission"
      :indeterminate="allIndeterminate"
      @change="(val: any) => allChange(val)"
      style="line-height: 32px; width: 100px"
    >
      全选
    </a-checkbox>
    <div class="permission-wrapper">
      <div class="pw-first">
        <a-checkbox
          v-model="appChecked"
          :indeterminate="appIndeterminate"
          @change="(val: any) => appAllChange(val)"
        >
          应用看板
        </a-checkbox>
      </div>
      <div class="pw-two">
        <div
          class="pwt-item"
          :class="{ 'parent-switch-container': shouldShowChildrenWithSwitch(item) }"
          v-for="(item, index) of tree.appKanban"
          :key="index"
        >
          <a-checkbox
            v-model="item.checked"
            :indeterminate="item.indeterminate"
            :disabled="item.permissionKey === 'vocView'"
            @change="(val: any) => appChange(val, item)"
          >
            {{ item.name }}
          </a-checkbox>
          <template v-if="item.children">
            <div class="item-line"></div>
            <a-checkbox
              v-for="(subItem, subIndex) of item.children"
              :key="subIndex"
              v-model="subItem.checked"
              @change="(val: any) => subAppChange(val, item)"
            >
              {{ subItem.name }}
            </a-checkbox>
          </template>

          <!-- 情况2：父元素显示下钻功能 -->
          <template v-else-if="item.drillDownPermissionList && item.drillDownPermissionList.length">
            <!-- 情况1：子元素显示为一行，右侧是开关 -->
            <template v-if="shouldShowChildrenWithSwitch(item)">
              <div class="children-switch-container">
                <div class="children-items">
                  <div
                    class="child-item"
                    v-for="(subItem, subIndex) of item.drillDownPermissionList"
                    :key="subIndex"
                  >
                    <span class="child-name">{{ subItem.name }}</span>
                    <div class="drill-down-switch">
                      <span class="drill-down-text">是否可下钻：</span>
                      <a-switch
                        v-model="subItem.drillDownPermission"
                        class="fixed-width-switch"
                        @change="(val: any) => handleDrillDownChange(val, subItem, item)"
                      >
                        <template #checked>ON </template>
                        <template #unchecked>OFF</template>
                      </a-switch>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="drill-down-switch">
                <span class="drill-down-text">是否可下钻：</span>
                <a-switch
                  v-model="item.drillDownPermission"
                  class="fixed-width-switch"
                  @change="(val: any) => handleDrillDownChange(val, item)"
                >
                  <template #checked>ON </template>
                  <template #unchecked>OFF</template>
                </a-switch>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
    <div class="permission-btn-wrapper">
      <div class="pbw-left">
        <a-checkbox
          v-model="btnPerm"
          :indeterminate="btnPermIndeterminate"
          @change="(val: any) => btnPermChange(val)"
        >
          功能权限
        </a-checkbox>
      </div>
      <div class="pbw-right">
        <a-checkbox v-model="tree.isExport"> 维护数据 </a-checkbox>
        <a-checkbox v-model="tree.isDownload"> 下载图表 </a-checkbox>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    tree: Record<any, any>
  }>(),
  {}
)
const { tree } = toRefs(props)

const allIndeterminate = ref(false)

// 按钮权限
const btnPerm = ref(false)
const btnPermIndeterminate = ref(false)

const appIndeterminate = ref(false)
const appChecked = ref(false)

// 全选
const allChange = (val: boolean) => {
  btnPerm.value = val
  appChecked.value = val
  tree.value.allPermission = val
  tree.value.isExport = val
  tree.value.isDownload = val
  setValByTree(tree.value.appKanban, val)
}

const appAllChange = (val: boolean) => {
  appChecked.value = val
  appIndeterminate.value = false
  setValByTree(tree.value.appKanban, val)
}

const setValByTree = (tree: any[], val: boolean) => {
  tree.forEach((el: any) => {
    el.checked = val
    el.drillDownPermission = val
    // 总览页一直被选中
    if (el.permissionKey === 'vocView') {
      el.checked = true
    }

    if (el.children) {
      setValByTree(el.children, val)
    } else if (el.drillDownPermissionList) {
      setValByTree(el.drillDownPermissionList, val)
    }
  })
}

watchEffect(() => {
  if (appChecked.value && btnPerm.value) {
    tree.value.allPermission = true
    allIndeterminate.value = false
  } else if (appChecked.value || btnPerm.value) {
    tree.value.allPermission = false
    allIndeterminate.value = true
  } else {
    tree.value.allPermission = false
    allIndeterminate.value = false
  }
  if (appIndeterminate.value) {
    allIndeterminate.value = true
  }
})

watchEffect(() => {
  const result = tree.value.appKanban.filter((el: any) => el.checked)

  if (result.length === tree.value.appKanban.length) {
    appChecked.value = true
    appIndeterminate.value = false
  } else if (result.length === 0) {
    appChecked.value = false
    appIndeterminate.value = false
  } else {
    appChecked.value = false
    appIndeterminate.value = true
  }
})

const appChange = (val: boolean, item: any) => {
  item.checked = val
  item.indeterminate = false
  // 如有子级, 则同步设置子级状态
  if (item.children) {
    setValByTree(item.children, val)
  }
}

const subAppChange = (val: boolean, item: any) => {
  const result = item.children.filter((el: any) => el.checked)
  if (result.length === item.children.length) {
    item.checked = true
    item.indeterminate = false
  } else if (result.length === 0) {
    item.checked = false
    item.indeterminate = false
  } else {
    item.checked = false
    item.indeterminate = true
  }
}

watchEffect(() => {
  if (tree.value.isExport && tree.value.isDownload) {
    btnPerm.value = true
    btnPermIndeterminate.value = false
  } else if (tree.value.isExport || tree.value.isDownload) {
    btnPerm.value = false
    btnPermIndeterminate.value = true
  } else {
    btnPerm.value = false
    btnPermIndeterminate.value = false
  }
})

// 显示为情况4的元素permissionKey列表（父元素不显示checkbox，子元素显示开关）
const parentWithChildSwitchKeys = ['userfFocus'] // 用户聚焦关注

// 判断是否应该显示子元素为开关模式
const shouldShowChildrenWithSwitch = (item: any) => {
  return parentWithChildSwitchKeys.includes(item.permissionKey)
}

const btnPermChange = (val: boolean) => {
  btnPerm.value = val
  tree.value.isExport = val
  tree.value.isDownload = val
  btnPermIndeterminate.value = false
}

// 处理下钻开关变化
const handleDrillDownChange = (val: boolean, item: any, parentItem?: any) => {
  // 同步更新子元素的drillDownPermission状态
  if (item.drillDownPermissionList) {
    // 如果是子项的开关变化，并且有父项引用
    if (val && parentItem) {
      // 更新父项的下钻权限状态
      parentItem.drillDownPermission = val
    }
    item.drillDownPermissionList.forEach((child: any) => {
      // 同步子元素的drillDownPermission
      child.drillDownPermission = val
    })
  }
}

defineExpose({ allChange })
</script>

<style lang="scss" scoped>
.permissionTree {
  &::v-deep(.arco-checkbox-checked .arco-checkbox-icon) {
    background-color: #0082d6;
  }
  &::v-deep(.arco-checkbox-indeterminate .arco-checkbox-icon) {
    background-color: #0082d6;
  }
  &::v-deep(.arco-switch-checked) {
    background-color: #0082d6;
  }
}
.permission-wrapper {
  margin-top: 20px;
  display: flex;
  width: 100%;
  /* height: 397px; */
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #dde3ee;

  font-size: 14px;
  color: #4b5468;
  line-height: 24px;

  .pw-first {
    padding: 0 10px;
    display: flex;
    align-items: center;
    min-width: 105px;
  }
  .pw-two {
    .pwt-item {
      display: flex;
      align-items: center;
      padding: 16px 24px 15px;
      /* min-height: 55px; */
      border-left: 1px solid rgba(#26292e, 0.15);
      border-bottom: 1px solid rgba(#26292e, 0.15);
      &:last-child {
        border-bottom: none;
      }
      .item-line {
        width: 1px;
        height: 24px;
        background: rgba(#26292e, 0.15);
        margin: 0 10px;
      }

      .drill-down-switch {
        flex: 1;
        justify-content: flex-end;
        display: flex;
        align-items: center;

        .drill-down-text {
          margin-right: 8px;
          color: #6e7b91;
        }

        :deep(.fixed-width-switch) {
          .arco-switch-text-holder {
            display: inline-block;
            min-width: 22px;
          }
        }
      }

      .children-switch-container {
        flex: 1;
        margin-left: 26px;

        .children-items {
          width: 100%;
          margin-top: 10px;

          .child-item {
            display: flex;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid rgba(#26292e, 0.08);

            &:last-child {
              border-bottom: none;
            }

            .child-name {
              margin-right: auto;
              color: #4b5468;
            }
          }
        }
      }
    }
    .parent-switch-container {
      flex-direction: column;
      align-items: initial;
    }
  }
}
.permission-btn-wrapper {
  display: flex;
  align-items: center;
  border-radius: 8px 8px 8px 8px;
  border: 1px solid #dde3ee;
  margin-top: 24px;

  .pbw-left {
    padding: 15px 24px;
  }
  .pbw-right {
    border-left: 1px solid rgba(#26292e, 0.15);
    padding: 15px 24px;
  }
}
</style>
