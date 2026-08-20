<template>
  <div class="flex-align-center pl-40 DisplayItem" :class="[wrapperClass, '']">
    <div class="icon-wrapper bgc-def radius-4 felx-xy-center pl-8 pt-9">
      <SvgIcon :name="icon" :width="iconWidth" :height="iconHeight"></SvgIcon>
    </div>
    <div class="ml-16">
      <div class="flex-align-center color-333 font-14 lh-24">
        <span>{{ label }}</span>

        <a-tooltip :content="toolTipContent">
          <slot name="toolTip">
            <SvgIcon name="information-line" width="16px" height="16px" class="ml-8"></SvgIcon>
          </slot>
        </a-tooltip>
      </div>

      <div>
        <span class="color-000 font-24 fw-900 lh-28"> {{ num || '-' }}</span>
        <span class="font-12 color-999 ml-8 lh-24">环比: </span>
        <RatioRY :value="ratio" class="ml-2"></RatioRY>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  wrapperClass?: string
  // 是否显示下边框
  label: string | undefined
  num: string | number | undefined
  ratio: string | undefined
  // ratioStatus?: 1 | 2
  icon?: string
  iconWidth?: string
  iconHeight?: string
  numWidth?: string
  numClass?: string
  ratioWrapperClass?: string
  toolTipContent?: string
}
const {
  label,
  num,
  ratio,
  icon,
  wrapperClass,
  iconWidth = '25px',
  iconHeight = '25px',
  toolTipContent = 'xxxxxxx'
} = defineProps<Props>()
</script>

<style lang="scss" scoped>
.DisplayItem {
  height: 121px;

  .icon-wrapper {
    width: 42px;
    height: 42px;
  }
}
</style>
