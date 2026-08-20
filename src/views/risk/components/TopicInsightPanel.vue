<template>
  <section class="topic-insight-panel" aria-label="课题事件洞察">
    <header class="insight-overview">
      <div>
        <span>规则命中链路</span>
        <h3>{{ ruleName }}</h3>
        <p>规则编号 {{ ruleId }} · 近 12 个月第 {{ sameRuleCount }} 次命中</p>
      </div>
      <div class="insight-updated"><i class="ri-time-line"></i>更新至 {{ event.warningTime }}</div>
    </header>

    <div class="insight-kpi-grid">
      <article>
        <span>本次负面率</span>
        <strong class="risk-value">{{ negativeRate }}%</strong>
        <small>较阈值 +{{ thresholdGap }}pp</small>
      </article>
      <article>
        <span>同规则历史事件</span>
        <strong>{{ sameRuleCount }}</strong>
        <small>同车系 {{ repeatedSeriesCount }} 次</small>
      </article>
      <article>
        <span>历史平均闭环</span>
        <strong>36.8<em>h</em></strong>
        <small>18.5h–72.2h</small>
      </article>
      <article>
        <span>重复发生率</span>
        <strong>41.7%</strong>
        <small>近 3 次复发 2 次</small>
      </article>
    </div>

    <section class="insight-card history-card">
      <header class="card-heading split-heading">
        <div>
          <h3>同规则历史同类事件</h3>
        </div>
        <div class="history-summary">
          <span>已关闭 8</span><span>处理中 3</span><span class="alert">升级督办 1</span>
        </div>
      </header>
      <div class="history-table-wrap">
        <table class="history-table">
          <colgroup>
            <col style="width: 22%" />
            <col style="width: 22%" />
            <col style="width: 12%" />
            <col style="width: 20%" />
            <col style="width: 12%" />
            <col style="width: 12%" />
          </colgroup>
          <thead>
            <tr>
              <th>事件编号</th>
              <th>触发时间</th>
              <th>事件等级</th>
              <th>主责单位</th>
              <th>闭环耗时</th>
              <th>结果</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in historicalEvents"
              :key="item.id"
              :class="{ selected: item.id === selectedHistoryId }"
              @click="selectHistoricalEvent(item)"
            >
              <td>
                <button type="button">{{ item.id }}</button>
              </td>
              <td>{{ item.triggeredAt }}</td>
              <td>
                <span :class="['event-level-tag', `level-${item.level}`]">{{ item.level }}</span>
              </td>
              <td>{{ item.department }}</td>
              <td>{{ item.duration }}</td>
              <td>
                <span :class="['result-tag', item.resultType]">{{ item.result }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="selectedHistory" class="history-link-banner">
        <i class="ri-links-line"></i>
        <div>
          <strong>已选择 {{ selectedHistory.id }} 作为对比基线</strong>
          <p>下方图表已联动</p>
        </div>
        <span
          >{{ selectedHistory.metrics[0].name }} ·
          {{ selectedHistory.metrics[0].fluctuation }}</span
        >
      </div>
    </section>

    <section class="insight-card lifecycle-card">
      <header class="card-heading split-heading">
        <div>
          <div class="lifecycle-title-line">
            <h3>当前事件指标节点走势</h3>
            <span class="comparison-chip">对比 {{ selectedHistoryId }}</span>
          </div>
        </div>
        <div class="metric-controls">
          <div class="metric-switch" role="group" aria-label="事件洞察观察指标">
            <button
              v-for="item in metricOptions"
              :key="item.key"
              type="button"
              :class="{ active: selectedMetric === item.key }"
              :aria-pressed="selectedMetric === item.key"
              @click="selectedMetric = item.key"
            >
              {{ item.label }}
            </button>
          </div>
        </div>
      </header>

      <TopicTrendChart
        :metric="selectedMetric"
        :closed="event.status === '事件关闭'"
        :status="event.status"
        :warning-time="event.warningTime"
        :comparison-id="selectedHistoryId"
      />
      <div class="chart-note">
        <span><i class="actual-line"></i>实际值</span>
        <span><i class="threshold-line"></i>规则阈值</span>
        <p v-if="event.status !== '事件关闭'">当前状态以后待发生，事后基线待关闭后回收。</p>
        <p v-else>事后基线为关闭后 7 日实际值。</p>
      </div>
    </section>

    <section class="insight-card multidimensional-card">
      <header class="card-heading split-heading analysis-heading">
        <h3>多维分析</h3>
        <div class="analysis-tabs" role="tablist" aria-label="多维分析类型">
          <button
            v-for="item in analysisTabs"
            :key="item.key"
            type="button"
            :class="{ active: activeAnalysis === item.key }"
            :aria-selected="activeAnalysis === item.key"
            @click="activeAnalysis = item.key"
          >
            <i :class="item.icon"></i>{{ item.label }}
          </button>
        </div>
      </header>
      <div v-if="selectedAnalysisFilters.length" class="selected-filter-bar">
        <button
          v-for="filter in selectedAnalysisFilters"
          :key="filter.id"
          type="button"
          :aria-label="`删除筛选 ${filter.label} ${filter.value}`"
          @click="removeAnalysisFilter(filter.id)"
        >
          {{ filter.label }}：{{ filter.value }} <i class="ri-close-line"></i>
        </button>
      </div>

      <TopicHorizontalBarLineChart
        :data="analysisMixedChartData"
        :chart-label="`${activeAnalysisLabel}提及量与负面率综合排行`"
        height="244px"
        @select="addAnalysisFilter(activeAnalysis, $event.name)"
      />

      <div class="analysis-table-wrap">
        <table class="analysis-table">
          <thead>
            <tr>
              <th>{{ activeAnalysisLabel }}</th>
              <th>提及量</th>
              <th>占比</th>
              <th>提及趋势</th>
              <th>环比</th>
              <th>负面率</th>
              <th>负面趋势</th>
              <th>正面率</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in currentAnalysisRows"
              :key="item.name"
              tabindex="0"
              @click="addAnalysisFilter(activeAnalysis, item.name)"
              @keydown.enter="addAnalysisFilter(activeAnalysis, item.name)"
            >
              <td>
                <strong>{{ item.name }}</strong>
              </td>
              <td>{{ item.mentions.toLocaleString() }}</td>
              <td>{{ item.share }}%</td>
              <td>
                <svg class="mini-trend" viewBox="0 0 72 22" aria-hidden="true">
                  <polyline :points="sparklinePoints(item.trend)" />
                </svg>
              </td>
              <td :class="item.mom.startsWith('+') ? 'up' : 'down'">{{ item.mom }}</td>
              <td :class="{ alert: item.negativeRate >= 65 }">{{ item.negativeRate }}%</td>
              <td>
                <svg class="mini-trend negative" viewBox="0 0 72 22" aria-hidden="true">
                  <polyline :points="sparklinePoints(item.negativeTrend)" />
                </svg>
              </td>
              <td>{{ item.positiveRate }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <footer class="insight-source-note">
      <i class="ri-information-line"></i>
      演示数据，生产以规则、指标、节点和维度接口为准。
    </footer>
  </section>
</template>

<script setup lang="ts">
import type { TopicEvent } from '../topicEventData'
import TopicHorizontalBarLineChart from './TopicHorizontalBarLineChart.vue'
import TopicTrendChart from './TopicTrendChart.vue'

type MetricKey = 'mentions' | 'users' | 'negativeRate' | 'experienceIndex' | 'topRanking'
type AnalysisKey = 'viewpoint' | 'scene' | 'series' | 'region' | 'audience' | 'source'
type AnalysisRow = {
  name: string
  mentions: number
  share: number
  negativeRate: number
  positiveRate: number
  mom: string
  trend: number[]
  negativeTrend: number[]
}
type AnalysisFilter = { id: number; analysis: AnalysisKey; label: string; value: string }

const props = defineProps<{ event: TopicEvent }>()

const selectedMetric = ref<MetricKey>('negativeRate')
const selectedHistoryId = ref('KT20250918006')
const activeAnalysis = ref<AnalysisKey>('series')
const selectedAnalysisFilters = ref<AnalysisFilter[]>([])
let analysisFilterSequence = 0

const metricOptions: Array<{ key: MetricKey; label: string }> = [
  { key: 'mentions', label: '提及量' },
  { key: 'users', label: '用户数' },
  { key: 'negativeRate', label: '负面率' },
  { key: 'experienceIndex', label: '体验指数' },
  { key: 'topRanking', label: 'TOP排行' }
]
const analysisTabs: Array<{ key: AnalysisKey; label: string; icon: string }> = [
  { key: 'viewpoint', label: '观点分析', icon: 'ri-chat-quote-line' },
  { key: 'scene', label: '场景分析', icon: 'ri-road-map-line' },
  { key: 'series', label: '车系分析', icon: 'ri-car-line' },
  { key: 'region', label: '地域分析', icon: 'ri-map-pin-line' },
  { key: 'audience', label: '人群特征', icon: 'ri-group-line' },
  { key: 'source', label: '渠道分析', icon: 'ri-database-2-line' }
]

const ruleId = computed(() => `RL-${props.event.category === '动力总成' ? 'ENG-021' : 'VOC-018'}`)
const ruleName = computed(() => `${props.event.viewpoints[0] || props.event.category}异常聚集规则`)
const negativeRate = computed(() => (props.event.priority === '高' ? '68.8' : '54.6'))
const thresholdGap = computed(() => (Number(negativeRate.value) - 45).toFixed(1))
const sameRuleCount = computed(() => (props.event.priority === '高' ? 12 : 8))
const repeatedSeriesCount = computed(() => Math.max(3, Math.round(sameRuleCount.value * 0.58)))

const historicalEvents = computed(() => [
  {
    id: 'KT20250918006',
    triggeredAt: '2025-09-18 09:42',
    level: '高',
    metricKey: 'negativeRate' as MetricKey,
    metrics: [
      { name: '负面率', fluctuation: '45.1% → 72.4%（+27.3pp）' },
      { name: '提及量', fluctuation: '1,240 → 2,680（+116%）' },
      { name: '用户数', fluctuation: '684 → 1,420（+108%）' }
    ],
    department: props.event.department,
    duration: '32.5h',
    result: '已关闭',
    resultType: 'closed',
    summary: '通过服务指引更新与重点车系专项排查完成闭环，关闭后 7 日负面率下降 18.6 个百分点。',
    sharedDimensions: `${props.event.series.split('、')[0]}、在线客服、负面`,
    recurrence: '30 日内未复发'
  },
  {
    id: 'KT20250827011',
    triggeredAt: '2025-08-27 14:18',
    level: '高',
    metricKey: 'users' as MetricKey,
    metrics: [
      { name: '用户数', fluctuation: '720 → 1,580（+119%）' },
      { name: '负面率', fluctuation: '43.8% → 66.1%（+22.3pp）' }
    ],
    department: '质量保证部',
    duration: '51.0h',
    result: '已关闭',
    resultType: 'closed',
    summary: '完成样件复核与高频工况复现，形成原因说明和用户沟通口径。',
    sharedDimensions: '天籁、App、投诉',
    recurrence: '同类标签轻微复发'
  },
  {
    id: 'KT20250712003',
    triggeredAt: '2025-07-12 11:05',
    level: '高',
    metricKey: 'mentions' as MetricKey,
    metrics: [
      { name: '提及量', fluctuation: '1,240 → 2,980（+140%）' },
      { name: 'TOP排行', fluctuation: '21 → 4（上升 17 位）' }
    ],
    department: '产品企划部',
    duration: '72.2h',
    result: '升级督办',
    resultType: 'escalated',
    summary: '因任务超期升级至上一级责任单位，重新设定督办目标后完成整改。',
    sharedDimensions: '轩逸、400客服、高活跃用户',
    recurrence: '已纳入专项治理'
  },
  {
    id: 'KT20250603008',
    triggeredAt: '2025-06-03 16:30',
    level: '低',
    metricKey: 'experienceIndex' as MetricKey,
    metrics: [
      { name: '体验指数', fluctuation: '74.6 → 61.7（-12.9）' },
      { name: '负面率', fluctuation: '41.2% → 61.7%（+20.5pp）' }
    ],
    department: props.event.department,
    duration: '18.5h',
    result: '已关闭',
    resultType: 'closed',
    summary: '快速确认属于集中咨询而非质量问题，补充 FAQ 后声量恢复基线。',
    sharedDimensions: '奇骏、论坛、咨询',
    recurrence: '无复发'
  },
  {
    id: 'KT20250421002',
    triggeredAt: '2025-04-21 08:56',
    level: '中',
    metricKey: 'topRanking' as MetricKey,
    metrics: [
      { name: 'TOP排行', fluctuation: '18 → 3（上升 15 位）' },
      { name: '体验指数', fluctuation: '69.8 → 58.4（-11.4）' }
    ],
    department: '售后服务部',
    duration: '43.7h',
    result: '已关闭',
    resultType: 'closed',
    summary: '完成重点门店培训及标准话术更新，事后体验指数回升 7.2 分。',
    sharedDimensions: '认证车主、售后服务标签',
    recurrence: '90 日后再次触发'
  }
])

const selectedHistory = computed(() =>
  historicalEvents.value.find(item => item.id === selectedHistoryId.value)
)
const selectHistoricalEvent = (item: { id: string; metricKey: MetricKey }) => {
  selectedHistoryId.value = item.id
  selectedMetric.value = item.metricKey
}

const analysisNameMap = computed<Record<AnalysisKey, string[]>>(() => ({
  viewpoint: props.event.viewpoints.length ? props.event.viewpoints : ['核心问题'],
  scene: ['高速行驶', '冷启动', '拥堵路况', '颠簸路面', '加速超车'],
  series: props.event.series.split('、').filter(Boolean),
  region: ['华东', '华南', '华北', '西南', '东北'],
  audience: ['认证车主', '高活跃用户', '潜客', '新用户', '沉默用户'],
  source: props.event.source.split(/\s*\/\s*|、/).filter(Boolean)
}))

const buildAnalysisRows = (names: string[], seed: number): AnalysisRow[] => {
  const safeNames = names.length ? names : ['其他']
  const mentions = safeNames.map((_, index) => Math.max(460, 4680 - index * 670 + seed * 83))
  const total = mentions.reduce((sum, value) => sum + value, 0)
  return safeNames.map((name, index) => {
    const base = 54 + ((seed + index * 7) % 25)
    return {
      name,
      mentions: mentions[index],
      share: Number(((mentions[index] / total) * 100).toFixed(1)),
      negativeRate: Number(Math.min(89, base + (index < 2 ? 7 : 0)).toFixed(1)),
      positiveRate: Number(Math.max(6, 28 - index * 3.2 - (seed % 4)).toFixed(1)),
      mom: `${index % 4 === 3 ? '-' : '+'}${(14.8 - index * 2.1 + seed * 0.3).toFixed(1)}%`,
      trend: [42, 48 + seed, 45, 57 + index * 2, 54, 66 + seed, 72 - index],
      negativeTrend: [38, 42, 47 + index, 45, 56 + seed, 63 - index, 69 + seed]
    }
  })
}

const analysisData = computed<Record<AnalysisKey, AnalysisRow[]>>(() => ({
  viewpoint: buildAnalysisRows(analysisNameMap.value.viewpoint, 2),
  scene: buildAnalysisRows(analysisNameMap.value.scene, 3),
  series: buildAnalysisRows(analysisNameMap.value.series, 4),
  region: buildAnalysisRows(analysisNameMap.value.region, 5),
  audience: buildAnalysisRows(analysisNameMap.value.audience, 6),
  source: buildAnalysisRows(analysisNameMap.value.source, 7)
}))
const activeAnalysisLabel = computed(
  () => analysisTabs.find(item => item.key === activeAnalysis.value)?.label || '多维分析'
)
const currentAnalysisRows = computed(() => {
  const baseRows = analysisData.value[activeAnalysis.value]
  const currentFilters = selectedAnalysisFilters.value.filter(
    filter => filter.analysis === activeAnalysis.value
  )
  const filteredRows = currentFilters.length
    ? baseRows.filter(row => currentFilters.some(filter => filter.value === row.name))
    : baseRows
  const otherFilterCount = selectedAnalysisFilters.value.filter(
    filter => filter.analysis !== activeAnalysis.value
  ).length
  const factor = Math.max(0.55, 1 - otherFilterCount * 0.08)
  const adjustedMentions = filteredRows.map(row => Math.round(row.mentions * factor))
  const total = adjustedMentions.reduce((sum, value) => sum + value, 0)
  return filteredRows.map((row, index) => ({
    ...row,
    mentions: adjustedMentions[index],
    share: Number(((adjustedMentions[index] / Math.max(1, total)) * 100).toFixed(1))
  }))
})
const analysisMixedChartData = computed(() =>
  currentAnalysisRows.value.map(item => ({
    name: item.name,
    mentions: item.mentions,
    negativeRate: item.negativeRate
  }))
)
const addAnalysisFilter = (analysis: AnalysisKey, value: string) => {
  if (
    selectedAnalysisFilters.value.some(
      filter => filter.analysis === analysis && filter.value === value
    )
  )
    return
  const label = analysisTabs.find(item => item.key === analysis)?.label || '筛选'
  selectedAnalysisFilters.value.push({
    id: ++analysisFilterSequence,
    analysis,
    label,
    value
  })
}
const removeAnalysisFilter = (id: number) => {
  selectedAnalysisFilters.value = selectedAnalysisFilters.value.filter(filter => filter.id !== id)
}
const sparklinePoints = (values: number[]) => {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = Math.max(1, max - min)
  return values
    .map(
      (value, index) =>
        `${(index / (values.length - 1)) * 70 + 1},${20 - ((value - min) / range) * 17}`
    )
    .join(' ')
}
</script>

<style scoped lang="scss">
.topic-insight-panel {
  display: grid;
  gap: 14px;
  color: #273247;
  font-size: 13px;
}
.insight-overview {
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid #dbe8f8;
  border-radius: 6px;
  background: #f5f9ff;
}
.insight-overview > div:first-child > span {
  color: #1769e0;
  font-size: 13px;
}
.insight-overview h3 {
  margin: 4px 0 3px;
  color: #243148;
  font-size: 18px;
}
.insight-overview p {
  margin: 0;
  color: #7a8799;
  font-size: 12px;
}
.insight-updated {
  flex: 0 0 auto;
  color: #748196;
  font-size: 12px;
}
.insight-updated i {
  margin-right: 5px;
  color: #1769e0;
}
.insight-kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}
.insight-kpi-grid article {
  min-width: 0;
  padding: 12px 14px;
  border: 1px solid #e0e6ef;
  border-radius: 6px;
  background: #fff;
}
.insight-kpi-grid span,
.insight-kpi-grid small {
  display: block;
  color: #7c899b;
  font-size: 11px;
}
.insight-kpi-grid span {
  font-size: 13px;
}
.insight-kpi-grid strong {
  display: block;
  margin: 5px 0 3px;
  color: #253149;
  font-size: 24px;
}
.insight-kpi-grid strong.risk-value {
  color: #e4002b;
}
.insight-kpi-grid strong em {
  margin-left: 2px;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
}
.insight-card {
  padding: 14px 16px;
  border: 1px solid #e0e6ef;
  border-radius: 6px;
  background: #fff;
}
.card-heading {
  margin-bottom: 12px;
}
.split-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.card-heading h3 {
  margin: 0 0 3px;
  color: #273247;
  font-size: 16px;
}
.history-summary {
  display: flex;
  gap: 6px;
}
.history-summary span {
  padding: 4px 8px;
  border-radius: 3px;
  background: #eef8f6;
  color: #118c7f;
  font-size: 11px;
}
.history-summary span.alert {
  background: #fff2f4;
  color: #e4002b;
}
.history-table-wrap {
  overflow-x: auto;
}
.history-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 13px;
}
.history-table th {
  padding: 8px 9px;
  background: #f4f6f9;
  color: #6d7a8e;
  text-align: left;
  font-weight: 500;
}
.history-table td {
  padding: 9px;
  border-bottom: 1px solid #edf0f4;
  color: #526075;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.history-table tr {
  cursor: pointer;
}
.history-table tr.selected td {
  background: #f2f7ff;
}
.history-table td button {
  border: 0;
  background: transparent;
  color: #1769e0;
  font-size: 13px;
}
.event-level-tag {
  padding: 3px 7px;
  border-radius: 3px;
  font-size: 10px;
}
.event-level-tag.level-高 {
  background: #fff0f2;
  color: #e4002b;
}
.event-level-tag.level-中 {
  background: #fff6df;
  color: #d98200;
}
.event-level-tag.level-低 {
  background: #eaf8f6;
  color: #159b8d;
}
.result-tag {
  padding: 3px 7px;
  border-radius: 3px;
  background: #edf8f6;
  color: #118c7f;
}
.result-tag.escalated {
  background: #fff1f3;
  color: #e4002b;
}
.history-link-banner {
  margin-top: 10px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 9px;
  border: 1px solid #dce8f7;
  border-radius: 5px;
  background: #f7faff;
}
.history-link-banner > i {
  color: #1769e0;
  font-size: 18px;
}
.history-link-banner > div {
  min-width: 0;
  flex: 1;
}
.history-link-banner strong,
.history-link-banner p {
  display: block;
  margin: 0;
}
.history-link-banner strong {
  font-size: 13px;
}
.history-link-banner p {
  margin-top: 3px;
  color: #748196;
  font-size: 11px;
}
.history-link-banner > span {
  flex: 0 0 auto;
  color: #435168;
  font-size: 11px;
}
.metric-controls {
  display: flex;
  align-items: center;
  gap: 9px;
}
.lifecycle-title-line {
  display: flex;
  align-items: center;
  gap: 8px;
}
.lifecycle-title-line h3 {
  margin: 0;
}
.comparison-chip {
  padding: 5px 8px;
  border-radius: 3px;
  background: #fff3f5;
  color: #d70028;
  font-size: 11px;
}
.metric-switch {
  display: flex;
}
.metric-switch button {
  height: 32px;
  padding: 0 10px;
  border: 1px solid #dbe1ea;
  background: #fff;
  color: #657287;
  font-size: 11px;
}
.metric-switch button:first-child {
  border-radius: 4px 0 0 4px;
}
.metric-switch button:last-child {
  border-radius: 0 4px 4px 0;
}
.metric-switch button + button {
  margin-left: -1px;
}
.metric-switch button.active {
  position: relative;
  border-color: #1769e0;
  background: #edf5ff;
  color: #1769e0;
}
.chart-note {
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 16px;
  color: #7b8798;
  font-size: 12px;
}
.chart-note span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.chart-note i {
  display: inline-block;
  width: 18px;
  border-top: 2px solid #e4002b;
}
.chart-note i.threshold-line {
  border-top: 1px dashed #f2994a;
}
.chart-note p {
  margin: 0 0 0 auto;
}
.multidimensional-card .card-heading {
  margin-bottom: 10px;
}
.analysis-heading {
  align-items: center;
}
.analysis-heading > h3 {
  flex: 0 0 auto;
  margin: 0;
}
.analysis-tabs {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
}
.analysis-tabs button {
  height: 28px;
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 1px solid #dfe5ee;
  border-radius: 4px;
  background: #f7f8fa;
  color: #667388;
  font-size: 10px;
}
.analysis-tabs button.active {
  border-color: #1769e0;
  background: #1769e0;
  color: #fff;
}
.selected-filter-bar {
  min-height: 24px;
  margin-bottom: 10px;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  border: 0;
  background: transparent;
}
.selected-filter-bar button {
  flex: 0 0 auto;
  height: 24px;
  padding: 0 7px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 1px solid #bfd6f8;
  border-radius: 3px;
  background: #edf5ff;
  color: #1769e0;
  font-size: 10px;
}
.analysis-table-wrap {
  margin-top: 10px;
  max-height: 224px;
  overflow: auto;
}
.analysis-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 3px;
  font-size: 11px;
}
.analysis-table th,
.analysis-table td {
  min-width: 82px;
  height: 38px;
  padding: 6px 8px;
  border-radius: 4px;
  background: #f5f7fa;
  color: #526075;
  text-align: center;
}
.analysis-table th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #eaf3ff;
  color: #46617f;
  font-weight: 600;
}
.analysis-table th:first-child,
.analysis-table td:first-child {
  position: sticky;
  left: 0;
  z-index: 1;
  min-width: 116px;
  text-align: left;
}
.analysis-table tbody tr {
  cursor: pointer;
}
.analysis-table tbody tr:hover td {
  background: #eef5ff;
}
.analysis-table td.alert {
  background: #ffe2df;
  color: #d84b45;
  font-weight: 600;
}
.analysis-table td.up {
  color: #e4002b;
}
.analysis-table td.down {
  color: #159b8d;
}
.mini-trend {
  width: 72px;
  height: 22px;
}
.mini-trend polyline {
  fill: none;
  stroke: #2a91df;
  stroke-width: 1.7;
}
.mini-trend.negative polyline {
  stroke: #e96a78;
}
.insight-source-note {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #8b96a6;
  font-size: 10px;
}
.insight-source-note i {
  color: #1769e0;
}
</style>
