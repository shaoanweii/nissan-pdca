<template>
  <div class="emotion-wrapper">
    <div class="emotion-bg" :class="[nsrg ? emitionBgColorMap[nsrg] : 'bg-bfc9dd-02']">
      <SvgIcon :name="emitionMap[nsrg || '']" width="48px" height="48px"></SvgIcon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { emitionMap, emitionBgColorMap } from '@/constant'

const { nsrg } = defineProps<{
  nsrg: string | null | undefined
}>()
</script>

<style lang="scss" scoped>
.emotion-wrapper {
  width: 98px;
  height: 98px;
  border-radius: 50%;
  border: 1px solid #dde3ee;
  display: flex;
  justify-content: center;
  align-items: center;

  .emotion-bg {
    width: 75px;
    height: 75px;
    /* background: rgba(39, 194, 159, 0.07); */
    border-radius: 50%;
    /* border: 0px solid #dde3ee; */
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
