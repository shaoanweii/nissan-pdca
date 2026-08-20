<template>
  <div class="font-13 lh-18 flex-align-center">
    <template v-for="(item, index) of list" :key="index">
      <div class="flex-align-center" :class="{ 'ml-27': index > 0 }">
        <SvgIcon :name="emitionMap[item.code]" width="18" height="18px"></SvgIcon>
        <div class="ml-8" :class="[emitionColorMap[item.code]]">
          {{ item.value }}({{ `${item.startThresholdValue}${index === 0 ? '≤' : '<'}` }}体验指数≤{{
            item.endThresholdValue
          }})
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import useUserStore from '@/stores/modules/user'
import { emitionMap, emitionColorMap } from '@/constant'
import { cloneDeep } from 'lodash-es'

const userStore = useUserStore()

const list = computed(() => {
  const list = cloneDeep(userStore.exponentialThreshold)
  return list
    ?.sort((a, b) => a.code - b.code)
    .map(el => {
      return {
        ...el,
        startThresholdValue: Number(el.startThresholdValue)?.toFixed(0),
        endThresholdValue: Number(el.endThresholdValue)?.toFixed(0)
      }
    })
})
</script>

<style lang="scss" scoped></style>
