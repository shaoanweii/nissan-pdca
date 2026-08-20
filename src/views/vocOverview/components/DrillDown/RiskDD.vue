<template>
  <a-drawer
    class="f-drawer"
    :width="value2rem(1150)"
    :visible="visible"
    :footer="false"
    @ok="handleOk"
    @cancel="handleCancel"
    @open="handleOpen"
    unmountOnClose
  >
    <template #title>
      <span class="fd-title">{{ titleStr }}</span>
    </template>
    <div class="fd-content clear-border" style="overflow-y: auto">
      <!-- <div style="height: 216px" class="w-full f-card mb-24 overflow-hidden"> -->
      <div class="f-card mb-24">
        <Briefing mapKey="vocViewInRisk" :data="briefingData"></Briefing>
      </div>
      <div class="f-card">
        <FDTabs v-model="activeTab" :tabs="tabsList"></FDTabs>
        <div style="min-height: 300px">
          <RiskTrendChange
            v-if="activeTab === 1 && Object.keys(dateParams)?.length"
            mapKey="vocViewInRisk"
            :dateParams="dateParams"
          ></RiskTrendChange>
          <SoundList v-if="activeTab === 2" mapKey="vocViewInRisk"></SoundList>
          <UserList v-if="activeTab === 4" mapKey="vocViewInRisk"></UserList>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<script lang="ts" setup>
import FDTabs from '@/components/DrillDown/FDTabs.vue'
import UserList from '@/components/DrillDown/UserList.vue'
import SoundList from '@/components/DrillDown/SoundList.vue'
import Briefing from '@/components/DrillDown/Briefing.vue'
import RiskTrendChange from '@/components/DrillDown/RiskTrendChange.vue'
import useDrillDownStore from '@/stores/modules/drillDown'
import to from 'await-to-js'
import { getBriefReport } from '@/service/vocOverview'
import useComQueryStore from '@/stores/modules/comQuery'
import { value2rem } from '@/utils/rem'

const visible = defineModel({ default: false })
const drillDownStore = useDrillDownStore()
const comQueryStore = useComQueryStore()
const activeTab = ref(-1)

const tabsList = computed(() => {
  const userItem =
    drillDownStore.riskInitData.riskType === 'user'
      ? []
      : [
          {
            label: '用户列表',
            value: 4
          }
        ]
  return [
    {
      label: '趋势变化',
      value: 1
    },
    {
      label: '观点列表',
      value: 2
    },
    ...userItem
  ]
})

const briefingData = ref<Record<any, any>>({})
const dateParams = ref<any>({})
const init = async () => {
  const [, data] = await to(
    getBriefReport({
      ...comQueryStore.requiredForm,
      ...comQueryStore.formByVocView,
      riskId: drillDownStore.riskInitData.riskId,
      riskLevel: drillDownStore.riskInitData.riskLevelS
      // labelTypeLevelFourList: ['提车等待时间的长短']
    })
  )
  if (data?.result) {
    briefingData.value = data.result

    dateParams.value.datePeriod = data.result.datePeriod
    dateParams.value.startDate = data.result.startDate
    dateParams.value.endDate = data.result.endDate
  }
}

/**
 * 事件风险  标签风险  1级#4级
 * 用户风险就是用户名
 */
const titleStr = computed(() => {
  const { riskType, risk, title } = drillDownStore.riskInitData

  if (riskType === 'user') {
    return risk
  } else if (riskType === 'event') {
    return `${title}#${risk}`
  }
})

const handleOpen = () => {
  // console.log('drillDownStore.riskInitData', drillDownStore.riskInitData)
  activeTab.value = 1
  init()
}
const handleOk = () => {}

const handleCancel = () => {
  visible.value = false
  activeTab.value = -1
  dateParams.value = {}
}
</script>

<style lang="scss"></style>
