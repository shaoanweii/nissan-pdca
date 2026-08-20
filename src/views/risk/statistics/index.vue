<template>
  <div class="acro-closure-statistics">
    <header class="page-heading">
      <div>
        <h1>闭环统计</h1>
        <p>追踪课题闭环效率、响应时长与部门绩效。</p>
      </div>
      <span>数据更新时间：2025-10-07 14:30:00</span>
    </header>

    <section class="filter-panel">
      <div class="panel-heading">
        <h2>筛选条件</h2>
        <div>
          <button class="primary" @click="applyFilters">查询</button
          ><button @click="resetFilters">重置</button>
        </div>
      </div>
      <div class="filter-grid">
        <label><span>开始时间</span><input v-model="draftFilters.startDate" type="date" /></label>
        <label><span>结束时间</span><input v-model="draftFilters.endDate" type="date" /></label>
        <label
          ><span>品牌</span
          ><select v-model="draftFilters.brand">
            <option value="">不限</option>
            <option>东风日产</option>
          </select></label
        >
        <label
          ><span>车系</span
          ><select v-model="draftFilters.series">
            <option value="">不限</option>
            <option v-for="item in seriesOptions" :key="item">{{ item }}</option>
          </select></label
        >
        <label
          ><span>课题分类</span
          ><select v-model="draftFilters.category">
            <option value="">不限</option>
            <option v-for="item in categoryOptions" :key="item">{{ item }}</option>
          </select></label
        >
        <label
          ><span>事件等级</span
          ><select v-model="draftFilters.level">
            <option value="">不限</option>
            <option v-for="item in eventLevels" :key="item">{{ item }}</option>
          </select></label
        >
        <label
          ><span>主责部门</span
          ><select v-model="draftFilters.department">
            <option value="">不限</option>
            <option v-for="item in departments" :key="item">{{ item }}</option>
          </select></label
        >
      </div>
    </section>

    <section class="statistics-summary" aria-label="闭环核心指标">
      <article v-for="item in summaryCards" :key="item.label" :class="item.tone">
        <span>{{ item.label }}</span
        ><strong>{{ item.value }}</strong
        ><small>{{ item.note }}</small>
      </article>
    </section>

    <section class="statistics-grid">
      <article class="chart-card trend-card">
        <h2>闭环趋势</h2>
        <FEcharts :options="trendOptions" width="100%" height="280px" />
      </article>
      <article class="chart-card level-card">
        <h2>事件等级分布</h2>
        <FEcharts :options="levelOptions" width="100%" height="280px" />
      </article>
      <article class="chart-card">
        <h2>课题阶段分布</h2>
        <FEcharts :options="stageOptions" width="100%" height="260px" />
      </article>
      <article class="chart-card">
        <h2>主责部门闭环率</h2>
        <FEcharts :options="departmentOptions" width="100%" height="260px" />
      </article>
    </section>

    <section class="performance-panel">
      <div class="panel-heading">
        <h2>主责部门绩效</h2>
        <span>共 {{ departmentRows.length }} 个部门</span>
      </div>
      <table class="department-table">
        <thead>
          <tr>
            <th>主责部门</th>
            <th>课题数</th>
            <th>闭环数</th>
            <th>闭环率</th>
            <th>平均响应时长</th>
            <th>超期数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in departmentRows" :key="row.department">
            <td>
              <strong>{{ row.department }}</strong>
            </td>
            <td>{{ row.total }}</td>
            <td>{{ row.closed }}</td>
            <td>
              <span class="rate-tag">{{ formatPercent(row.closureRate) }}</span>
            </td>
            <td>{{ formatHours(row.averageResponseHours) }}</td>
            <td :class="{ overdue: row.overdue > 0 }">{{ row.overdue }}</td>
          </tr>
          <tr v-if="!departmentRows.length">
            <td colspan="6" class="empty-cell">暂无符合条件的数据</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import FEcharts from '@/components/FEcharts/index.vue'
import {
  categoryOptions,
  closureStages,
  departmentPerformance,
  departments,
  emptyStatisticsFilters,
  eventLevels,
  filterStatistics,
  groupByDate,
  seriesOptions,
  statisticsRecords,
  summarizeStatistics,
  type StatisticsFilters
} from './statisticsData'

const draftFilters = reactive<StatisticsFilters>(emptyStatisticsFilters())
const appliedFilters = reactive<StatisticsFilters>(emptyStatisticsFilters())
const filteredRecords = computed(() => filterStatistics(statisticsRecords, appliedFilters))
const summary = computed(() => summarizeStatistics(filteredRecords.value))
const departmentRows = computed(() => departmentPerformance(filteredRecords.value))

const formatPercent = (value: number | null) => (value === null ? '--' : `${value.toFixed(1)}%`)
const formatHours = (value: number | null) => (value === null ? '--' : `${value.toFixed(1)} 小时`)
const formatNumber = (value: number) => value.toLocaleString('zh-CN')

