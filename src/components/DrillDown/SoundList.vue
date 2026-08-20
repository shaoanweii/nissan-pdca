<template>
  <div
    class="doc-list pxy-24 flex direction-column"
    :class="{ mhc: ['vocViewInRisk', 'warning'].includes(mapKey) }"
  >
    <OrderBtn order-key="publish_time" @change="handleOrderChange"></OrderBtn>

    <div class="flex-1 flex direction-column h-full mt-24">
      <div class="flex flex-1-0-auto" style="height: 0">
        <div class="border-right-f6f6f6" style="width: 460px; height: 100%; overflow-y: auto">
          <!-- <div v-for="item of 100" :key="item">1111--{{ item }}</div> -->
          <template v-if="table.list?.length">
            <div
              v-for="(item, index) of table.list"
              :key="
                table.pageNum === 1 ? index + 1 : (table.pageNum - 1) * table.pageSize + index + 1
              "
              class="py-16 pl-24 pr-33 flex font-14 lh-20 color-333 border-bottom-f6f6f6 point"
              :class="{ active: index === active }"
              @click="handleChange(item, index)"
            >
              <div style="min-width: 26px" class="fw-600 mr-5">
                <!-- {{ index + 1 }}. -->
                {{
                  table.pageNum === 1
                    ? index + 1
                    : (table.pageNum - 1) * table.pageSize + index + 1
                }}.
              </div>
              <div class="flex-1">
                <span>{{ handleStrBySliceNum(item?.originalTextScene, 50) }}</span>
                <div class="color-999 mt-10">{{ item.opinion || '-' }}</div>
              </div>
            </div>
          </template>
          <template v-else>
            <FEmpty />
          </template>
        </div>
        <div class="flex-1 ml-24 flex-direction-column">
          <div class="font-16 lh-24 color-4b5468">原文内容</div>
          <template v-if="curDetail">
            <div class="flex mt-24">
              <SvgIcon name="avatar-male" width="44px" height="44px"></SvgIcon>
              <div class="flex-1 ml-12">
                <div class="color-666 flex-align-center justify-between">
                  <div class="font-14 lh-20">{{ curDetail?.username }}</div>
                  <div class="font-12 lh-16">{{ curDetail?.channelName }}</div>
                </div>
                <div class="color-666 flex-align-center justify-between">
                  <div class="font-14 lh-20">
                    {{ curDetail?.provinceName }} | {{ curDetail?.bizCreateTime }}
                  </div>
                  <div class="font-12 lh-16">{{ curDetail?.channelBiz }}</div>
                </div>
              </div>
            </div>
            <div class="mt-16">
              <div class="color-666 font-14 lh-22">
                <span>车系：</span>
                <span>{{ curDetail?.carSeriesName }}</span>
              </div>
              <div class="color-666 font-14 lh-22 mt-5">
                <span>分类：</span>
                <span>{{ curDetail?.focus }}</span>
              </div>
              <div class="color-666 font-14 lh-22 mt-5">
                <span>观点：</span>
                <span>{{ curDetail?.opinion }}</span>
              </div>
            </div>
            <div
              class="mt-16 bgc-def radius-8 flex-1-0-auto border-def py-16 px-24 font-14"
              style="height: 0; overflow-y: auto"
            >
              <div>
                {{ curDetail?.originalTextScene }}
              </div>
            </div>
          </template>
          <template v-else>
            <FEmpty />
          </template>
        </div>
      </div>
      <div style="flex: none" class="line-26292e"></div>
      <div style="flex: none" class="flex-justify-end">
        <FPagination
          v-model:current="table.pageNum"
          :total="table.total"
          :pageSize="table.pageSize"
          @change="handlePageChange"
        ></FPagination>
        <!-- <a-pagination
          v-model:current="table.pageNum"
          v-model:page-size="table.pageSize"
          :total="table.total"
          show-total
          show-jumper
          @change="handlePageChange"
        /> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getRiskUserVoice, getUserVoice, getUserVoiceDetail } from '@/service/vocOverview'
