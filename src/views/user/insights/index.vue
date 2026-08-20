<template>
  <div class="page-container">
    <div class="content-header">
      <div class="flex-justify-between align-center">
        <div class="title mr-24">用户期待洞察</div>
        <ComQuery
          controller="userExpectInsight"
          :displayFields="['time', 'channel', 'region', 'carSeries', 'query', 'reset']"
          @change="handleQuery"
        ></ComQuery>
      </div>
      <div class="ch-subtitle mt-7">
        <!-- {{ titleDescription.insights }} -->
        {{ userStore.verbal?.insightsSubTitle }}
      </div>
    </div>

    <div class="container">
      <template v-if="isPage">
        <a-grid :cols="2" :col-gap="20" class="mt-24">
          <a-grid-item>
            <FCard
              titleIcon="car-washing-line"
              :toolTipContent="userStore.verbal?.insightsProdExpectationDistribution"
              title="产品期待分布"
              height="553px"
            >
              <template #extra>
                <FSwitchGroup
                  v-model="insightsStore.prodOrder"
                  class="mr-12"
                  :group="HighFrequencySurgeGroup"
                  @change="(val: any) => orderChange('PROD', val)"
                />
              </template>
              <ExpectedDistribution
                ref="prodED"
                tagType="PROD"
                :permission-code="permissionDict.productExpectationDistribution"
              ></ExpectedDistribution>
            </FCard>
          </a-grid-item>
          <a-grid-item>
            <FCard
              titleIcon="customer-service-line"
              :toolTipContent="userStore.verbal?.insightsServiceExpectationDistribution"
              title="服务期待分布"
              height="553px"
            >
              <template #extra>
                <FSwitchGroup
                  v-model="insightsStore.serviceOrder"
                  class="mr-12"
                  :group="HighFrequencySurgeGroup"
                  @change="(val: any) => orderChange('SERVICE', val)"
                />
              </template>
              <ExpectedDistribution
                ref="serviceED"
                tagType="SERVICE"
                :permission-code="permissionDict.serviceExpectationDistribution"
              ></ExpectedDistribution>
            </FCard>
          </a-grid-item>
        </a-grid>

        <FCard
          titleIcon="arrow-left-right-fill"
          :toolTipContent="userStore.verbal?.insightThisCompetitorAlsoMentioned"
          title="本竞品车系同时提及分析"
          height="961px"
          class="mt-24"
        >
          <div style="width: 100%; height: 98%; overflow: auto; display: flex">
            <template v-if="filterCarSeriesData?.length">
              <VehicleSeriesAnalysis
                v-for="item of filterCarSeriesData"
                :key="item.carSeriesName"
                :carItem="item"
                :permission-code="permissionDict.carSeriesAlsoMentionsAnalysis"
              />
            </template>
            <template v-else>
              <FEmpty />
            </template>
          </div>
        </FCard>
      </template>
    </div>

    <insightsDD v-model="drillDownStore.insightVisible"></insightsDD>
  </div>
</template>
<script lang="ts" setup>
import VehicleSeriesAnalysis from './components/VehicleSeriesAnalysis.vue'
import ExpectedDistribution from './components/ExpectedDistribution.vue'
import { HighFrequencySurgeGroup } from '@/constant'
import useInsightsStore from '@/stores/modules/insights'
import to from 'await-to-js'
import { getCarSeriesMentionedAnalysis } from '@/service/insights'
import useComQueryStore from '@/stores/modules/comQuery'
import { Message } from '@arco-design/web-vue'
import useDrillDownStore from '@/stores/modules/drillDown'
import insightsDD from './components/DrillDown/index.vue'
import eventBus from '@/utils/eventBus'
import { usePageLoading } from '@/hooks/usePageLoading'
import useUserStore from '@/stores/modules/user'
import { permissionDict } from '@/constant/permissionDict'

const isPage = ref(false)
const insightsStore = useInsightsStore()
const comQueryStore = useComQueryStore()
const drillDownStore = useDrillDownStore()
const userStore = useUserStore()

const prodED = ref()
const serviceED = ref()
const { loadStart, loadDone } = usePageLoading()
const handleQuery = async () => {
  nextTick(async () => {
    isPage.value = true
    loadStart()
    insightsStore.setProdOrderDefault()
    insightsStore.setServiceOrderDefault()
    setTimeout(() => {
      prodED.value?.init()
      serviceED.value?.init()
      getCarSeriesMentionedAnalysisData()
      loadDone(true)
    })
  })
}

/**
 * @description: 产品服务分布排序
 * @return {*}
 */
const orderChange = (
  tagType: Common.TagType,
  val: Common.FSwitchGroupItem<Common.HighFrequencySurgeGroupValue>
) => {
  if (tagType === 'PROD') {
    insightsStore.setProdOrder(val.value)
    prodED.value?.getTableData()
  } else if (tagType === 'SERVICE') {
    insightsStore.setServiceOrder(val.value)
    serviceED.value?.getTableData()
  }
}

const carSeriesData = ref<Record<any, any>[]>([])
const getCarSeriesMentionedAnalysisData = async () => {
  const [errs, data] = await to(
    getCarSeriesMentionedAnalysis({
      ...comQueryStore.requiredForm,
      ...comQueryStore.formByInsights
    })
  )
  if (errs) {
    Message.error(errs.message)
  }
  if (data) {
    carSeriesData.value = data.result || []
  }
}

const filterCarSeriesData = computed(() => {
  return carSeriesData.value?.filter((el: any) => el.billC !== null && el.billC?.toString() !== '0')
})

eventBus.on('brandChange', () => {
  handleQuery()
})

onBeforeUnmount(() => {
  eventBus.off('brandChange')
})
</script>
<style lang="scss" scoped></style>
