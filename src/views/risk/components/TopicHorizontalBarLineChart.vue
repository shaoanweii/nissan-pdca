<template>
  <div class="topic-bar-line-chart" role="img" :aria-label="chartLabel">
    <FEcharts :options="option" width="100%" :height="height" @handle-click="handleClick" />
  </div>
</template>

<script setup lang="ts">
import FEcharts from '@/components/FEcharts/index.vue'
import type { EChartsOption } from 'echarts'

export interface TopicBarLineDatum {
  name: string
  mentions: number
  negativeRate: number
}

const props = withDefaults(
  defineProps<{
    data: TopicBarLineDatum[]
    chartLabel: string
    height?: string
  }>(),
  { height: '244px' }
)
const emit = defineEmits<{ select: [datum: TopicBarLineDatum] }>()

const handleClick = (params: { name?: string }) => {
  if (!params?.name) return
  const datum = props.data.find(item => item.name === params.name)
  if (datum) emit('select', datum)
}

const option = computed<EChartsOption>(() => ({
  animationDuration: 420,
  color: ['#287de7', '#e96a78'],
  grid: { left: 56, right: 58, top: 42, bottom: 48 },
  legend: {
    top: 2,
    right: 8,
    itemWidth: 16,
    itemHeight: 8,
    textStyle: { color: '#607086', fontSize: 11 },
    data: ['提及量', '负面率']
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    backgroundColor: 'rgba(31, 42, 61, 0.95)',
    borderWidth: 0,
    textStyle: { color: '#fff', fontSize: 12 },
    formatter: params => {
      const list = Array.isArray(params) ? params : [params]
      const name = list[0]?.name || ''
      const mentions = props.data.find(item => item.name === name)?.mentions || 0
      const negativeRate = props.data.find(item => item.name === name)?.negativeRate || 0
      return `${name}<br/>提及量：${mentions.toLocaleString()}<br/>负面率：${negativeRate}%`
    }
  },
  xAxis: {
    type: 'category',
    data: props.data.map(item => item.name),
    axisLine: { lineStyle: { color: '#d8dee9' } },
    axisTick: { show: false },
    axisLabel: { color: '#4f5d72', fontSize: 11, interval: 0, rotate: 0 }
  },
  yAxis: [
    {
      type: 'value',
      position: 'left',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#8793a4', fontSize: 10 },
      splitLine: { lineStyle: { color: '#edf0f5', type: 'dashed' } }
    },
    {
      type: 'value',
      position: 'right',
      min: 0,
      max: 100,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#bd6670', fontSize: 10, formatter: '{value}%' },
      splitLine: { show: false }
    }
  ],
  series: [
    {
      name: '提及量',
      type: 'bar',
      cursor: 'pointer',
      barMaxWidth: 34,
      data: props.data.map(item => item.mentions),
      itemStyle: { color: '#287de7', borderRadius: [4, 4, 0, 0] },
      label: {
        show: true,
        position: 'top',
        color: '#526075',
        fontSize: 10,
        formatter: params => Number(params.value).toLocaleString()
      }
    },
    {
      name: '负面率',
      type: 'line',
      yAxisIndex: 1,
      cursor: 'pointer',
      data: props.data.map(item => item.negativeRate),
      symbol: 'circle',
      symbolSize: 7,
      lineStyle: { width: 2, color: '#e96a78' },
      itemStyle: { color: '#e96a78' },
      label: {
        show: true,
        position: 'top',
        color: '#d95766',
        fontSize: 10,
        formatter: params => `${params.value}%`
      }
    }
  ]
}))
</script>

<style scoped>
.topic-bar-line-chart {
  width: 100%;
  min-width: 0;
}
</style>
