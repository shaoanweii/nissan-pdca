<template>
  <div class="pxy-24">
    <div class="fw-600 font-16 lh-24 color-666 mb-6">{{ titleMap }}</div>
    <a-row class="mt-38">
      <a-col
        flex="290px"
        style="
          height: 454px;
          background: linear-gradient(180deg, #c2d0ec19 0%, #f0f3fa19 100%);
          box-shadow: inset 0px 0px 4px 1px rgba(102, 86, 86, 0.025);
          border-radius: 8px;
        "
      >
        <FEcharts
          :options="echartOptions1"
          :empty="!trendZhu?.length"
          linkageType="default"
          width="100%"
          height="454px"
          @handleClick="(params: any) => handleClick(params)"
        ></FEcharts>
      </a-col>
      <a-col flex="20px"></a-col>
      <a-col flex="auto" style="width: 0">
        <FEcharts
          :empty="!trendLine?.length"
          :options="echartOptions2"
          width="100%"
          height="454px"
        ></FEcharts>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { usePageLoading } from '@/hooks/usePageLoading'
import { getLinkageOpinionTrend, getOpinionTrend } from '@/service/experienceTest'
import { focusGetLinkageOpinionTrend, focusGetOpinionTrend } from '@/service/focus'
import { insightGetLinkageOpinionTrend, insightGetOpinionTrend } from '@/service/insights'
import {
  getCarSeriesOpinionTrend,
  getLinkageOpinionTrendByPraise,
  getOpinionTrendByPraise
} from '@/service/praise'
import useComQueryStore from '@/stores/modules/comQuery'
import useDrillDownStore from '@/stores/modules/drillDown'
import useFocusStore from '@/stores/modules/focus'
import { findValueByArr, formatNumberByMaxValue2Unit } from '@/utils'
import { defTooltip, toolTipByTag, toolTipPosition } from '@/utils/echartsConfig'
import { Message } from '@arco-design/web-vue'
import to from 'await-to-js'

interface Props {
  mapKey: MapKey
  praiseType?: number
}
const { mapKey, praiseType } = defineProps<Props>()

const comQueryStore = useComQueryStore()
const drillDownStore = useDrillDownStore()
const focusStore = useFocusStore()
const { loadStart, loadDone } = usePageLoading()

const trendZhu = ref()
const trendLine = ref()

// @Schema(description = "标签分类:PROD SERVICE QY  下钻页单值条件使用")
//     private String tagType;
//     @Schema(description = "区域 下钻页单值条件使用")
//     private String area;
//     @Schema(description = "车系 下钻页单值条件使用")
//     private String carSeries;

const praiseTitleByPraiseType = computed(() => {
  const titmeMap: any = {
    2: '区域排行及趋势',
    3: '观点数排行及趋势',
    4: '观点数排行及趋势'
  }
  return praiseType ? titmeMap[praiseType] : titmeMap[2]
})

const titleMap = computed(() => {
  const map: Record<MapKey, string> = {
    testing: '指数排行及趋势',
    focus: '观点数排行及趋势',
    insights: '观点数排行及趋势',
    vocView: '',
    vocViewInRisk: '',
    warning: '',
    praise: praiseTitleByPraiseType.value
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
    praise: drillDownStore.praiseInitData?.labelType
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
      // carSeriesList: drillDownStore.insightInitData?.carSeriesList,
      searchLabelLevel: 1
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

const queryApi = computed(() => {
  const map: Record<MapKey, any> = {
    testing: getOpinionTrend,
    focus: focusGetOpinionTrend,
    insights: insightGetOpinionTrend,
    vocView: undefined,
    vocViewInRisk: undefined,
    warning: undefined,
    praise:
      drillDownStore.praiseInitData?.viewType === 2
        ? getCarSeriesOpinionTrend
        : getOpinionTrendByPraise
  }
  return map[mapKey]
})

const detailApi = computed(() => {
  const map: Record<MapKey, any> = {
    testing: getLinkageOpinionTrend,
    focus: focusGetLinkageOpinionTrend,
    insights: insightGetLinkageOpinionTrend,
    vocView: undefined,
    vocViewInRisk: undefined,
    warning: undefined,
    praise: getLinkageOpinionTrendByPraise
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
    vocView: {
      ...comQueryStore.requiredForm,
      ...comQueryStore.formByVocView,
      tagType: tagType.value
    },
    vocViewInRisk: {
      ...comQueryStore.requiredForm,
      ...comQueryStore.formByVocView,
      tagType: tagType.value
    },
    testing: {
      ...comQueryStore.requiredForm,
      ...comQueryStore.formByTesting,
      tagType: tagType.value
    },
    focus: {
      ...comQueryStore.requiredForm,
      ...comQueryStore.formByFocus,
      tagType: tagType.value,
      ...drillDownStore.focusInitData?.labelTypeLevelList
    },
    insights: {
      ...comQueryStore.requiredForm,
      ...comQueryStore.formByInsights,
      tagType: tagType.value,
      labelTypeLevelFirstList: drillDownStore.insightInitData?.labelTypeLevelFirstList
    },
    warning: {
      ...comQueryStore.requiredForm,
      ...comQueryStore.formByWarning,
      tagType: tagType.value
    },
    praise: {
      ...comQueryStore.requiredForm,
      ...comQueryStore.formByPraise,
      carSeries: drillDownStore.praiseInitData?.data?.tagName,
      topicList: drillDownStore.praiseInitData?.tagName
        ? [drillDownStore.praiseInitData?.tagName]
        : undefined,
      labelTypeList: drillDownStore.praiseInitData?.labelType
        ? [drillDownStore.praiseInitData?.labelType]
        : undefined,
      ...drillDownStore.praiseInitData?.labelTypeLevelList,
      tagLabelList: drillDownStore.praiseInitData?.tagLabelList
    }
  }
  return map[mapKey]
})

const init = async () => {
  // loadStart()
  const [errs, data] = await to(
    queryApi.value({
      ...baseFormMap.value,
      // labelTypeLevelFourList: drillDownStore.fourTagName,
      ...paramsByMapKey.value,
      // tagType: tagType.value,
      ...emotionNameParams.value
    })
  )
  if (errs) {
    Message.error(errs.message)
    // loadDone()
  }
  if (data) {
    trendZhu.value = (data as any)?.result?.trendZhu
  }
  handleClick()
  // loadDone()
}

init()

const handleClick = async (params?: any) => {
  console.log('params', params)
  if (mapKey === 'praise') {
    if (drillDownStore.praiseInitData.viewType === 2) {
      baseFormMap.value.bigAreaIds = params?.data?.tagCode ? params?.data?.tagCode : undefined
    }

    if (drillDownStore.praiseInitData.viewType === 3) {
      baseFormMap.value.carSeries = params?.name ? params?.name : undefined
    }
  }
  if (mapKey === 'focus') {
    if (tagType.value === 'QY') {
      baseFormMap.value.carSeries = params?.name ? params?.name : undefined
    }
  }
  // tagCode
  const [errs, data] = await to(
    detailApi.value({
      bigAreaIds: tagType.value === 'SERVICE' ? params?.data?.tagCode : undefined,
      carSeries: tagType.value === 'PROD' ? params?.name : undefined,
      ...baseFormMap.value,
      ...paramsByMapKey.value,
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

const valueKeyByMapKey = computed(() => {
  const map: Record<MapKey, string> = {
    testing: 'nsrC',
    focus: 'tagC',
    insights: 'tagC',
    vocView: '',
    vocViewInRisk: '',
    warning: '',
    praise: 'tagC'
  }
  return map[mapKey]
})

const e2valueKeyByMapKey = computed(() => {
  const map: Record<MapKey, string> = {
    testing: 'nsrC',
    focus: 'tagSumC',
    insights: 'tagSumC',
    vocView: '',
    vocViewInRisk: '',
    warning: '',
    praise: 'tagSumC'
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
    praise: '观点数'
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
        yp: cur.tagYp,
        g: cur.nsrG
      })
      return acc
    },
    {
      date: [],
      s1Data: []
    }
  )

  const maxValue = transitionData?.s1Data?.length && findValueByArr([...transitionData?.s1Data])
  return {
    dataZoom: [
      {
        show: transitionData?.date?.length > 7,
        type: 'slider',
        height: 20,
        bottom: 8,
        showDetail: false,
        showDataShadow: false
      }
    ],
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
      left: 50,
      top: 30,
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
      },
      axisLabel: {
        formatter: (value: any) => {
          // return formatNumber(value)
          return formatNumberByMaxValue2Unit(value, maxValue)
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
        smooth: true
        // symbol: 'none'
      }
    ]
  }
})
const echartOptions1 = computed(() => {
  const zhuValueList = trendZhu.value?.map((el: any) => el[valueKeyByMapKey.value])
  const minValue = zhuValueList?.length ? Math.min(...zhuValueList) : 0

  const _data = trendZhu.value?.map((el: any) => {
    // return {
    //   ...el,
    //   name: el.tagName,
    //   value: el[valueKeyByMapKey.value]
    // }
    if (minValue > 0) {
      return {
        ...el,
        name: el.tagName,
        value: el[valueKeyByMapKey.value],
        originValue: el[valueKeyByMapKey.value]
      }
    } else {
      return {
        ...el,
        name: el.tagName,
        value:
          el[valueKeyByMapKey.value] > 0
            ? Math.abs(minValue) + el[valueKeyByMapKey.value]
            : Math.abs(el[valueKeyByMapKey.value]),
        originValue: el[valueKeyByMapKey.value]
      }
    }
  })

  const yAxisData = _data?.map((el: any) => el.name)
  return {
    dataZoom: [
      {
        // 设置滚动条的隐藏或显示
        show: true,
        // 设置类型
        type: 'slider',
        // 是否显示detail，即拖拽时候显示详细数值信息
        showDetail: false,
        // 数据窗口范围的起始数值
        startValue: 100,
        // 数据窗口范围的结束数值（一页显示多少条数据）
        endValue: 90,
        // 控制哪个轴，如果是number表示控制一个轴，
        // 如果是Array表示控制多个轴。此处控制第二根轴
        yAxisIndex: [0, 1],
        // empty：当前数据窗口外的数据，被设置为空。
        // 即不会影响其他轴的数据范围
        filterMode: 'empty',
        // 滚动条高度
        width: 3,
        // 滚动条显示位置
        height: '80%',
        // 距离右边
        right: 3,
        // 控制手柄的尺寸
        handleSize: 0,
        // 是否锁定选择区域（或叫做数据窗口）的大小
        zoomLoxk: true,
        // 组件离容器上侧的距离
        // 如果top的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐
        top: 'middle'
      },
      {
        // 没有下面这块的话，只能拖动滚动条，
        // 鼠标滚轮在区域内不能控制外部滚动条
        type: 'inside',
        // 控制哪个轴，如果是number表示控制一个轴，
        // 如果是Array表示控制多个轴。此处控制第二根轴
        yAxisIndex: [0, 1],
        // 滚轮是否触发缩放
        zoomOnMouseWheel: false,
        // 鼠标移动能否触发平移
        moveOnMouseMove: true,
        // 鼠标滚轮能否触发平移
        moveOnMouseWheel: true
      }
    ],
    tooltip: {
      show: true,
      trigger: 'axis',
      position: (point: any, params: any, dom: any, rect: any, size: any) => {
        return toolTipPosition(point, params, dom, rect, size)
      },
      formatter: (params: any) => {
        return toolTipByTag(
          {
            icon: true,
            color: params[0]?.color,
            name: params[0]?.data?.name,
            // nsrC: params[0]?.data?.[valueKeyByMapKey.value],
            nsrC: params[0]?.data?.originValue,
            nsrR: params[0]?.data?.tagRp,
            nsrY: params[0]?.data?.tagYp,
            nsrG: mapKey === 'testing' ? params[0]?.data?.nsrG : ''
          },
          { t1Label: t1LabelByMapKey.value }
        )
      },
      padding: 0,
      borderWidth: 0,
      borderColor: 'rgba(0, 0, 0, 0)'
    },
    grid: {
      left: 0,
      top: 20,
      right: 40,
      bottom: 40,
      containLabel: true
    },
    xAxis: {
      type: 'value',
      show: false
    },
    yAxis: {
      type: 'category',
      axisTick: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#DDE3EE'
        }
      },
      axisLabel: {
        color: '#333' // 设置y轴文字颜色
      },
      data: yAxisData
    },
    series: [
      {
        data: _data,
        type: 'bar',
        color: '#2c9bde',
        barWidth: 20,
        label: {
          show: true,
          position: 'right',
          fontSize: '12px',
          color: 'rgba(0,0,0,0.7)',
          lineHeight: 14,
          // formatter: '{c}'
          formatter: (params: any) => {
            return params.data.originValue
          }
        }
      }
    ]
  }
})
</script>

<style lang="scss" scoped></style>
