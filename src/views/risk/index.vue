<template>
  <div class="acro-topic-loop">
    <header class="page-heading">
      <div>
        <h1>课题管理</h1>
        <p>集中管理课题预警、审核、业务响应与闭环处置，沉淀证据并追踪处理成效。</p>
      </div>
    </header>

    <section class="status-summary" aria-label="课题事件状态概览">
      <button
        v-for="item in summaryCards"
        :key="item.key"
        :class="['summary-card', { selected: quickStatus === item.key }]"
        @click="toggleQuickStatus(item.key)"
      >
        <i :class="item.icon" :style="{ color: item.color }"></i>
        <div>
          <span>{{ item.label }}</span
          ><strong :style="{ color: item.color }">{{ item.value }}</strong>
        </div>
      </button>
    </section>

    <div class="data-updated">
      数据更新时间：2025-10-07 14:30:00 <i class="ri-refresh-line"></i>
    </div>

    <section class="filter-panel">
      <div class="section-heading">
        <h2><i></i>筛选条件</h2>
        <div class="filter-actions">
          <button class="primary-button" @click="applyFilters">
            <i class="ri-search-line"></i>查询
          </button>
          <button class="plain-button" @click="resetFilters">重置</button>
          <button class="collapse-button" @click="filterCollapsed = !filterCollapsed">
            {{ filterCollapsed ? '展开' : '收起' }}
            <i :class="filterCollapsed ? 'ri-arrow-down-s-line' : 'ri-arrow-up-s-line'"></i>
          </button>
        </div>
      </div>
      <div v-show="!filterCollapsed" class="filter-grid">
        <label><span>预警时间</span><input v-model="draftFilters.warningDate" type="date" /></label>
        <label
          ><span>预警频率</span
          ><select v-model="draftFilters.frequency">
            <option value="">不限</option>
            <option>实时</option>
            <option>日</option>
            <option>周</option>
            <option>月</option>
            <option>自定义</option>
          </select></label
        >
        <label
          ><span>课题分类</span
          ><select v-model="draftFilters.category">
            <option value="">不限</option>
            <option>动力总成</option>
            <option>智能座舱</option>
            <option>产品设计</option>
            <option>产品质量</option>
          </select></label
        >
        <label
          ><span>事件等级</span
          ><select v-model="draftFilters.priority">
            <option value="">不限</option>
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select></label
        >
        <label
          ><span>主责单位</span
          ><select v-model="draftFilters.department">
            <option value="">不限</option>
            <option>售后服务部</option>
            <option>产品企划部</option>
            <option>质量保证部</option>
            <option>客服中心</option>
          </select></label
        >
        <label
          ><span>业务责任人</span><input v-model="draftFilters.owner" placeholder="请输入"
        /></label>
        <label
          ><span>课题状态</span
          ><select v-model="draftFilters.status">
            <option value="">不限</option>
            <option v-for="item in statusFilterOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </option>
          </select></label
        >
        <label
          ><span>课题有效性</span
          ><select v-model="draftFilters.valid">
            <option value="">不限</option>
            <option value="true">有效</option>
            <option value="false">待确认</option>
          </select></label
        >
      </div>
    </section>

    <section class="event-list-panel">
      <div class="section-heading list-heading">
        <h2>
          <i></i>课题事件列表 <small>共 {{ filteredEvents.length }} 条</small>
        </h2>
        <div class="list-actions">
          <button class="plain-button" @click="exportEvents">
            <i class="ri-download-2-line"></i>导出课题
          </button>
          <select
            :disabled="selectedIds.size === 0"
            aria-label="批量操作"
            @change="handleBatchAction"
          >
            <option value="">
              批量操作{{ selectedIds.size ? `（${selectedIds.size}）` : '' }}
            </option>
            <option value="advance">推进至下一阶段</option>
            <option value="close">批量关闭课题</option>
          </select>
        </div>
      </div>

      <div class="event-table-wrap">
        <table class="event-table">
          <thead>
            <tr>
              <th class="checkbox-cell">
                <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" />
              </th>
              <th>课题编号</th>
              <th>课题名称</th>
              <th>课题分类</th>
              <th>事件等级</th>
              <th>预警频率</th>
              <th>预警时间</th>
              <th>主责单位</th>
              <th>数据来源</th>
              <th>品牌</th>
              <th>车系</th>
              <th class="status-cell">课题状态</th>
              <th class="operation-cell">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in pagedEvents" :key="event.id">
              <td class="checkbox-cell">
                <input
                  type="checkbox"
                  :checked="selectedIds.has(event.id)"
                  @change="toggleSelected(event.id)"
                />
              </td>
              <td class="event-id">{{ event.id }}</td>
              <td>
                <strong class="event-name">{{ event.title }}</strong>
              </td>
              <td>{{ event.category }}</td>
              <td>
                <span :class="['priority-tag', `priority-${event.priority.toLowerCase()}`]">{{
                  event.priority
                }}</span>
              </td>
              <td>{{ event.frequency }}</td>
              <td>{{ event.warningTime }}</td>
              <td>{{ event.department }}</td>
              <td>{{ event.source }}</td>
              <td>{{ event.brand }}</td>
              <td class="series-cell" :title="event.series">{{ event.series }}</td>
              <td class="status-cell">
                <span :class="['status-tag', statusClass(event.status)]"
                  ><i></i>{{ displayEventStatus(event.status) }}</span
                >
              </td>
              <td class="operation-cell">
                <button @click="openEvent(event.id, 'progress')">查看</button
                ><button
                  v-if="event.status !== '事件关闭'"
                  @click="openEvent(event.id, 'progress')"
                >
                  {{ actionLabel(event.status) }}
                </button>
              </td>
            </tr>
            <tr v-if="filteredEvents.length === 0">
              <td colspan="13" class="empty-row">
                <i class="ri-inbox-2-line"></i><span>暂无符合条件的课题事件</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer class="table-pagination">
        <span>共 {{ filteredEvents.length }} 条</span>
        <button :disabled="currentPage === 1" aria-label="上一页" @click="currentPage--">
          <i class="ri-arrow-left-s-line"></i>
        </button>
        <template v-for="item in paginationItems" :key="item">
          <em v-if="typeof item === 'string'">…</em>
          <button v-else :class="{ active: currentPage === item }" @click="currentPage = item">
            {{ item }}
          </button>
        </template>
        <button :disabled="currentPage === pageCount" aria-label="下一页" @click="currentPage++">
          <i class="ri-arrow-right-s-line"></i>
        </button>
        <select v-model.number="pageSize" aria-label="每页条数" @change="currentPage = 1">
          <option :value="10">10条/页</option>
          <option :value="20">20条/页</option>
        </select>
      </footer>
    </section>

    <TopicEventDrawer
      :open="drawerOpen"
      :event="activeEvent"
      :initial-tab="drawerTab"
      @close="drawerOpen = false"
      @advance="advanceEvent"
      @reject="rejectEvent"
      @close-event="closeTopicEvent"
    />
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import TopicEventDrawer from './components/TopicEventDrawer.vue'
import {
  initialTopicEvents,
  statusOrder,
  type TopicEvent,
  type TopicEventStatus
} from './topicEventData'

