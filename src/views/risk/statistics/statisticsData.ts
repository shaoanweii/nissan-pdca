export type EventLevel = '高' | '中' | '低'
export type ClosureStage =
  | '声音洞察'
  | '事件预警'
  | '预警审核'
  | '业务响应'
  | '闭环处理'
  | '事件关闭'

export interface ClosureStatisticRecord {
  date: string
  brand: string
  series: string
  category: string
  level: EventLevel
  department: string
  stage: ClosureStage
  createdCount: number
  closedCount: number
  responseHours: number
  overdueCount: number
  firstPassCount: number
}

export interface StatisticsFilters {
  startDate: string
  endDate: string
  brand: string
  series: string
  category: string
  level: '' | EventLevel
  department: string
}

export interface StatisticsSummary {
  total: number
  closureRate: number | null
  averageResponseHours: number | null
  overdue: number
  firstPassRate: number | null
}

export interface DepartmentPerformance {
  department: string
  total: number
  closed: number
  closureRate: number | null
  averageResponseHours: number | null
  overdue: number
}

export const closureStages: ClosureStage[] = [
  '声音洞察',
  '事件预警',
  '预警审核',
  '业务响应',
  '闭环处理',
  '事件关闭'
]

export const eventLevels: EventLevel[] = ['高', '中', '低']
export const departments = ['客服中心', '质量保证部', '产品企划部', '售后服务部']
export const seriesOptions = ['轩逸', '天籁', '逍客', '奇骏', 'N7']
export const categoryOptions = ['动力总成', '智能座舱', '产品设计', '产品质量']

const months = [
  '2024-11-01',
  '2024-12-01',
  '2025-01-01',
  '2025-02-01',
  '2025-03-01',
  '2025-04-01',
  '2025-05-01',
  '2025-06-01',
  '2025-07-01',
  '2025-08-01',
  '2025-09-01',
  '2025-10-01'
]

export const statisticsRecords: ClosureStatisticRecord[] = months.flatMap((date, monthIndex) =>
  departments.map((department, departmentIndex) => {
    const createdCount = 18 + ((monthIndex * 3 + departmentIndex * 5) % 24)
    const closedCount = Math.max(0, createdCount - ((monthIndex + departmentIndex * 2) % 7))
    return {
      date,
      brand: '东风日产',
      series: seriesOptions[(monthIndex + departmentIndex) % seriesOptions.length],
      category: categoryOptions[(monthIndex + departmentIndex * 2) % categoryOptions.length],
      level: eventLevels[(monthIndex + departmentIndex) % eventLevels.length],
      department,
      stage: closureStages[(monthIndex + departmentIndex) % closureStages.length],
      createdCount,
      closedCount,
      responseHours: 8 + ((monthIndex * 2 + departmentIndex * 3) % 20),
      overdueCount: (monthIndex + departmentIndex * 2) % 4,
      firstPassCount: Math.max(0, closedCount - ((monthIndex + departmentIndex) % 5))
    }
  })
)

export const emptyStatisticsFilters = (): StatisticsFilters => ({
  startDate: '',
  endDate: '',
  brand: '',
  series: '',
  category: '',
  level: '',
  department: ''
})

export const filterStatistics = (records: ClosureStatisticRecord[], filters: StatisticsFilters) =>
  records.filter(record => {
    if (filters.startDate && record.date < filters.startDate) return false
    if (filters.endDate && record.date > filters.endDate) return false
    if (filters.brand && record.brand !== filters.brand) return false
    if (filters.series && record.series !== filters.series) return false
    if (filters.category && record.category !== filters.category) return false
    if (filters.level && record.level !== filters.level) return false
    if (filters.department && record.department !== filters.department) return false
    return true
  })

export const summarizeStatistics = (records: ClosureStatisticRecord[]): StatisticsSummary => {
  const total = records.reduce((sum, item) => sum + item.createdCount, 0)
  const closed = records.reduce((sum, item) => sum + item.closedCount, 0)
  const firstPass = records.reduce((sum, item) => sum + item.firstPassCount, 0)
  return {
    total,
    closureRate: total ? (closed / total) * 100 : null,
    averageResponseHours: records.length
      ? records.reduce((sum, item) => sum + item.responseHours, 0) / records.length
      : null,
    overdue: records.reduce((sum, item) => sum + item.overdueCount, 0),
    firstPassRate: closed ? (firstPass / closed) * 100 : null
  }
}

export const groupByDate = (records: ClosureStatisticRecord[]) => {
  const grouped = new Map<string, { created: number; closed: number }>()
  records.forEach(record => {
    const current = grouped.get(record.date) || { created: 0, closed: 0 }
    current.created += record.createdCount
    current.closed += record.closedCount
    grouped.set(record.date, current)
  })
  return [...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, value]) => ({
      date,
      ...value,
      rate: value.created ? (value.closed / value.created) * 100 : 0
    }))
}

export const departmentPerformance = (records: ClosureStatisticRecord[]): DepartmentPerformance[] =>
  departments
    .map(department => {
      const rows = records.filter(item => item.department === department)
      const total = rows.reduce((sum, item) => sum + item.createdCount, 0)
      const closed = rows.reduce((sum, item) => sum + item.closedCount, 0)
      return {
        department,
        total,
        closed,
        closureRate: total ? (closed / total) * 100 : null,
        averageResponseHours: rows.length
          ? rows.reduce((sum, item) => sum + item.responseHours, 0) / rows.length
          : null,
        overdue: rows.reduce((sum, item) => sum + item.overdueCount, 0)
      }
    })
    .filter(item => item.total > 0)
    .sort((left, right) => (right.closureRate || 0) - (left.closureRate || 0))
