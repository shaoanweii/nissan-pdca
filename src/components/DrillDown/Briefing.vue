<template>
  <div class="flex">
    <div
      style="width: 40px; flex: none"
      class="border-def bgc-def color-000 font-16 lh-24 flex-xy-center direction-column"
    >
      <div>简</div>
      <div>报</div>
    </div>
    <div style="flex: 1" class="font-14 lh-22 color-666 pl-40 pb-17">
      <a-row class="mt-50">
        <a-col flex="1">
          <div class="">问题周期/时间</div>
          <div class="mt-2 flex-align-center">
            <span class="font-20 lh-24 fw-600">{{ data?.dateUnit }}/</span>
            <span class="lh-20 color-999"> ({{ data?.startDate }}- {{ data?.endDate }})</span>
          </div>
        </a-col>
        <a-col v-if="isUser" flex="1" class="border-left-def pl-20">
          <!-- <div>投诉观点数</div> -->
          <div>负面观点数</div>
          <div class="flex-align-center mt-7">
            <!-- 投诉观点数 -->
            <!-- <div class="font-20 lh-20 mr-8">{{ data?.complainC }}</div> -->
            <div class="font-20 lh-20 mr-8">{{ data?.negativeC }}</div>
            <RatioRY :value="data?.complainRp"></RatioRY>
          </div>
        </a-col>
        <a-col v-else flex="1" class="border-left-def pl-20">
          <div>负面观点数</div>
          <div class="flex-align-center mt-7">
            <div class="font-20 lh-20 mr-8">{{ data?.negativeC }}</div>
            <RatioRY :value="data?.negativeRp"></RatioRY>
          </div>
        </a-col>
        <a-col v-if="isUser" flex="1" class="border-left-def pl-20">
          <div>体验指数</div>
          <div class="flex-align-center mt-7">
            <div class="font-20 lh-20 mr-8">{{ data?.emotionC }}</div>
            <RatioRY :value="data?.emotionRp"></RatioRY>
          </div>
        </a-col>
        <a-col v-else flex="1" class="border-left-def pl-20">
          <div>用户数</div>
          <div class="flex-align-center mt-7">
            <div class="font-20 lh-20 mr-8">{{ data?.userC }}</div>
            <RatioRY :value="data?.userRp"></RatioRY>
          </div>
        </a-col>
        <a-col flex="1" class="border-left-def pl-20">
          <div>风险等级</div>
          <div class="font-24 lh-20 mt-10 fw-600" :class="[riskColorMap[data?.riskLeve]]">
            {{ data?.riskLeve }}
          </div>
        </a-col>
      </a-row>

      <div class="mt-23 mb-10 flex-align-center">
        <div>涉及车系：</div>
        <div class="ml-4">{{ data?.carSeriesName }}</div>
      </div>
      <div v-if="isUser" class="mt-19 flex-align-center">
        <div class="flex-none mb-10">聚焦问题：</div>
        <div style="width: 100%" class="pr-20">
          <template v-for="(item, index) of focusNames?.slice(0, 10)" :key="index">
            <div class="mr-10 mb-10 flex-inline">
              {{ item }}
            </div>
          </template>
          <div v-if="focusNames?.length > 10" class="mr-10 mb-10 font-12 lh-14 flex-inline">
            <span>+</span>
            <span>{{ focusNames?.length - 10 }}</span>
          </div>
        </div>
      </div>
      <div class="mt-9 flex-align-center">
        <div class="flex-none mb-10">观点热词：</div>
        <div style="width: 100%" class="pr-20">
          <template v-for="(item, index) of data?.opinionWord?.slice(0, 10)" :key="index">
            <div class="border-def radius-4 lh-16 flex-inline px-12 py-6 mr-6 mb-10">
              {{ item.name }}
              <span class="font-12 lh-14 color-2c9bde ml-5">({{ item.value }})</span>
            </div>
          </template>
          <div
            v-if="data?.opinionWord?.length > 10"
            class="border-def radius-4 lh-16 flex-inline px-12 py-6 mr-6 mb-10"
          >
            <!-- color-2c9bde -->
            <span class="font-12 lh-14">+</span>
            <span class="font-12 lh-14">{{ data?.opinionWord?.length - 10 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { riskColorMap } from '@/constant'
import useDrillDownStore from '@/stores/modules/drillDown'

interface Props {
  data: Record<string, any>
  mapKey: MapKey
}

const { data, mapKey } = defineProps<Props>()
const drillDownStore = useDrillDownStore()
const isUser = computed(() => {
  const map: Record<any, any> = {
    vocViewInRisk: drillDownStore.riskInitData.riskType === 'user',
    warning: drillDownStore.riskWarningInitData.riskType === 'user'
  }
  return map[mapKey]
})

const focusNames = computed(() => {
  return data.focusNames?.split(',')
})
</script>

<style lang="scss" scoped></style>
