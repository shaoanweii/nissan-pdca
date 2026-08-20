<template>
  <div class="pxy-24">
    <div class="fw-600 font-16 lh-24 color-666 mb-6">趋势变化</div>
    <FEcharts :options="echartOptions2" width="100%" height="454px"></FEcharts>
  </div>
</template>

<script lang="ts" setup>
import { getTrendVariation } from '@/service/vocOverview'
import useComQueryStore from '@/stores/modules/comQuery'
import { findValueByArr, formatNumber, formatNumberByMaxValue2Unit } from '@/utils'
import { defTooltip, toolTipPosition } from '@/utils/echartsConfig'

const comQueryStore = useComQueryStore()

const resultData = ref()

getTrendVariation({ ...comQueryStore.requiredForm, ...comQueryStore.formByVocView }).then(res => {
  resultData.value = res.result
})
const echartOptions2 = computed(() => {
  const transitionData = resultData.value?.reduce(
    (acc: any, cur: any) => {
      acc.date.push(cur.date)
      // 观点数
      acc.s1Data.push({
        date: cur.date,
        name: cur.positiveTitle,
        value: cur.positiveNsrC,
        rp: cur.positiveNsrRp,
        yp: cur.positiveNsrYp
      })

      // 单据数
      acc.s2Data.push({
        date: cur.date,
        name: cur.serverOrderTitle,
        value: cur.serverOrderNsrC,
        rp: cur.serverOrderNsrRp,
        yp: cur.serverOrderNsrYp
      })

      // 用户数
      acc.s3Data.push({
        date: cur.date,
        name: cur.userTitle,
        value: cur.userNsrC,
        rp: cur.userNsrRp,
        yp: cur.userNsrYp
      })
      return acc
    },
    {
      date: [],
      s1Data: [],
      s2Data: [],
      s3Data: []
    }
  )

  const maxValue =
    transitionData?.s1Data?.length &&
    transitionData?.s2Data?.length &&
    transitionData?.s3Data?.length &&
    findValueByArr([
      ...transitionData?.s1Data,
      ...transitionData?.s2Data,
      ...transitionData?.s3Data
    ])
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
      top: 30,
      right: 10,
      bottom: 30,
      containLabel: true
    },
    legend: {
      show: true,
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
        // data: [1820, 1932, 1901, 1934, 11290, 11330, 11320],
        data: transitionData?.s1Data || [],
        type: 'line',
        smooth: true,
        symbol: 'none'
      },
      {
        name: '单据数',
        // data: [820, 932, 901, 934, 1290, 1330, 1320],
        data: transitionData?.s2Data || [],
        type: 'line',
        smooth: true,
        symbol: 'none'
      },
      {
        name: '用户数',
        // data: [2820, 2932, 2901, 2934, 21290, 21330, 21320],
        data: transitionData?.s3Data || [],
        type: 'line',
        smooth: true,
        symbol: 'none'
      }
    ]
  }
})
</script>

<style lang="scss" scoped></style>