const summaryCards = computed(() => [
  {
    label: '课题总量',
    value: formatNumber(summary.value.total),
    note: '当前筛选范围',
    tone: 'neutral'
  },
  {
    label: '闭环率',
    value: formatPercent(summary.value.closureRate),
    note: '事件关闭 / 课题总量',
    tone: 'positive'
  },
  {
    label: '平均响应时长',
    value: formatHours(summary.value.averageResponseHours),
    note: '从预警到首次响应',
    tone: 'blue'
  },
  {
    label: '超期课题',
    value: formatNumber(summary.value.overdue),
    note: '超过响应 SLA',
    tone: 'negative'
  },
  {
    label: '一次通过率',
    value: formatPercent(summary.value.firstPassRate),
    note: '首次审核即通过',
    tone: 'warning'
  }
])

const commonTooltip = {
  trigger: 'axis' as const,
  backgroundColor: '#273247',
  borderWidth: 0,
  textStyle: { color: '#fff', fontSize: 12 }
}

const trendOptions = computed<EChartsOption>(() => {
  const rows = groupByDate(filteredRecords.value)
  return {
    tooltip: commonTooltip,
    legend: {
      bottom: 0,
      itemWidth: 10,
      itemHeight: 6,
      textStyle: { color: '#667388', fontSize: 11 }
    },
    grid: { left: 48, right: 44, top: 24, bottom: 46 },
    xAxis: {
      type: 'category',
      data: rows.map(item => item.date.slice(0, 7)),
      axisLine: { lineStyle: { color: '#dce2eb' } },
      axisLabel: { color: '#8793a4', fontSize: 10 }
    },
    yAxis: [
      {
        type: 'value',
        axisLabel: { color: '#8793a4', fontSize: 10 },
        splitLine: { lineStyle: { color: '#edf0f4', type: 'dashed' } }
      },
      {
        type: 'value',
        max: 100,
        axisLabel: { formatter: '{value}%', color: '#8793a4', fontSize: 10 },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '新增课题',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: rows.map(item => item.created),
        lineStyle: { color: '#1769e0', width: 2 },
        areaStyle: { color: 'rgba(23,105,224,.08)' }
      },
      {
        name: '闭环课题',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: rows.map(item => item.closed),
        lineStyle: { color: '#159b8d', width: 2 }
      },
      {
        name: '闭环率',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'none',
        data: rows.map(item => Number(item.rate.toFixed(1))),
        lineStyle: { color: '#e4002b', width: 2 }
      }
    ]
  }
})

const stageOptions = computed<EChartsOption>(() => ({
  tooltip: commonTooltip,
  grid: { left: 38, right: 20, top: 18, bottom: 44 },
  xAxis: {
    type: 'category',
    data: closureStages,
    axisLabel: { color: '#667388', fontSize: 10, interval: 0 },
    axisLine: { lineStyle: { color: '#dce2eb' } }
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: '#8793a4', fontSize: 10 },
    splitLine: { lineStyle: { color: '#edf0f4', type: 'dashed' } }
  },
  series: [
    {
      type: 'bar',
      data: closureStages.map(stage =>
        filteredRecords.value
          .filter(item => item.stage === stage)
          .reduce((sum, item) => sum + item.createdCount, 0)
      ),
      barWidth: 22,
      itemStyle: { color: '#1769e0', borderRadius: [3, 3, 0, 0] },
      label: { show: true, position: 'top', color: '#667388', fontSize: 10 }
    }
  ]
}))

const departmentOptions = computed<EChartsOption>(() => {
  const rows = departmentRows.value.slice().reverse()
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      valueFormatter: value => `${Number(value).toFixed(1)}%`
    },
    grid: { left: 86, right: 48, top: 18, bottom: 26 },
    xAxis: {
      type: 'value',
      max: 100,
      axisLabel: { formatter: '{value}%', color: '#8793a4', fontSize: 10 },
      splitLine: { lineStyle: { color: '#edf0f4', type: 'dashed' } }
    },
    yAxis: {
      type: 'category',
      data: rows.map(item => item.department),
      axisLabel: { color: '#526075', fontSize: 11 },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    series: [
      {
        type: 'bar',
        data: rows.map(item => Number((item.closureRate || 0).toFixed(1))),
        barWidth: 16,
        itemStyle: { color: '#159b8d', borderRadius: [0, 4, 4, 0] },
        label: { show: true, position: 'right', formatter: '{c}%', color: '#667388', fontSize: 10 }
      }
    ]
  }
})

