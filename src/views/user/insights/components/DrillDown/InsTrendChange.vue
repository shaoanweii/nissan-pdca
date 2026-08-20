<template>
  <div class="pxy-24">
    <div class="fw-600 font-16 lh-24 color-666 mb-6">{{ titleMap }}</div>

    <FEcharts
      :empty="!trendLine?.length"
      :options="echartOptions2"
      width="100%"
      height="454px"
    ></FEcharts>
  </div>
</template>

<script lang="ts" setup>
import { usePageLoading } from '@/hooks/usePageLoading'
import { getLinkageOpinionTrend } from '@/service/experienceTest'
import { focusGetLinkageOpinionTrend } from '@/service/focus'
import { insightGetLinkageOpinionTrend } from '@/service/insights'
import useComQueryStore from '@/stores/modules/comQuery'
import useDrillDownStore from '@/stores/modules/drillDown'
import useFocusStore from '@/stores/modules/focus'
import { defTooltip, toolTipPosition } from '@/utils/echartsConfig'
import { Message } from '@arco-design/web-vue'
import to from 'await-to-js'

interface Props {
  mapKey: MapKey
}
const { mapKey } = defineProps<Props>()

const comQueryStore = useComQueryStore()
const drillDownStore = useDrillDownStore()
const focusStore = useFocusStore()
const { loadStart, loadDone } = usePageLoading()

const trendLine = ref()

const titleMap = computed(() => {
  const map: Record<MapKey, string> = {
    testing: '指数排行及趋势',
    focus: '观点数排行及趋势',
    insights: '趋势变化',
    vocView: '',
    vocViewInRisk: '',
    warning: '',
    praise: ''
  }
  return map[mapKey]
})

const tagType = computed(() => {
  const map: Record<MapKey, string> = {
    testing: drillDownStore.testingTagType,
    focus: focusStore.tagType,
    insights: drillDownStore.insightTagType,
    vocView: '',
    vocViewInRisk: '',
    warning: '',
    praise: ''
  }
  return map[mapKey]
})

const insightsParamsByMapKey = computed(() => {
  const map: Record<string, any> = {
    2: { labelTypeLevelSecondList: drillDownStore.insightTagName },
    4: {
      labelTypeLevelFourList: drillDownStore.insightTagName,
      mentionCarSeries: drillDownStore.insightInitData?.mentionCarSeries,
      // carSeries: drillDownStore.insightInitData?.carSeries,
      carSeriesList: drillDownStore.insightInitData?.carSeriesList
    }
  }
  return map[drillDownStore.insightInitData.level]
})

const paramsByMapKey = computed(() => {
  const map: Record<MapKey, any> = {
    testing: {
      labelTypeLevelFourList: drillDownStore.fourTagName,
      userJourneyCode: drillDownStore.indexInitData.userJourneyCode,
      labelTypeLevelFirstList: drillDownStore.indexInitData.labelTypeLevelFirstList
    },
    focus: { topicList: drillDownStore.topicList },
    // insights: { labelTypeLevelFourList: drillDownStore.insightTagName }
    insights: insightsParamsByMapKey.value,
    vocView: undefined,
    vocViewInRisk: undefined,
    warning: undefined,
    praise: undefined
  }
  return map[mapKey]
})

// const queryApi = computed(() => {
//   const map: Record<MapKey, any> = {
//     testing: getOpinionTrend,
//     focus: focusGetOpinionTrend,
//     insights: insightGetOpinionTrend,
//     vocView: undefined,
//     vocViewInRisk: undefined,
//     warning: undefined
//   }
//   return map[mapKey]
// })

const detailApi = computed(() => {
  const map: Record<MapKey, any> = {
    testing: getLinkageOpinionTrend,
    focus: focusGetLinkageOpinionTrend,
    insights: insightGetLinkageOpinionTrend,
    vocView: undefined,
    vocViewInRisk: undefined,
    warning: undefined,
    praise: undefined
  }
  return map[mapKey]
})

