<template>
  <div class="radius-4 pt-12 pb-4 px-20 bg-white border-def GaugeTooltip">
    <div class="font-13 lh-18 w-full flex" style="flex-wrap: wrap">
      <template v-for="(item, index) of list" :key="index">
        <div class="flex-align-center mb-8" style="width: 50%">
          <SvgIcon :name="emitionMap[item.code]" width="18" height="18px"></SvgIcon>
          <div class="ml-8" :class="[emitionColorMap[item.code]]">
            {{ item.value }}({{
              `${item.startThresholdValue}${index === 0 ? '≤' : '<'}`
            }}体验指数≤{{ item.endThresholdValue }})
          </div>
        </div>
      </template>
    </div>
    <!-- <div class="flex-align-center">
      <span class="color-999 font-14 lh-20 ml-5">1111</span>
    </div> -->

    <div class="flex-align-center py-6 bgc-def font-14 lh-20 color-26292e mb-6 border-radius4400">
      <div class="flex-1 text-align-center">名称</div>
      <div class="flex-1 text-align-center">数值</div>
      <div class="flex-1 text-align-right"><span class="pr-16">环比</span></div>
      <div class="flex-1 text-align-right"><span class="pr-16">同比</span></div>
    </div>
    <div class="flex-align-center py-6 font-12 color-26292e">
      <div class="flex-1 text-align-center flex-xy-center ellipsis-single-line">
        <div class="ml-5">体验指数</div>
      </div>
      <div class="flex-1 text-align-center ellipsis-single-line">
        <div class="flex-1 flex-xy-center ellipsis-single-line">
          <img :src="emitionBase64Map[1]" class="block-1616" />
          <span :class="[emitionColorMap[1], 'ml-4']">{{
            formatToTwoDecimal(data?.eiNsrC) ?? '-'
          }}</span>
        </div>
      </div>
      <div class="flex-1 text-align-right">
        <RatioRY :value="data?.eiNsrRp"></RatioRY>
      </div>
      <div class="flex-1 text-align-right">
        <RatioRY :value="data?.eiNsrYp"></RatioRY>
      </div>
    </div>

    <div class="color-666 font-14 lh-30 my-8">
      注: 当前数据范围为全私域数据，以负面问题反馈为主。
    </div>
  </div>
</template>

<script lang="ts" setup>
import { emitionBase64Map, emitionColorMap, emitionMap } from '@/constant'
import { formatToTwoDecimal } from '@/utils'
import useUserStore from '@/stores/modules/user'
import { cloneDeep } from 'lodash-es'

const { data } = defineProps<{
  data: any
}>()

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

<style lang="scss" scoped>
.GaugeTooltip {
  width: 459px;
  box-shadow: 0px 24px 24px 0px rgba(0, 0, 0, 0.04);
}
</style>
