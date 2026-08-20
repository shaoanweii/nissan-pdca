<template>
  <div class="topic-horizontal-chart" role="img" :aria-label="chartLabel">
    <FEcharts :options="option" width="100%" :height="height" @handle-click="handleClick" />
  </div>
</template>

<script setup lang="ts">
import FEcharts from '@/components/FEcharts/index.vue'
import type { EChartsOption } from 'echarts'

export interface TopicBarDatum {
  name: string
  value: number
}

const props = withDefaults(
  defineProps<{
    data: TopicBarDatum[]
    chartLabel: string
    color?: string
    height?: string
    unit?: string
    max?: number
  }>(),
  {
    color: '#287de7',
    height: '190px',
    unit: '',
    max: undefined
  }
)
const emit = defineEmits<{ select: [datum: TopicBarDatum] }>()
const handleClick = (params: { name?: string }) => {
  if (!params?.name) return
  const datum = props.data.find(item => item.name === params.name)
  if (datum) emit('select', datum)
}

const option = computed<EChartsOption>(() => ({
  animationDuration: 450,
  grid: { left: 58, right: 42, top: 8, bottom: 24, containLabel: false },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(35, 120, 247, 0.08)' } },
    backgroundColor: 'rgba(31, 42, 61, 0.94)',
    borderWidth: 0,
    textStyle: { color: '#fff', fontSize: 12 },
    valueFormatter: value => `${Number(value).toLocaleString()}${props.unit}`
  },
  xAxis: {
    type: 'value',
    max: props.max,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: '#8793a4',
      fontSize: 11,
      formatter: value => (props.unit === '%' ? `${value}%` : Number(value).toLocaleString())
    },
    splitLine: { lineStyle: { color: '#edf0f5', type: 'dashed' } }
  },
  yAxis: {
    type: 'category',
    inverse: true,
    data: props.data.map(item => item.name),
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#4f5d72', fontSize: 12, margin: 12 }
  },
  series: [
    {
      type: 'bar',
      cursor: 'pointer',
      barWidth: 12,
      data: props.data.map(item => item.value),
      itemStyle: { color: props.color, borderRadius: [0, 4, 4, 0] },
      emphasis: {
        itemStyle: { color: props.color, shadowBlur: 8, shadowColor: `${props.color}55` }
      },
      label: {
        show: true,
        position: 'right',
        color: '#5d697b',
        fontSize: 11,
        formatter: params => `${Number(params.value).toLocaleString()}${props.unit}`
      }
    }
  ]
}))
</script>

<style scoped>
.topic-horizontal-chart {
  width: 100%;
  min-width: 0;
}
</style>