import { useTable } from '@/hooks/useTable'
import useComQueryStore from '@/stores/modules/comQuery'
import to from 'await-to-js'
import OrderBtn from './OrderBtn.vue'
import { handleStrBySliceNum } from '@/utils'
import useDrillDownStore from '@/stores/modules/drillDown'
import { Message } from '@arco-design/web-vue'
import { indexDetectionGetUserVoice, indexGetUserVoiceDetail } from '@/service/experienceTest'
import { focusGetUserVoice, focusGetUserVoiceDetail } from '@/service/focus'
import useFocusStore from '@/stores/modules/focus'
import { insightGetUserVoice, insightGetUserVoiceDetail } from '@/service/insights'
import { warningGetRiskUserVoice, warningGetUserVoiceDetail } from '@/service/riskWarning'
import { cloneDeep } from 'lodash-es'
import { getUserVoiceByPraise, getUserVoiceDetailByPraise } from '@/service/praise'
import { usePageLoading } from '@/hooks/usePageLoading'

interface Props {
  mapKey: MapKey
}
const { mapKey } = defineProps<Props>()

const comQueryStore = useComQueryStore()
const drillDownStore = useDrillDownStore()
const focusStore = useFocusStore()
const active = ref(0)
const { loadStart, loadDone } = usePageLoading()

const queryApi = computed(() => {
  const queryApiMap: Record<MapKey, any> = {
    vocView: getUserVoice,
    vocViewInRisk: getRiskUserVoice,
    testing: indexDetectionGetUserVoice,
    focus: focusGetUserVoice,
    insights: insightGetUserVoice,
    warning: warningGetRiskUserVoice,
    praise: getUserVoiceByPraise
  }
  return queryApiMap[mapKey]
})

const detailApi = computed(() => {
  const api: Record<MapKey, any> = {
    vocView: getUserVoiceDetail,
    vocViewInRisk: getUserVoiceDetail,
    testing: indexGetUserVoiceDetail,
    focus: focusGetUserVoiceDetail,
    insights: insightGetUserVoiceDetail,
    warning: warningGetUserVoiceDetail,
    praise: getUserVoiceDetailByPraise
  }
  return api[mapKey]
})

const { table, getList, handleCurrentChange } = useTable({
  queryApi: queryApi.value
})

const curDetail = ref<Record<string, any>>()

const baseFormMap = computed(() => {
  const map: Record<MapKey, any> = {
    vocView: { ...comQueryStore.requiredForm, ...comQueryStore.formByVocView },
    vocViewInRisk: { ...comQueryStore.requiredForm, ...comQueryStore.formByVocView },
    testing: { ...comQueryStore.requiredForm, ...comQueryStore.formByTesting },
    focus: { ...comQueryStore.requiredForm, ...comQueryStore.formByFocus },
    insights: { ...comQueryStore.requiredForm, ...comQueryStore.formByInsights },
    warning: { ...comQueryStore.requiredForm, ...comQueryStore.formByWarning },
    praise: { ...comQueryStore.requiredForm, ...comQueryStore.formByPraise }
  }
  return map[mapKey]
})