type DrawerTab = 'insight' | 'voice' | 'progress'
type FilterState = {
  warningDate: string
  frequency: string
  category: string
  priority: string
  department: string
  owner: string
  status: string
  valid: string
}

const emptyFilters = (): FilterState => ({
  warningDate: '',
  frequency: '',
  category: '',
  priority: '',
  department: '',
  owner: '',
  status: '',
  valid: ''
})
const cloneEvents = () =>
  Array.from({ length: 100 }, (_, index) => {
    const template = initialTopicEvents[index % initialTopicEvents.length]
    const cycle = Math.floor(index / initialTopicEvents.length)
    const serial = String(index + 1).padStart(3, '0')
    const minute = String(Math.max(0, 50 - (index % 50))).padStart(2, '0')
    return {
      ...template,
      id: `KT202510071030${serial}`,
      title:
        cycle === 0 ? template.title : `${template.title.replace('课题', '')}专项课题${cycle + 1}`,
      warningTime: `2025-10-${String(7 - (cycle % 6)).padStart(2, '0')} ${String(
        13 - (index % 7)
      ).padStart(2, '0')}:${minute}:${String((15 + index) % 60).padStart(2, '0')}`,
      evidenceCount: template.evidenceCount + index * 7,
      voiceCount: template.voiceCount + index * 113,
      userCount: template.userCount + index * 47,
      viewpoints: [...template.viewpoints],
      voices: template.voices.map(voice => ({ ...voice, tags: [...voice.tags] }))
    }
  })

