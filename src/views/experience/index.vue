<template>
  <div class="page-container">
    <div class="content-header">
      <div class="flex-justify-between align-center">
        <div class="title mr-24">体验指数监测</div>
        <ComQuery
          controller="indexDetection"
          :displayFields="['time', 'region', 'carSeries', 'channel', 'query', 'reset']"
          @change="handleQuery"
        ></ComQuery>
      </div>
      <div class="ch-subtitle mt-7">
        <!-- {{ titleDescription.testing }} -->
        {{ userStore.verbal?.testingSubTitle }}
      </div>
    </div>

    <div class="container">
      <template v-if="isPage">
        <FCard
          titleIcon="bar-chart-box-line"
          :toolTipContent="userStore.verbal?.testingIndexPerformance"
          title="指数表现"
          height="385px"
          :extraDropdownKey="['2']"
          class="mt-20"
          @handleDropdown="handleDropdown"
        >
          <template #extra>
            <ELineDesc class="mr-16"></ELineDesc>
          </template>
          <IndexedPerformance ref="indexedPerformanceRef"></IndexedPerformance>
        </FCard>

        <FCard
          titleIcon="bookmark-3-line"
          :toolTipContent="userStore.verbal?.testingIndexDistribution"
          title="指数分布"
          height="auto"
          class="mt-20"
        >
          <ExponentialDistribution ref="exponentialDistributionRef"></ExponentialDistribution>
        </FCard>
      </template>
    </div>
    <IndexMaintenanceDD v-model="visible" @refresh="refreshIndexMaintenance"></IndexMaintenanceDD>
    <indexDD v-model="drillDown.indexVisible"></indexDD>
  </div>
</template>
<script lang="ts" setup>
import IndexedPerformance from './components/IndexedPerformance.vue'
import ExponentialDistribution from './components/ExponentialDistribution/index.vue'
import eventBus from '@/utils/eventBus'
import useExperienceTestStore from '@/stores/modules/experienceTest'
import IndexMaintenanceDD from './components/DrillDown/IndexMaintenanceDD/index.vue'
import indexDD from './components/DrillDown/indexDD/index.vue'
import ELineDesc from './components/ELineDesc.vue'
import { useBoolean } from '@/hooks/useBoolean'
import useDrillDownStore from '@/stores/modules/drillDown'
// import useComQueryStore from '@/stores/modules/comQuery'
import { useRoute } from 'vue-router'
import useUserStore from '@/stores/modules/user'
import { usePageLoading } from '@/hooks/usePageLoading'
import useCondition from '@/hooks/useCondition'
import { getConditions } from '@/service/experienceTest'

const experienceTestStore = useExperienceTestStore()
const drillDown = useDrillDownStore()
const userStore = useUserStore()
// const comQuery = useComQueryStore()
const { conditions } = useCondition(getConditions)

provide('conditions', conditions)

const { value: visible, setTrue } = useBoolean()
const route = useRoute()

const isPage = ref(false)

const indexedPerformanceRef = ref()
const exponentialDistributionRef = ref()

const { loadStart, loadDone } = usePageLoading()
const handleQuery = async () => {
  isPage.value = true
  loadStart()
  const indexType = route.query?.indexType ? Number(route.query?.indexType) : 1

  experienceTestStore.setIndexType(indexType as any)
  nextTick(() => {
    indexedPerformanceRef.value?.query()
    exponentialDistributionRef.value?.query()
    loadDone(true)
  })
}

const refreshIndexMaintenance = () => {
  // indexedPerformanceRef.value?.getIndicatorData()
  nextTick(() => {
    loadStart()
    indexedPerformanceRef.value?.query()
    exponentialDistributionRef.value?.query()
    loadDone(true)
  })
}

eventBus.on('brandChange', () => {
  handleQuery()
})

onBeforeUnmount(() => {
  eventBus.off('brandChange')
})

const handleDropdown = (value: string) => {
  if (value === '2') {
    setTrue()
  }
}
</script>
<style lang="scss" scoped></style>