onMounted(async () => {
  table.filter = cloneDeep(baseFormMap.value)
  table.filter.order = 'publish_time desc'
  if (mapKey === 'vocViewInRisk') {
    table.filter.riskId = drillDownStore.riskInitData.riskId || undefined
    if (drillDownStore.riskInitData.riskType === 'user') {
      // table.filter.intention = ['投诉']
    } else {
      table.filter.sentimentList = ['负面']
    }
  }

  if (mapKey === 'testing') {
    table.filter.labelTypeLevelFourList = drillDownStore.fourTagName
    table.filter.userJourneyCode = drillDownStore.indexInitData.userJourneyCode
    table.filter.labelTypeLevelFirstList = drillDownStore.indexInitData.labelTypeLevelFirstList
  }

  if (mapKey === 'focus') {
    table.filter.tagType = focusStore.tagType
    table.filter.topicList = drillDownStore.topicList
    table.filter = Object.assign(table.filter, drillDownStore.focusInitData.labelTypeLevelList)

    if (['PROD', 'SERVICE'].includes(focusStore.tagType)) {
      table.filter.faultLevelList = undefined
      table.filter.sentimentList = drillDownStore.focusEmotionName
    }
    if (['QY'].includes(focusStore.tagType)) {
      table.filter.sentimentList = undefined
      table.filter.faultLevelList = drillDownStore.focusEmotionName
    }
  }

  if (mapKey === 'insights') {
    table.filter.tagType = drillDownStore.insightTagType

    if (drillDownStore.insightInitData.level?.toString() === '2') {
      table.filter.labelTypeLevelSecondList = drillDownStore.insightTagName
      table.filter.labelTypeLevelFourList = undefined
    }
    if (drillDownStore.insightInitData.level?.toString() === '4') {
      table.filter.labelTypeLevelSecondList = undefined
      table.filter.labelTypeLevelFourList = drillDownStore.insightTagName
    }
    table.filter.mentionCarSeries = drillDownStore.insightInitData?.mentionCarSeries
    // table.filter.carSeries = drillDownStore.insightInitData?.carSeries
    // 本竞品车系同时提及分析 默认传本品车系
    if (drillDownStore.insightInitData?.carSeriesList) {
      table.filter.carSeriesList = drillDownStore.insightInitData?.carSeriesList
    }

    table.filter.reportType = drillDownStore.insightInitData?.reportType
    table.filter.labelTypeLevelFirstList = drillDownStore.insightInitData.labelTypeLevelFirstList
  }

  if (mapKey === 'warning') {
    table.filter.riskId = drillDownStore.riskWarningInitData.riskId || undefined
    table.filter.tagLabelList = drillDownStore.riskWarningInitData.tagLabelList || undefined
    if (drillDownStore.riskWarningInitData.riskType === 'user') {
      // table.filter.intention = ['投诉']
    } else {
      table.filter.sentimentList = ['负面']
    }
  }

  if (mapKey === 'praise') {
    const { viewType, labelType } = drillDownStore.praiseInitData
    table.filter.labelTypeList = labelType ? [labelType] : undefined
    if (viewType === 1) {
      table.filter.bigAreaIds = drillDownStore.praiseInitData?.data?.tagCode || undefined
    } else {
      table.filter.bigAreaIds = undefined
    }

    if (viewType === 2) {
      table.filter.carSeries = drillDownStore.praiseInitData?.data?.tagName || undefined
    } else {
      table.filter.carSeries = undefined
    }

    if ([3, 4].includes(viewType)) {
      table.filter.topicList = drillDownStore.praiseInitData?.tagName
        ? [drillDownStore.praiseInitData?.tagName]
        : undefined

      table.filter.tagLabelList = drillDownStore.praiseInitData?.tagLabelList
    } else {
      table.filter.topicList = undefined
      table.filter.tagLabelList = undefined
    }

    table.filter = Object.assign(table.filter, drillDownStore.praiseInitData.labelTypeLevelList)
  }
  loadStart()
  await getList()
  if (table.list?.[0]) {
    getDetail(table.list?.[0]?.newId)
  }
  loadDone(true)
})

const handlePageChange = async (pageNum: number) => {
  active.value = 0
  handleCurrentChange(pageNum)
}

const handleOrderChange = async (order: string) => {
  table.filter.order = order
  active.value = 0
  await getList(true)
  if (table.list?.[0]) {
    getDetail(table.list?.[0]?.newId)
  }
}

const getDetail = async (newId: string) => {
  const [errs, data] = await to(detailApi.value({ ...baseFormMap.value, newId }))
  if (errs) {
    Message.error(errs.message)
  }
  if (data) {
    curDetail.value = (data as any)?.result
  }
}

const handleChange = (item: any, index: number) => {
  active.value = index
  getDetail(item.newId)
}
</script>

<style lang="scss" scoped>
.doc-list {
  height: calc(100% - 64px);
  min-height: 500px;

  &.mhc {
    min-height: calc(100vh - 64px);
  }
  .active {
    /* background: rgba(17, 104, 202, 0.1); */
    background: #f0f3fa;
    color: #333;
    /* border-bottom: 1px solid rgba(#1168ca, 0.5); */
    border-bottom: 1px solid #2c9bde;
  }
}
</style>