const levelOptions = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'item', formatter: '{b}<br/>{c} 条（{d}%）' },
  legend: { bottom: 4, itemWidth: 9, itemHeight: 9, textStyle: { color: '#667388', fontSize: 11 } },
  series: [
    {
      type: 'pie',
      radius: ['48%', '68%'],
      center: ['50%', '44%'],
      label: { formatter: '{b}\n{d}%', color: '#526075', fontSize: 11 },
      data: [
        {
          name: '高',
          value: filteredRecords.value
            .filter(item => item.level === '高')
            .reduce((sum, item) => sum + item.createdCount, 0),
          itemStyle: { color: '#e4002b' }
        },
        {
          name: '中',
          value: filteredRecords.value
            .filter(item => item.level === '中')
            .reduce((sum, item) => sum + item.createdCount, 0),
          itemStyle: { color: '#e58b00' }
        },
        {
          name: '低',
          value: filteredRecords.value
            .filter(item => item.level === '低')
            .reduce((sum, item) => sum + item.createdCount, 0),
          itemStyle: { color: '#159b8d' }
        }
      ]
    }
  ]
}))

const applyFilters = () => Object.assign(appliedFilters, draftFilters)
const resetFilters = () => {
  Object.assign(draftFilters, emptyStatisticsFilters())
  Object.assign(appliedFilters, emptyStatisticsFilters())
}
</script>

<style lang="scss" scoped>
.acro-closure-statistics {
  min-height: calc(100vh - 64px);
  padding: 22px 24px 30px;
  background: #f4f7fb;
  color: #1d2635;
  overflow: auto;
  .page-heading,
  .panel-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .page-heading {
    margin-bottom: 16px;
  }
  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }
  .page-heading p {
    margin: 5px 0 0;
    color: #7b8798;
    font-size: 13px;
  }
  .page-heading > span {
    color: #8a96a7;
    font-size: 11px;
  }
  .filter-panel,
  .chart-card,
  .performance-panel {
    border: 1px solid #e0e6ef;
    border-radius: 6px;
    background: #fff;
  }
  .filter-panel {
    padding: 12px 14px 14px;
    margin-bottom: 12px;
  }
  .panel-heading h2 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
  }
  .chart-card h2 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
  }
  .panel-heading h2 {
    padding-left: 10px;
    border-left: 3px solid #e4002b;
  }
  .panel-heading > div {
    display: flex;
    gap: 8px;
  }
  .panel-heading button {
    height: 30px;
    padding: 0 14px;
    border: 1px solid #d7dee8;
    border-radius: 4px;
    background: #fff;
    color: #526075;
    font-size: 12px;
  }
  .panel-heading button.primary {
    border-color: #1769e0;
    background: #1769e0;
    color: #fff;
  }
  .filter-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px 16px;
    margin-top: 12px;
  }
  .filter-grid label {
    display: grid;
    grid-template-columns: 70px 1fr;
    align-items: center;
    gap: 8px;
  }
  .filter-grid span {
    color: #657287;
    font-size: 12px;
  }
  .filter-grid input,
  .filter-grid select {
    width: 100%;
    height: 32px;
    border: 1px solid #dbe1ea;
    border-radius: 4px;
    background: #fff;
    color: #3e4b60;
    padding: 0 9px;
    font-size: 12px;
  }
  .statistics-summary {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 10px;
    margin-bottom: 12px;
  }
  .statistics-summary article {
    min-height: 88px;
    padding: 12px 14px;
    border: 1px solid #e0e6ef;
    border-radius: 6px;
    background: #fff;
  }
  .statistics-summary span,
  .statistics-summary small {
    display: block;
    color: #7b8798;
    font-size: 11px;
  }
  .statistics-summary strong {
    display: block;
    margin: 7px 0 4px;
    color: #273247;
    font-size: 24px;
    line-height: 1;
  }
  .statistics-summary .positive strong {
    color: #159b8d;
  }
  .statistics-summary .blue strong {
    color: #1769e0;
  }
  .statistics-summary .negative strong {
    color: #e4002b;
  }
  .statistics-summary .warning strong {
    color: #d98300;
  }
  .statistics-grid {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 12px;
  }
  .chart-card {
    grid-column: span 6;
    padding: 14px 16px;
    min-width: 0;
  }
  .trend-card {
    grid-column: span 8;
  }
  .level-card {
    grid-column: span 4;
  }
  .performance-panel {
    margin-top: 12px;
    padding: 14px 16px 16px;
  }
  .performance-panel .panel-heading {
    margin-bottom: 10px;
  }
  .performance-panel .panel-heading > span {
    color: #8a96a7;
    font-size: 11px;
  }
  .department-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }
  .department-table th {
    padding: 10px 12px;
    background: #f4f6f9;
    color: #667388;
    text-align: left;
    font-weight: 500;
  }
  .department-table td {
    padding: 11px 12px;
    border-bottom: 1px solid #edf0f4;
    color: #526075;
  }
  .department-table td strong {
    color: #344158;
    font-weight: 500;
  }
  .rate-tag {
    color: #118c80;
    font-weight: 600;
  }
  .overdue {
    color: #e4002b !important;
    font-weight: 600;
  }
  .empty-cell {
    padding: 28px !important;
    text-align: center;
    color: #9aa4b4 !important;
  }
}
</style>
