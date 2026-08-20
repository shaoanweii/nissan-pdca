<template>
  <span class="flex-align-center">
    <SvgIcon v-if="num" :name="emition" width="16px" height="16px"></SvgIcon>
    <span class="font-14 ml-7" :class="[emitionColor]">{{ handleNum }}</span>
  </span>
</template>

<script lang="ts" setup>
import { emitionColorMap, emitionMap } from '@/constant'

interface Props {
  emitionType: 1 | 2 | 3 | 4 | undefined
  num: number | undefined
}

const { emitionType = 1, num } = defineProps<Props>()

const emition = computed(() => {
  return emitionMap[emitionType]
})

const handleNum = computed(() => {
  return num?.toFixed(2) || '-'
  // return num && num?.toFixed(2)
})

const emitionColor = computed(() => {
  if (num === null || num === undefined) {
    return 'color-666'
  }
  return emitionColorMap[emitionType]
})
</script>

<style lang="scss" scoped></style>
