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
        <Briefing mapKey="warning" :data="briefingData"></Briefing>
      </div>
      <div class="f-card">
        <FDTabs v-model="activeTab" :tabs="tabsList"></FDTabs>
        <div style="min-height: 300px">
          <RiskTrendChange
            v-if="activeTab === 1 && Object.keys(dateParams)?.length"
            :dateParams="dateParams"
            map-key="warning"
          ></RiskTrendChange>
          <SoundList v-if="activeTab === 2" mapKey="warning"></SoundList>
          <UserList v-if="activeTab === 4" mapKey="warning"></UserList>
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
import useComQueryStore from '@/stores/modules/comQuery'
import { warningGetBriefReport } from '@/service/riskWarning'
import { value2rem } from '@/utils/rem'

const visible = defineModel({ default: false })
const drillDownStore = useDrillDownStore()
const comQueryStore = useComQueryStore()
const activeTab = ref(-1)

const tabsList = computed(() => {
  const userItem =
    drillDownStore.riskWarningInitData.riskType === 'user'
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

const briefingData = ref({})
const dateParams = ref<any>({})
const init = async () => {
  const [, data] = await to(
    warningGetBriefReport({
      ...comQueryStore.requiredForm,
      ...comQueryStore.formByWarning,
      riskId: drillDownStore.riskWarningInitData.riskId,
      riskLevel: drillDownStore.riskWarningInitData.riskLevelS,
      tagLabelList: drillDownStore.riskWarningInitData.tagLabelList
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
  const { risk } = drillDownStore.riskWarningInitData

  return risk
})

const handleOpen = () => {
  console.log('drillDownStore.riskInitData', drillDownStore.riskWarningInitData)
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