const events = ref<TopicEvent[]>(cloneEvents())
const drawerOpen = ref(false)
const activeEventId = ref('')
const drawerTab = ref<DrawerTab>('progress')
const filterCollapsed = ref(false)
const quickStatus = ref('')
const selectedIds = ref(new Set<string>())
const currentPage = ref(1)
const pageSize = ref(10)
const draftFilters = reactive<FilterState>(emptyFilters())
const appliedFilters = reactive<FilterState>(emptyFilters())

const summaryCards = [
  { key: 'pending', label: '待处理课题', value: 128, color: '#e4002b', icon: 'ri-time-line' },
  { key: 'processing', label: '处理中课题', value: 56, color: '#1769e0', icon: 'ri-loader-4-line' },
  { key: 'review', label: '待审核课题', value: 34, color: '#ef6c00', icon: 'ri-user-follow-line' },
  { key: 'confirm', label: '待确认课题', value: 18, color: '#10a99b', icon: 'ri-checkbox-line' },
  {
    key: 'closed',
    label: '已闭环课题',
    value: 232,
    color: '#1769e0',
    icon: 'ri-shield-check-line'
  },
  { key: 'overdue', label: '已超期课题', value: 9, color: '#e4002b', icon: 'ri-alarm-warning-line' }
]
const statusFilterOptions = [
  { value: '声音洞察', label: '事件生成' },
  { value: '预警审核', label: '事件审核' },
  { value: '业务响应', label: '业务响应' },
  { value: '闭环处理', label: '闭环处理' },
  { value: '事件关闭', label: '事件关闭' }
]
const quickStatusMap: Record<string, TopicEventStatus[]> = {
  pending: ['声音洞察'],
  processing: ['业务响应', '闭环处理'],
  review: ['预警审核'],
  confirm: ['待确认'],
  closed: ['事件关闭']
}
const activeEvent = computed(
  () => events.value.find(event => event.id === activeEventId.value) || null
)
const filteredEvents = computed(() =>
  events.value.filter(event => {
    if (appliedFilters.warningDate && !event.warningTime.startsWith(appliedFilters.warningDate))
      return false
    if (appliedFilters.frequency && event.frequency !== appliedFilters.frequency) return false
    if (appliedFilters.category && event.category !== appliedFilters.category) return false
    if (appliedFilters.priority && event.priority !== appliedFilters.priority) return false
    if (appliedFilters.department && event.department !== appliedFilters.department) return false
    if (appliedFilters.owner && !event.owner.includes(appliedFilters.owner.trim())) return false
    if (appliedFilters.status) {
      const matchesHandling =
        appliedFilters.status === '闭环处理' && ['闭环处理', '待确认'].includes(event.status)
      if (!matchesHandling && event.status !== appliedFilters.status) return false
    }
    if (appliedFilters.valid && String(event.valid) !== appliedFilters.valid) return false
    if (quickStatus.value === 'overdue')
      return (
        new Date(event.deadline).getTime() < new Date('2025-10-08T00:00:00').getTime() &&
        event.status !== '事件关闭'
      )
    const allowed = quickStatusMap[quickStatus.value]
    return !allowed || allowed.includes(event.status)
  })
)
const pageCount = computed(() =>
  Math.max(1, Math.ceil(filteredEvents.value.length / pageSize.value))
)
const pagedEvents = computed(() => {
  const safePage = Math.min(currentPage.value, pageCount.value)
  const start = (safePage - 1) * pageSize.value
  return filteredEvents.value.slice(start, start + pageSize.value)
})
const paginationItems = computed<(number | string)[]>(() => {
  if (pageCount.value <= 7) return Array.from({ length: pageCount.value }, (_, index) => index + 1)
  if (currentPage.value <= 4) return [1, 2, 3, 4, 5, 'ellipsis-end', pageCount.value]
  if (currentPage.value >= pageCount.value - 3)
    return [
      1,
      'ellipsis-start',
      pageCount.value - 4,
      pageCount.value - 3,
      pageCount.value - 2,
      pageCount.value - 1,
      pageCount.value
    ]
  return [
    1,
    'ellipsis-start',
    currentPage.value - 1,
    currentPage.value,
    currentPage.value + 1,
    'ellipsis-end',
    pageCount.value
  ]
})
const allSelected = computed(
  () =>
    pagedEvents.value.length > 0 &&
    pagedEvents.value.every(event => selectedIds.value.has(event.id))
)

