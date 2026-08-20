<template>
  <div class="page-container">
    <div class="content-header">
      <div class="flex-justify-between align-center">
        <div class="title mr-24">用户好评反馈</div>
        <ComQuery
          controller="favorableFeedback"
          :displayFields="['time', 'region', 'carSeries', 'channel', 'query', 'reset']"
          @change="handleQuery"
        ></ComQuery>
      </div>
      <div class="ch-subtitle mt-7">
        <!-- {{ titleDescription.praise }} -->
        {{ userStore.verbal?.praiseSubTitle }}
      </div>
    </div>

    <div class="container">
      <template v-if="isPage">
        <FCard
          titleIcon="bar-chart-box-line"
          :toolTipContent="userStore.verbal?.praiseTrendChange"
          title="好评反馈趋势"
          height="385px"
          class="mt-20"
        >
          <FeedbackTrend ref="feedbackRef"></FeedbackTrend>
        </FCard>

        <a-grid :cols="10" :col-gap="20" class="mt-20">
          <a-grid-item :span="3">
            <FCard
              titleIcon="car-washing-line"
              :toolTipContent="userStore.verbal?.praiseCarSeries"
              title="车系产品好评占比"
              height="538px"
            >
              <GoodReviewRatioChart
                ref="carSeriesRef"
                :chartType="'CAR_SERIES'"
                :permission-code="permissionDict.carSeriesProportion"
              ></GoodReviewRatioChart>
            </FCard>
          </a-grid-item>

          <a-grid-item :span="7">
            <FCard
              titleIcon="group-line-1"
              :toolTipContent="userStore.verbal?.praiseProductDistribution"
              title="产品好评TOP"
              height="538px"
            >
              <template #extra>
                <FCascader
                  v-model="prodTagLabelValue"
                  :options="prodTagOptions"
                  :check-strictly="false"
                  :path-mode="true"
                  :allowClear="false"
                  placeholder="产品分类"
                  :field-names="{ value: 'tagCode', label: 'tagName', children: 'child' }"
                  :tagProps="{ closable: false }"
                  class="border-def radius-4 bg-white overflow-hidden mr-10"
                  :style="{
                    width: '140px'
                  }"
                  @popupVisibleChange="(val: any) => tagLabelChange(val, 'PROD')"
                ></FCascader>
              </template>
              <GoodReviewTop
                ref="goodReviewByProdRef"
                :tagLabelList="prodTagLabelList"
                :tagType="'PROD'"
                :permission-code="permissionDict.prodProportion"
              ></GoodReviewTop>
            </FCard>
          </a-grid-item>
        </a-grid>
        <a-grid :cols="10" :col-gap="20" class="mt-20">
          <a-grid-item :span="3">
            <FCard
              titleIcon="earth-line"
              :toolTipContent="userStore.verbal?.praiseRegion"
              title="区域服务好评占比"
              height="538px"
            >
              <GoodReviewRatioChart
                ref="aeraRef"
                :chartType="'AREA'"
                :permission-code="permissionDict.regionalServicesProportion"
              ></GoodReviewRatioChart>
            </FCard>
          </a-grid-item>

          <a-grid-item :span="7">
            <FCard
              titleIcon="customer-service-2-line-2"
              :toolTipContent="userStore.verbal?.praiseServiceDistribution"
              title="服务好评TOP"
              height="538px"
            >
              <template #extra>
                <FCascader
                  v-model="serviceTagLabelValue"
                  :options="serviceTagOptions"
                  :check-strictly="false"
                  :path-mode="true"
                  :allowClear="false"
                  :field-names="{ value: 'tagCode', label: 'tagName', children: 'child' }"
                  :tagProps="{ closable: false }"
                  placeholder="服务分类"
                  class="border-def radius-4 bg-white overflow-hidden mr-10"
                  :style="{
                    width: '140px'
                  }"
                  @popupVisibleChange="(val: any) => tagLabelChange(val, 'SERVICE')"
                ></FCascader>
              </template>
              <GoodReviewTop
                ref="goodReviewByServiceRef"
                :tagLabelList="serviceTagLabelList"
                :tagType="'SERVICE'"
                :permission-code="permissionDict.servicesProportion"
              ></GoodReviewTop>
            </FCard>
          </a-grid-item>
        </a-grid>
      </template>
    </div>

    <indexDD v-model="drillDown.praiseVisible"></indexDD>
  </div>
</template>
<script lang="ts" setup>
import FeedbackTrend from './components/FeedbackTrend/index.vue'
import eventBus from '@/utils/eventBus'
import indexDD from './components/DrillDown/indexDD/index.vue'
import useDrillDownStore from '@/stores/modules/drillDown'
import useUserStore from '@/stores/modules/user'
import { usePageLoading } from '@/hooks/usePageLoading'
import GoodReviewRatioChart from './components/GoodReviewRatioChart.vue'
import GoodReviewTop from './components/GoodReviewTop.vue'
import useComQueryStore from '@/stores/modules/comQuery'
import to from 'await-to-js'
import { findTagLabelType } from '@/service/common'
import { Message } from '@arco-design/web-vue'
import { handleTagPath2CheckStrictly } from '@/utils'
import { permissionDict } from '@/constant/permissionDict'

const drillDown = useDrillDownStore()
const userStore = useUserStore()
const comQueryStore = useComQueryStore()

const isPage = ref(false)
const carSeriesRef = ref()
const aeraRef = ref()
const goodReviewByProdRef = ref()
const goodReviewByServiceRef = ref()

const prodTagLabelValue = ref()
const prodTagOptions = ref([])
const serviceTagOptions = ref([])
const serviceTagLabelValue = ref(undefined)

const feedbackRef = ref()

const { loadStart, loadDone } = usePageLoading()

const prodTagLabelList = computed(() => {
  return handleTagPath2CheckStrictly(prodTagLabelValue.value, prodTagOptions.value)
})

const serviceTagLabelList = computed(() => {
  return handleTagPath2CheckStrictly(serviceTagLabelValue.value, serviceTagOptions.value)
})

const getTagLabelType = async (tagType: Common.TagType) => {
  const params = {
    clientId: userStore.clientId,
    roleId: userStore.roleId,
    brandCode: comQueryStore.form?.brandCodeList?.[0] || userStore.brands[0]?.value,
    tagLibType: tagType
  }
  const [errs, data] = await to(findTagLabelType(params))
  if (errs) {
    Message.error(errs.message)
  }
  return data?.result || []
}
const handleQuery = async () => {
  isPage.value = true
  loadStart()
  prodTagOptions.value = await getTagLabelType('PROD')
  serviceTagOptions.value = await getTagLabelType('SERVICE')
  nextTick(async () => {
    await feedbackRef.value?.query()
    // 车系占比
    await carSeriesRef.value?.query()
    // 区域占比
    await aeraRef.value?.query()
    // 产品好评TOP
    goodReviewByProdRef.value?.query()
    // 服务好评TOP
    goodReviewByServiceRef.value?.query()
    loadDone(true)
  })
}

const tagLabelChange = (val: any, tagType: Common.TagType) => {
  if (tagType === 'PROD') {
    // handleTagPath2CheckStrictly(val, prodTagOptions.value)
    goodReviewByProdRef.value?.query()
  } else if (tagType === 'SERVICE') {
    // handleTagPath2CheckStrictly(val, serviceTagOptions.value)
    goodReviewByServiceRef.value?.query()
  }
}

eventBus.on('brandChange', () => {
  handleQuery()
})

onBeforeUnmount(() => {
  eventBus.off('brandChange')
})
</script>
<style lang="scss" scoped></style>