const emotionNameParams = computed(() => {
  const tagMap: Record<Common.TagType, any> = {
    SERVICE: { sentimentList: mapKey === 'focus' ? drillDownStore.focusEmotionName : undefined },
    PROD: { sentimentList: mapKey === 'focus' ? drillDownStore.focusEmotionName : undefined },
    QY: { faultLevelList: mapKey === 'focus' ? drillDownStore.focusEmotionName : undefined }
  }
  return tagMap[focusStore.tagType]
})

const baseFormMap = computed(() => {
  const map: Record<MapKey, any> = {
    vocView: { ...comQueryStore.requiredForm, ...comQueryStore.formByVocView },
    vocViewInRisk: { ...comQueryStore.requiredForm, ...comQueryStore.formByVocView },
    testing: { ...comQueryStore.requiredForm, ...comQueryStore.formByTesting },
    focus: { ...comQueryStore.requiredForm, ...comQueryStore.formByFocus },
    insights: { ...comQueryStore.requiredForm, ...comQueryStore.formByInsights },
    warning: { ...comQueryStore.requiredForm, ...comQueryStore.formByWarning },
    praise: undefined
  }
  return map[mapKey]
})

const handleClick = async () => {
  // tagCode
  const [errs, data] = await to(
    detailApi.value({
      ...baseFormMap.value,
      ...paramsByMapKey.value,
      // bigAreaIds: tagType.value === 'SERVICE' ? params?.data?.tagCode : undefined,
      // carSeries: tagType.value === 'PROD' ? params?.name : undefined,
      tagType: tagType.value,
      ...emotionNameParams.value
    })
  )
  if (errs) {
    Message.error(errs.message)
  }
  if (data) {
    trendLine.value = (data as any)?.result?.trendLine
  }
}

const init = async () => {
  loadStart()
  handleClick()
  loadDone()
}

init()

const e2valueKeyByMapKey = computed(() => {
  const map: Record<MapKey, string> = {
    testing: 'nsrC',
    focus: 'tagSumC',
    insights: 'tagSumC',
    vocView: '',
    vocViewInRisk: '',
    warning: '',
    praise: ''
  }
  return map[mapKey]
})
const t1LabelByMapKey = computed(() => {
  const map: Record<MapKey, string> = {
    testing: '体验指数',
    focus: '观点数',
    insights: '观点数',
    vocView: '',
    vocViewInRisk: '',
    warning: '',
    praise: ''
  }
  return map[mapKey]
})

const echartOptions2 = computed(() => {
  const transitionData = trendLine.value?.reduce(
    (acc: any, cur: any) => {
      acc.date.push(cur.date)
      acc.s1Data.push({
        date: cur.date,
        name: t1LabelByMapKey.value,
        value: cur[e2valueKeyByMapKey.value],
        rp: cur.tagRp,
        yp: cur.tagYp
      })
      return acc
    },
    {
      date: [],
      s1Data: []
    }
  )
  return {
    tooltip: {
      show: true,
      trigger: 'axis',
      position: (point: any, params: any, dom: any, rect: any, size: any) => {
        return toolTipPosition(point, params, dom, rect, size)
      },
      formatter: (params: any) => {
        return defTooltip('line', params)
      },
      padding: 0,
      borderWidth: 0,
      borderColor: 'rgba(0, 0, 0, 0)'
    },
    grid: {
      left: 0,
      top: 10,
      right: 10,
      bottom: 30,
      containLabel: true
    },
    legend: {
      show: false,
      right: 10,
      icon: 'circle',
      itemHeight: 8,
      itemWidth: 8
    },
    xAxis: {
      type: 'category',
      axisTick: {
        show: false,
        lineStyle: {
          type: 'dashed'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'solid'
        }
      },
      data: transitionData?.date || []
    },
    yAxis: {
      type: 'value',
      axisTick: {
        show: false,
        lineStyle: {
          type: 'dashed'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '观点数',
        color: '#2C9BDE',
        // data: [1820, 1932, 1901, 1934, 11290, 11330, 11320],
        data: transitionData?.s1Data || [],
        type: 'line',
        smooth: true,
        symbol: 'none'
      }
    ]
  }
})
</script>

<style lang="scss" scoped></style>