const applyFilters = () => {
  Object.assign(appliedFilters, draftFilters)
  selectedIds.value = new Set()
  currentPage.value = 1
  Message.success(`已筛选出 ${filteredEvents.value.length} 个课题事件`)
}
const resetFilters = () => {
  Object.assign(draftFilters, emptyFilters())
  Object.assign(appliedFilters, emptyFilters())
  quickStatus.value = ''
  selectedIds.value = new Set()
  currentPage.value = 1
  Message.success('筛选条件已重置')
}
const toggleQuickStatus = (key: string) => {
  quickStatus.value = quickStatus.value === key ? '' : key
  selectedIds.value = new Set()
  currentPage.value = 1
}
const toggleSelected = (id: string) => {
  const next = new Set(selectedIds.value)
  next.has(id) ? next.delete(id) : next.add(id)
  selectedIds.value = next
}
const toggleSelectAll = () => {
  const next = new Set(selectedIds.value)
  if (allSelected.value) pagedEvents.value.forEach(event => next.delete(event.id))
  else pagedEvents.value.forEach(event => next.add(event.id))
  selectedIds.value = next
}
const openEvent = (id: string, tab: DrawerTab) => {
  activeEventId.value = id
  drawerTab.value = tab
  drawerOpen.value = true
}
const nextStatus = (status: TopicEventStatus): TopicEventStatus => {
  const index = statusOrder.indexOf(status)
  return statusOrder[Math.min(index + 1, statusOrder.length - 1)]
}
const advanceEvent = (id: string) => {
  const event = events.value.find(item => item.id === id)
  if (!event) return
  event.status = nextStatus(event.status)
  Message.success(`课题已推进至“${displayEventStatus(event.status)}”`)
}
const rejectEvent = (id: string) => {
  const event = events.value.find(item => item.id === id)
  if (!event) return
  event.status = '预警审核'
  Message.warning('课题已驳回至审核人员二次确认')
}
const closeTopicEvent = (id: string) => {
  const event = events.value.find(item => item.id === id)
  if (!event) return
  event.status = '事件关闭'
  Message.success('事件已关闭并保留全过程记录')
}
const handleBatchAction = (event: Event) => {
  const select = event.target as HTMLSelectElement
  if (!select.value || selectedIds.value.size === 0) return
  events.value.forEach(item => {
    if (selectedIds.value.has(item.id))
      item.status = select.value === 'close' ? '事件关闭' : nextStatus(item.status)
  })
  Message.success(`已处理 ${selectedIds.value.size} 个课题事件`)
  selectedIds.value = new Set()
  select.value = ''
}
const exportEvents = () => {
  const rows = filteredEvents.value.map(event => [
    event.id,
    event.title,
    event.category,
    event.priority,
    displayEventStatus(event.status),
    event.department,
    event.owner
  ])
  const csv = [
    ['课题编号', '课题名称', '课题分类', '事件等级', '课题状态', '主责单位', '业务责任人'],
    ...rows
  ]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = '课题事件列表.csv'
  link.click()
  URL.revokeObjectURL(url)
  Message.success('课题事件已导出')
}
const statusClass = (status: TopicEventStatus) =>
  status === '预警审核' || status === '声音洞察'
    ? 'status-warning'
    : status === '业务响应'
    ? 'status-response'
    : status === '闭环处理' || status === '待确认'
    ? 'status-closing'
    : 'status-closed'
const displayEventStatus = (status: TopicEventStatus) =>
  status === '声音洞察'
    ? '事件生成'
    : status === '预警审核'
    ? '事件审核'
    : status === '待确认'
    ? '闭环处理'
    : status
const actionLabel = (status: TopicEventStatus) =>
  status === '声音洞察'
    ? '提交审核'
    : status === '预警审核'
    ? '审核'
    : status === '业务响应'
    ? '响应'
    : status === '待确认'
    ? '确认'
    : '处理'
</script>

