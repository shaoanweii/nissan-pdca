<template>
  <span :class="[computedClass, 'flex-inline', 'align-center']">
    <span class="font-12 lh-24">{{ numStr }}</span>
    <template v-if="placeholderIcon">
      <i
        v-if="!isArrow"
        class="font-16 ml-2 lh-24"
        :class="[transitionNum > 0 ? 'ri-arrow-up-long-line' : 'ri-arrow-down-long-line']"
      ></i>
      <span v-else class="pl-16 ml-2"></span>
    </template>
    <template v-else>
      <i
        v-if="!isArrow"
        class="font-16 ml-2 lh-24"
        :class="[transitionNum > 0 ? 'ri-arrow-up-long-line' : 'ri-arrow-down-long-line']"
      ></i>
    </template>
  </span>
</template>

<script lang="ts" setup>
import { RY_MAX_STR } from '@/constant'

/**
 * ri-arrow-up-long-line
 * ri-arrow-down-long-line
 *
 * ri-arrow-down-s-fill
 * ri-arrow-up-s-fill
 */
interface Porps {
  // 是否显示图标占位
  placeholderIcon?: boolean
  // 环比值
  value: string | number | undefined | null
}

const { value, placeholderIcon = true } = defineProps<Porps>()
/**
 * 同比/环比：数值区间为-999.99% ~ +999.99%，
 * 如+999.99%，显示为“新发”（无箭头），
 * 数值为空时显示“-”（无箭头），
 * 数值为0%时，不显示上下箭头，字体颜色为“999”。
 */
const isArrow = computed(() => {
  return numStr.value === RY_MAX_STR || numStr.value === '-' || transitionNum.value === 0
})

const computedClass = computed(() => {
  if (transitionNum.value === RY_MAX_STR) {
    // return 'color-d92d3c'
    // return 'color-009949'
    // return 'color-999'
    return 'color-666'
  }
  if (transitionNum.value > 0) {
    // return 'color-d92d3c'
    // return 'color-009949'
    // return 'color-999'
    return 'color-666'
  }

  if (transitionNum.value < 0) {
    // return 'color-009949'
    // return 'color-d92d3c'
    // return 'color-999'
    return 'color-666'
  }
  if (transitionNum.value === 0) {
    // return 'color-999'
    return 'color-666'
  }
  // return 'color-999'
  return 'color-666'
})

const transitionNum = computed((): any => {
  if (value === undefined || value === null) {
    return '-'
  }
  if (Number(value) >= 999.99) {
    // return RY_MAX_STR
    // return 999.99
    return '-'
  }
  if (Number(value) < -999.99) {
    // return -999.99
    return '-'
  }
  return Number(value)
})

const numStr = computed(() => {
  if (typeof transitionNum.value === 'number') {
    return Math.abs(transitionNum.value)?.toFixed(2) + '%'
  } else {
    return transitionNum.value
  }
})
</script>

<style lang="scss" scoped></style>
