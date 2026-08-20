<template>
  <div
    class="acro-topic-chart"
    role="img"
    :aria-label="`${metricLabel}事件生成、事件审核、业务响应、闭环处理、事件关闭走势，与历史事件${comparisonId}对比`"
  >
    <FEcharts :options="option" width="100%" height="278px" @handle-data-zoom="handleDataZoom" />
    <div class="stage-marker-layer" aria-label="事件状态节点">
      <button
        v-for="stage in visibleStages"
        :key="stage.order"
        type="button"
        :class="['stage-marker', `stage-marker-${stageColorState(stage.order)}`]"
        :style="{ left: stageMarkerLeft(stage.date) }"
        :aria-label="`${stage.order} ${stage.label}`"
      >
        {{ stage.order }}
        <span role="tooltip">{{ stage.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import FEcharts from '@/components/FEcharts/index.vue'
import type { EChartsOption } from 'echarts'

type MetricKey = 'mentions' | 'users' | 'negativeRate' | 'experienceIndex' | 'topRanking'

const props = withDefaults(
  defineProps<{
    metric: MetricKey
    closed: boolean
    status: string
    warningTime: string
    comparisonId: string
  }>(),
  {
    metric: 'negativeRate',
    closed: false,
    status: '预警审核',
    warningTime: '',
    comparisonId: 'KT20250918006'
  }
)

const dates = [
  '09/30',
  '10/01',
  '10/02',
  '10/03',
  '10/04',
  '10/05',
  '10/06',
  '10/07',
  '10/08',
  '10/09',
  '10/10',
  '10/11',
  '10/12',
  '10/13',
  '10/14'
]

const metricConfig: Record<
  MetricKey,
  { label: string; unit: string; threshold: number; current: number[]; comparison: number[] }
> = {
  mentions: {
    label: '提及量',
    unit: '',
    threshold: 1800,
    current: [
      1180, 1240, 1210, 1290, 1260, 1340, 1510, 2680, 3240, 3410, 3180, 2760, 2210, 1780, 1510
    ],
    comparison: [
      1120, 1190, 1230, 1270, 1320, 1380, 1490, 2410, 2870, 2960, 2650, 2190, 1840, 1590, 1430
    ]
  },
  users: {
    label: '用户数',
    unit: '',
    threshold: 1000,
    current: [620, 684, 668, 701, 690, 724, 812, 1420, 1690, 1810, 1705, 1480, 1160, 890, 720],
    comparison: [590, 632, 650, 681, 705, 742, 790, 1310, 1510, 1580, 1430, 1210, 980, 810, 705]
  },
  negativeRate: {
    label: '负面率',
    unit: '%',
    threshold: 45,
    current: [
      42.1, 43.8, 42.9, 44.6, 45.2, 47.4, 51.8, 68.8, 72.4, 70.1, 64.7, 58.2, 49.5, 43.1, 39.6
    ],
    comparison: [
      40.8, 42.2, 41.7, 43.4, 44.1, 46.0, 49.3, 65.1, 69.7, 72.4, 63.2, 54.6, 47.8, 42.5, 38.9
    ]
  },
  experienceIndex: {
    label: '体验指数',
    unit: '',
    threshold: 70,
    current: [
      74.0, 73.2, 73.8, 72.9, 72.4, 70.8, 68.9, 61.8, 58.6, 59.7, 63.2, 67.4, 71.2, 74.1, 76.4
    ],
    comparison: [
      75.1, 74.6, 74.2, 73.8, 72.9, 71.4, 69.8, 63.5, 60.2, 58.9, 62.7, 68.1, 72.5, 75.0, 76.0
    ]
  },
  topRanking: {
    label: 'TOP排行',
    unit: '位',
    threshold: 10,
    current: [18, 17, 17, 16, 15, 14, 12, 9, 5, 3, 4, 6, 9, 12, 16],
    comparison: [20, 19, 18, 18, 16, 15, 13, 10, 7, 5, 6, 8, 11, 14, 17]
  }
}

const comparisonOffset = computed(() => {
  const code = props.comparisonId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return ((code % 7) - 3) / 10
})
const zoomStart = ref(0)
const zoomEnd = ref(100)
const handleDataZoom = (params: {
  start?: number
  end?: number
  batch?: Array<{ start: number; end: number }>
}) => {
  const zoom = params.batch?.[0] || params
  const start = Number(zoom.start ?? 0)
  const end = Number(zoom.end ?? 100)
  zoomStart.value = start
  zoomEnd.value = end
}
const metricLabel = computed(() => metricConfig[props.metric].label)
const currentStatusIndex = computed(() =>
  props.status === '声音洞察'
    ? 1
    : props.status === '预警审核'
    ? 2
    : props.status === '业务响应'
    ? 3
    : props.status === '闭环处理' || props.status === '待确认'
    ? 4
    : 5
)
const currentDataCutoff = computed(() =>
  props.closed ? 14 : { 1: 7, 2: 8, 3: 9, 4: 10, 5: 11 }[currentStatusIndex.value] ?? 8
)
const stages = [
  { order: 1, label: '事件生成', date: '10/07' },
  { order: 2, label: '事件审核', date: '10/08' },
  { order: 3, label: '业务响应', date: '10/09' },
  { order: 4, label: '闭环处理', date: '10/10' },
  { order: 5, label: '事件关闭', date: '10/11' }
]
const stageColor = (order: number) =>
  order < currentStatusIndex.value
    ? '#159b8d'
    : order === currentStatusIndex.value
    ? '#e4002b'
    : '#aeb8c7'
const stageColorState = (order: number) =>
  order < currentStatusIndex.value
    ? 'done'
    : order === currentStatusIndex.value
    ? 'current'
    : 'pending'
const visibleStages = computed(() => {
  const startIndex = (zoomStart.value / 100) * (dates.length - 1)
  const endIndex = (zoomEnd.value / 100) * (dates.length - 1)
  return stages.filter(stage => {
    const index = dates.indexOf(stage.date)
    return index >= startIndex && index <= endIndex
  })
})
const stageMarkerLeft = (date: string) => {
  const index = dates.indexOf(date)
  const startIndex = (zoomStart.value / 100) * (dates.length - 1)
  const endIndex = (zoomEnd.value / 100) * (dates.length - 1)
  const fraction = (index - startIndex) / Math.max(endIndex - startIndex, 1)
  return `calc(48px + ${fraction * 100}% - ${fraction * 74}px)`
}
const stageMarkLines = computed(() => {
  return stages.map(stage => {
    const color = stageColor(stage.order)
    return {
      name: `${stage.order} ${stage.label}`,
      xAxis: stage.date,
      lineStyle: {
        color,
        width: stage.order === currentStatusIndex.value ? 1.5 : 1,
        type: 'dashed' as const
      },
      label: {
        show: false
      }
    }
  })
})

const option = computed<EChartsOption>(() => {
  const config = metricConfig[props.metric]
  const currentData = config.current.map((value, index) =>
    index > currentDataCutoff.value ? null : value
  )
  const comparisonData = config.comparison.map(value =>
    Number((value * (1 + comparisonOffset.value / 10)).toFixed(1))
  )
  return {
    animationDuration: 420,
    color: ['#e4002b', '#287de7'],
    grid: { left: 48, right: 26, top: 68, bottom: 56 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(31, 42, 61, 0.95)',
      borderWidth: 0,
      textStyle: { color: '#fff', fontSize: 12 },
      valueFormatter: value =>
        value == null ? '待回收' : `${Number(value).toLocaleString()}${config.unit}`
    },
    legend: {
      top: 4,
      right: 12,
      itemWidth: 16,
      itemHeight: 7,
      textStyle: { color: '#5f6b7c', fontSize: 11 },
      data: ['当前事件', `历史对比 ${props.comparisonId}`]
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: { lineStyle: { color: '#d8dee9' } },
      axisTick: { show: false },
      axisLabel: { color: '#7b8798', fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      scale: true,
      inverse: props.metric === 'topRanking',
      min: props.metric === 'topRanking' ? 1 : undefined,
      max: props.metric === 'topRanking' ? 21 : undefined,
      splitLine: { lineStyle: { color: '#edf0f5', type: 'dashed' } },
      axisLabel: {
        color: '#7b8798',
        fontSize: 11,
        formatter: value => `${value}${config.unit}`
      }
    },
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: 0,
        start: zoomStart.value,
        end: zoomEnd.value,
        zoomOnMouseWheel: true,
        moveOnMouseMove: true,
        moveOnMouseWheel: false
      },
      {
        type: 'slider',
        xAxisIndex: 0,
        start: zoomStart.value,
        end: zoomEnd.value,
        bottom: 5,
        height: 16,
        brushSelect: false,
        borderColor: '#d9e0ea',
        backgroundColor: '#f5f7fa',
        fillerColor: 'rgba(40, 125, 231, 0.12)',
        handleStyle: { color: '#fff', borderColor: '#287de7' },
        textStyle: { color: '#7b8798', fontSize: 9 }
      }
    ],
    series: [
      {
        name: '当前事件',
        type: 'line',
        data: currentData,
        smooth: 0.25,
        connectNulls: false,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: true,
        lineStyle: { width: 2.5, color: '#e4002b' },
        itemStyle: { color: '#e4002b' },
        markLine: {
          silent: false,
          symbol: 'none',
          lineStyle: { color: '#e8a4b1', width: 1, type: 'dashed' },
          tooltip: {
            formatter: '{b}'
          },
          data: [
            ...stageMarkLines.value,
            {
              name: `规则阈值 ${config.threshold}${config.unit}`,
              yAxis: config.threshold,
              lineStyle: { color: '#f2994a', type: 'dashed' },
              label: { show: true, color: '#c27224', position: 'insideEndTop', fontSize: 11 }
            }
          ]
        }
      },
      {
        name: `历史对比 ${props.comparisonId}`,
        type: 'line',
        data: comparisonData,
        smooth: 0.25,
        showSymbol: false,
        lineStyle: { width: 1.6, color: '#287de7', type: 'dashed' },
        itemStyle: { color: '#287de7' }
      }
    ]
  }
})
</script>

<style lang="scss" scoped>
.acro-topic-chart {
  position: relative;
}
.stage-marker-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.stage-marker {
  position: absolute;
  top: 59px;
  width: 18px;
  height: 18px;
  padding: 0;
  transform: translateX(-50%);
  border: 0;
  border-radius: 50%;
  color: #fff;
  font-size: 9px;
  font-weight: 600;
  line-height: 18px;
  text-align: center;
  pointer-events: auto;
  cursor: help;
}
.stage-marker-done {
  background: #159b8d;
}
.stage-marker-current {
  background: #e4002b;
}
.stage-marker-pending {
  background: #aeb8c7;
}
.stage-marker span[role='tooltip'] {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 7px);
  z-index: 4;
  width: max-content;
  padding: 5px 8px;
  transform: translateX(-50%);
  border-radius: 4px;
  background: rgba(31, 42, 61, 0.94);
  color: #fff;
  font-size: 11px;
  font-weight: 400;
  line-height: 16px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease;
}
.stage-marker:hover span[role='tooltip'],
.stage-marker:focus-visible span[role='tooltip'] {
  opacity: 1;
  visibility: visible;
}
</style>

<style scoped>
.acro-topic-chart {
  width: 100%;
  height: 278px;
}
</style>