<style lang="scss" scoped>
.acro-topic-loop {
  min-width: 1180px;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 22px 28px 18px;
  background: #f3f6fb;
  color: #253044;
  font-family: Inter, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  * {
    box-sizing: border-box;
  }
  button,
  input,
  select {
    font: inherit;
  }
  button {
    cursor: pointer;
  }
  .page-heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 18px;
  }
  .page-heading h1 {
    margin: 0;
    color: #1c2635;
    font-size: 24px;
    line-height: 34px;
  }
  .page-heading p {
    margin: 5px 0 0;
    color: #7c8798;
    font-size: 13px;
  }
  .primary-button {
    border-color: #1769e0 !important;
    background: #1769e0 !important;
    color: #fff;
    padding: 0 16px;
  }
  .plain-button {
    border: 1px solid #dce2eb;
    background: #fff;
    color: #5c697d;
    padding: 0 14px;
  }
  .plain-button i,
  .primary-button i {
    margin-right: 5px;
  }
  .status-summary {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
  }
  .summary-card {
    position: relative;
    min-height: 76px;
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 14px 18px;
    border: 1px solid #e1e6ee;
    border-radius: 6px;
    background: #fff;
    text-align: left;
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
  }
  .summary-card:hover,
  .summary-card.selected {
    border-color: #96baf0;
    box-shadow: 0 4px 14px rgba(36, 85, 154, 0.08);
  }
  .summary-card.selected::after {
    content: '';
    position: absolute;
    left: 0;
    top: 14px;
    bottom: 14px;
    width: 3px;
    background: #1769e0;
    border-radius: 2px;
  }
  .summary-card > i {
    font-size: 30px;
  }
  .summary-card span,
  .summary-card strong {
    display: block;
  }
  .summary-card span {
    color: #5f6c80;
    font-size: 13px;
  }
  .summary-card strong {
    margin-top: 4px;
    font-size: 24px;
    font-weight: 500;
  }
  .data-updated {
    height: 32px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 6px;
    color: #8995a6;
    font-size: 11px;
  }
  .filter-panel,
  .event-list-panel {
    border: 1px solid #e0e6ee;
    border-radius: 6px;
    background: #fff;
  }
  .filter-panel {
    padding: 12px 14px 15px;
    margin-bottom: 12px;
  }
  .section-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 30px;
  }
  .section-heading h2 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    color: #303b4e;
    font-size: 15px;
  }
  .section-heading h2 > i {
    width: 3px;
    height: 18px;
    border-radius: 2px;
    background: #e4002b;
  }
  .section-heading h2 small {
    color: #929cac;
    font-size: 11px;
    font-weight: 400;
  }
  .section-heading > button {
    border: 0;
    background: transparent;
    color: #758196;
    font-size: 12px;
  }
  .filter-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .filter-actions button {
    height: 30px;
    border-radius: 4px;
    font-size: 12px;
  }
  .filter-actions .collapse-button {
    border: 0;
    background: transparent;
    color: #758196;
    padding: 0 4px 0 8px;
  }
  .filter-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px 22px;
    padding: 10px 8px 0;
  }
  .filter-grid label {
    display: grid;
    grid-template-columns: 76px 1fr;
    align-items: center;
    gap: 8px;
  }
  .filter-grid label > span {
    color: #657287;
    font-size: 12px;
  }
  .filter-grid input,
  .filter-grid select {
    width: 100%;
    height: 34px;
    border: 1px solid #dce2eb;
    border-radius: 4px;
    outline: 0;
    padding: 0 10px;
    color: #4c596d;
    background: #fff;
  }
  .event-list-panel {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 10px 12px 12px;
  }
  .list-heading {
    margin-bottom: 8px;
  }
  .list-actions {
    display: flex;
    gap: 8px;
  }
  .list-actions button,
  .list-actions select {
    height: 34px;
    border: 1px solid #dce2eb;
    border-radius: 4px;
    background: #fff;
    color: #586579;
    padding: 0 12px;
  }
  .list-actions select:disabled {
    color: #a7afba;
    background: #f6f7f9;
    cursor: not-allowed;
  }
  .event-table-wrap {
    flex: 1;
    min-height: 0;
    width: 100%;
    overflow: auto;
    border-top: 1px solid #edf0f4;
  }
  .event-table {
    width: 100%;
    min-width: 1380px;
    border-collapse: collapse;
    table-layout: fixed;
    font-size: 11px;
  }
  .event-table th {
    position: sticky;
    top: 0;
    z-index: 2;
    height: 42px;
    padding: 0 8px;
    background: #f5f7fa;
    color: #4f5c71;
    text-align: left;
    font-weight: 600;
    white-space: nowrap;
  }
  .event-table td {
    height: 43px;
    padding: 0 8px;
    border-bottom: 1px solid #edf0f4;
    color: #536075;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .event-table tbody tr:hover {
    background: #fafcff;
  }
  .event-table tbody tr:hover td {
    background: #fafcff;
  }
  .event-table th:nth-child(2),
  .event-table td:nth-child(2) {
    width: 148px;
  }
  .event-table th:nth-child(3),
  .event-table td:nth-child(3) {
    width: 135px;
  }
  .event-table th:nth-child(4),
  .event-table td:nth-child(4) {
    width: 92px;
  }
  .event-table th:nth-child(5),
  .event-table td:nth-child(5) {
    width: 78px;
    text-align: center;
  }
  .event-table th:nth-child(6),
  .event-table td:nth-child(6) {
    width: 78px;
  }
  .event-table th:nth-child(7),
  .event-table td:nth-child(7) {
    width: 142px;
  }
  .event-table th:nth-child(8),
  .event-table td:nth-child(8) {
    width: 100px;
  }
  .event-table th:nth-child(9),
  .event-table td:nth-child(9) {
    width: 132px;
  }
  .event-table th:nth-child(10),
  .event-table td:nth-child(10) {
    width: 84px;
  }
  .event-table th:nth-child(11),
  .event-table td:nth-child(11) {
    width: 112px;
  }
  .event-table th:nth-child(12),
  .event-table td:nth-child(12) {
    width: 98px;
  }
  .event-table th:nth-child(13),
  .event-table td:nth-child(13) {
    width: 92px;
  }
  .checkbox-cell {
    width: 42px;
    text-align: center !important;
  }
  .event-table input[type='checkbox'] {
    width: 14px;
    height: 14px;
    accent-color: #1769e0;
  }
  .event-id {
    color: #40506a !important;
  }
  .event-name {
    color: #344158;
    font-weight: 500;
  }
  .series-cell {
    max-width: 112px;
  }
  .priority-tag {
    display: inline-grid;
    place-items: center;
    min-width: 29px;
    height: 22px;
    border-radius: 3px;
    font-weight: 600;
  }
  .priority-高 {
    color: #e4002b;
    background: #fff0f2;
  }
  .priority-中 {
    color: #e38b00;
    background: #fff7dc;
  }
  .priority-低 {
    color: #118c80;
    background: #e8f8f5;
  }
  .status-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
  .status-tag i {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
  .status-warning {
    color: #e4002b;
  }
  .status-warning i {
    background: #e4002b;
  }
  .status-response {
    color: #ed7c00;
  }
  .status-response i {
    background: #ed7c00;
  }
  .status-closing {
    color: #139b8e;
  }
  .status-closing i {
    background: #139b8e;
  }
  .status-closed {
    color: #7c8798;
  }
  .status-closed i {
    background: #98a3b3;
  }
  .operation-cell {
    position: sticky;
    right: 0;
    z-index: 1;
    width: 92px;
    min-width: 92px;
    background: #fff;
    overflow: visible !important;
  }
  th.operation-cell {
    z-index: 4;
    background: #f5f7fa;
  }
  .status-cell {
    position: sticky;
    right: 92px;
    z-index: 1;
    width: 98px;
    min-width: 98px;
    background: #fff;
    box-shadow: -8px 0 12px -12px rgba(43, 58, 82, 0.45);
  }
  th.status-cell {
    z-index: 4;
    background: #f5f7fa;
  }
  .operation-cell button {
    padding: 0;
    margin-right: 12px;
    border: 0;
    background: transparent;
    color: #1769e0;
    font-size: 11px;
  }
  .empty-row {
    height: 180px !important;
    text-align: center;
    color: #9aa4b3 !important;
  }
  .empty-row i,
  .empty-row span {
    display: block;
  }
  .empty-row i {
    margin-bottom: 6px;
    font-size: 28px;
  }
  .table-pagination {
    height: 54px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 6px;
    color: #6f7b8e;
    font-size: 11px;
  }
  .table-pagination > span {
    margin-right: 5px;
  }
  .table-pagination button {
    min-width: 28px;
    height: 28px;
    border: 0;
    border-radius: 4px;
    background: #fff;
    color: #566378;
  }
  .table-pagination button.active {
    color: #1769e0;
    background: #edf4ff;
  }
  .table-pagination button:disabled {
    color: #b3bac5;
    cursor: not-allowed;
  }
  .table-pagination em {
    font-style: normal;
  }
  .table-pagination select {
    height: 30px;
    margin-left: 7px;
    border: 1px solid #dce2eb;
    border-radius: 4px;
    color: #59667a;
    background: #fff;
  }
}
</style>
