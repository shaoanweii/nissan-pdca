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
import { getRegionTrendChange } from '@/service/praise'
import useComQueryStore from '@/stores/modules/comQuery'
import useDrillDownStore from '@/stores/modules/drillDown'
import { defTooltip, toolTipPosition } from '@/utils/echartsConfig'
import { Message } from '@arco-design/web-vue'
import to from 'await-to-js'

interface Props {
  mapKey: MapKey
}
const { mapKey } = defineProps<Props>()

const comQueryStore = useComQueryStore()
const drillDownStore = useDrillDownStore()
const { loadStart, loadDone } = usePageLoading()

const trendLine = ref()

const titleMap = computed(() => {
  const map: Record<MapKey, string> = {
    testing: '',
    focus: '',
    insights: '',
    vocView: '',
    vocViewInRisk: '',
    warning: '',
    praise: '趋势变化'
  }
  return map[mapKey]
})

const detailApi = computed(() => {
  const map: Record<MapKey, any> = {
    testing: undefined,
    focus: undefined,
    insights: undefined,
    vocView: undefined,
    vocViewInRisk: undefined,
    warning: undefined,
    praise: getRegionTrendChange
  }
  return map[mapKey]
})

const baseFormMap = computed(() => {
  const map: Record<MapKey, any> = {
    vocView: { ...comQueryStore.requiredForm, ...comQueryStore.formByVocView },
    vocViewInRisk: { ...comQueryStore.requiredForm, ...comQueryStore.formByVocView },
    testing: { ...comQueryStore.requiredForm, ...comQueryStore.formByTesting },
    focus: { ...comQueryStore.requiredForm, ...comQueryStore.formByFocus },
    insights: { ...comQueryStore.requiredForm, ...comQueryStore.formByInsights },
    warning: { ...comQueryStore.requiredForm, ...comQueryStore.formByWarning },
    praise: {
      ...comQueryStore.requiredForm,
      ...comQueryStore.formByPraise,
      labelTypeList: drillDownStore.praiseInitData?.labelType
        ? [drillDownStore.praiseInitData?.labelType]
        : undefined
    }
  }
  return map[mapKey]
})

const handleClick = async () => {
  const [errs, data] = await to(
    detailApi.value({
      ...baseFormMap.value,
      bigAreaIds: drillDownStore.praiseInitData?.data?.tagCode
    })
  )
  if (errs) {
    Message.error(errs.message)
  }
  if (data) {
    trendLine.value = (data as any)?.result
  }
}

const init = async () => {
  loadStart()
  handleClick()
  loadDone()
}

init()

const echartOptions2 = computed(() => {
  const transitionData = trendLine.value?.reduce(
    (acc: any, cur: any) => {
      acc.date.push(cur.date)
      acc.s1Data.push({
        date: cur.date,
        // name: cur.tagName,
        name: '观点数',
        value: cur.tagSumC,
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
