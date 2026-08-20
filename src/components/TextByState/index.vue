<template>
  <!-- 该组件已废弃 请使用RatioRY替代 -->
  <span :class="[computedClass, 'flex-inline', 'align-center']">
    <span class="font-12 lh-24">{{ numStr }}</span>
    <i
      v-if="transitionNum && transitionNum !== 0 && numStr !== '新发'"
      class="font-16 ml-4 lh-24"
      :class="[transitionNum > 0 ? 'ri-arrow-up-s-fill' : 'ri-arrow-down-s-fill']"
    ></i>
    <span v-else class="pl-16 ml-4"></span>
  </span>
</template>

<script lang="ts" setup>
interface Porps {
  num: string | number | undefined | null
}

const { num } = defineProps<Porps>()

const computedClass = computed(() => {
  if (transitionNum.value === '新发') {
    return 'color-d92d3c'
  }
  if (transitionNum.value > 0) {
    return 'color-d92d3c'
  }
  if (transitionNum.value < 0) {
    return 'color-009949'
  }
  if (transitionNum.value === 0) {
    return 'color-333'
  }
})

const transitionNum = computed((): any => {
  if (num === undefined || num === null) {
    return '-'
  }
  if (Number(num) >= 999.99) {
    return '新发'
  }
  if (Number(num) < -999.99) {
    return -999.99
  }
  return Number(num)
})

const numStr = computed(() => {
  // if (!num) {
  //   return 0 + '%'
  // }

  if (Number(num) >= 999.99) {
    return '新发'
  }
  if (typeof transitionNum.value === 'number') {
    return Math.abs(transitionNum.value) + '%'
  } else {
    return transitionNum.value
  }
})
</script>

<style lang="scss" scoped></style>
