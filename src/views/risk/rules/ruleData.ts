export type RuleLevel = '高' | '中' | '低'
export type RuleStatus = '启用' | '停用'
export type RuleMode = 'create' | 'edit' | 'view'
export type RuleOperator = '>=' | '>' | '<=' | '<' | '='
export type RuleCombinator = 'AND' | 'OR'
export type DimensionRelation = '包含' | '等于' | '不包含' | '不等于'
export type DimensionAggregation = '加和计算' | '独立计算'
export type MetricCalculation = '数值' | '环比' | '同比' | '排名'
export type MetricCompareTarget = '本期数值' | '上期数值' | '目标值'
export type ReminderUnit = '小时' | '天'
export type EventNotificationStage = '事件审核' | '业务响应' | '闭环处理' | '事件关闭'

export interface StageNotificationRule {
  stage: EventNotificationStage
  targets: string[]
}

export interface DueReminderRule {
  id: string
  advanceValue: number
  advanceUnit: ReminderUnit
  channels: string[]
}

export interface OverdueEscalationConfig {
  enabled: boolean
  delayHours: number
  upperUnit: string
  supervisors: string[]
  channels: string[]
}

export interface RuleDimensionCondition {
  id: string
  dimension: string
  relation: DimensionRelation
  valueMode: '选项'
  aggregation: DimensionAggregation
  values: string[]
}

export interface RuleMetricCondition {
  id: string
  metric: string
  operator: RuleOperator
  threshold: number
  combinator: RuleCombinator
  calculation: MetricCalculation
  compareTarget: MetricCompareTarget
}

export interface ClosureRule {
  id: string
  name: string
  objectType: string
  objectScope: string[]
  dimensions: string[]
  dimensionConditions: RuleDimensionCondition[]
  metric: string
  operator: RuleOperator
  threshold: number
  combinator: RuleCombinator
  metricConditions: RuleMetricCondition[]
  level: RuleLevel
  frequency: '实时' | '日' | '周' | '月'
  reviewMode: '人工审核' | '自动通过'
  responseMode: '人工审核' | '自动通过'
  department: string
  owner: string
  reviewer: string
  noticeTargets: string[]
  stageNotifications: StageNotificationRule[]
  slaHours: number
  dueReminders: DueReminderRule[]
  overdueEscalation: OverdueEscalationConfig
  status: RuleStatus
  hitCount: number
  updatedAt: string
}

export interface RuleFilters {
  keyword: string
  status: '' | RuleStatus
  objectType: string
  level: '' | RuleLevel
}

export interface RuleSummary {
  total: number
  enabled: number
  disabled: number
  hitCount: number
}

const ruleNames = [
  '发动机异响负面声量预警',
  '车机黑屏高频聚集预警',
  '冷启动噪声周度监测',
  '导航定位偏移异常监测',
  '空调制冷投诉日监测',
  '变速箱顿挫声量突增',
  '方向盘抖动高相关预警',
  '座舱异味用户聚集预警',
  '售后等待时长异常监测',
  '充电故障实时预警',
  '胎噪负面率月度监测',
  '制动异响闭环规则'
]

const metrics = ['提及量', '用户数', '负面率', '体验指数', 'TOP排行']
const departments = ['客服中心', '质量保证部', '产品企划部', '售后服务部']
const owners = ['杨琳-60114', '付俊杰-60018', '徐嘉敏-60233', '李建秋-60318']
const levels: RuleLevel[] = ['高', '中', '低']
const frequencies: ClosureRule['frequency'][] = ['实时', '日', '周', '月']

export const initialRules: ClosureRule[] = ruleNames.map((name, index) => ({
  id: `RL20251007${String(index + 1).padStart(3, '0')}`,
  name,
  objectType: index % 2 === 0 ? '车型课题' : '产品问题',
  objectScope: [],
  dimensions: ['在线客服', index % 2 === 0 ? 'App' : '400客服'],
  dimensionConditions: [
    {
      id: `DC-${index + 1}-1`,
      dimension: '数据渠道',
      relation: '包含',
      valueMode: '选项',
      aggregation: '加和计算',
      values: ['在线客服', index % 2 === 0 ? 'App' : '400客服']
    },
    {
      id: `DC-${index + 1}-2`,
      dimension: '车系',
      relation: '包含',
      valueMode: '选项',
      aggregation: '独立计算',
      values: [index % 3 === 0 ? '轩逸' : index % 3 === 1 ? '天籁' : '奇骏']
    }
  ],
  metric: metrics[index % metrics.length],
  operator: index % 3 === 0 ? '>=' : '>',
  threshold: 20 + (index % 5) * 10,
  combinator: index % 2 === 0 ? 'AND' : 'OR',
  metricConditions: [
    {
      id: `MC-${index + 1}-1`,
      metric: metrics[index % metrics.length],
      operator: index % 3 === 0 ? '>=' : '>',
      threshold: 20 + (index % 5) * 10,
      combinator: index % 2 === 0 ? 'AND' : 'OR',
      calculation: '数值',
      compareTarget: '本期数值'
    }
  ],
  level: levels[index % levels.length],
  frequency: frequencies[index % frequencies.length],
  reviewMode: index % 3 === 0 ? '自动通过' : '人工审核',
  responseMode: index % 4 === 0 ? '自动通过' : '人工审核',
  department: departments[index % departments.length],
  owner: owners[index % owners.length],
  reviewer: owners[(index + 1) % owners.length],
  noticeTargets: ['审核人', '事件牵头人', '抄送人'],
  stageNotifications: [
    { stage: '事件审核', targets: ['审核人', '事件牵头人'] },
    { stage: '业务响应', targets: ['事件牵头人', '抄送人'] },
    { stage: '闭环处理', targets: ['事件牵头人', '抄送人'] },
    { stage: '事件关闭', targets: ['审核人', '事件牵头人', '抄送人'] }
  ],
  slaHours: [4, 12, 24, 48][index % 4],
  dueReminders: [
    {
      id: `DR-${index + 1}-1`,
      advanceValue: 7,
      advanceUnit: '天',
      channels: ['东东', '飞书']
    },
    {
      id: `DR-${index + 1}-2`,
      advanceValue: 3,
      advanceUnit: '天',
      channels: ['东东', '飞书', '短信']
    },
    {
      id: `DR-${index + 1}-3`,
      advanceValue: 1,
      advanceUnit: '天',
      channels: ['东东', '飞书', '邮件', '短信']
    }
  ],
  overdueEscalation: {
    enabled: true,
    delayHours: 1,
    upperUnit: departments[(index + 1) % departments.length],
    supervisors: [owners[(index + 1) % owners.length]],
    channels: ['东东', '飞书', '短信']
  },
  status: index % 4 === 3 ? '停用' : '启用',
  hitCount: 16 + index * 7,
  updatedAt: `2025-10-${String(7 - (index % 6)).padStart(2, '0')} ${String(
    14 - (index % 5)
  ).padStart(2, '0')}:20`
}))

export const cloneRules = () =>
  initialRules.map(rule => ({
    ...rule,
    objectScope: [...rule.objectScope],
    dimensions: [...rule.dimensions],
    dimensionConditions: rule.dimensionConditions.map(condition => ({
      ...condition,
      values: [...condition.values]
    })),
    metricConditions: rule.metricConditions.map(condition => ({ ...condition })),
    noticeTargets: [...rule.noticeTargets],
    stageNotifications: rule.stageNotifications.map(item => ({
      ...item,
      targets: [...item.targets]
    })),
    dueReminders: rule.dueReminders.map(reminder => ({
      ...reminder,
      channels: [...reminder.channels]
    })),
    overdueEscalation: {
      ...rule.overdueEscalation,
      supervisors: [...rule.overdueEscalation.supervisors],
      channels: [...rule.overdueEscalation.channels]
    }
  }))

export const emptyRuleFilters = (): RuleFilters => ({
  keyword: '',
  status: '',
  objectType: '',
  level: ''
})

export const filterRules = (rules: ClosureRule[], filters: RuleFilters) => {
  const keyword = filters.keyword.trim()
  return rules.filter(rule => {
    if (keyword && !`${rule.id}${rule.name}${rule.metric}`.includes(keyword)) return false
    if (filters.status && rule.status !== filters.status) return false
    if (filters.objectType && rule.objectType !== filters.objectType) return false
    if (filters.level && rule.level !== filters.level) return false
    return true
  })
}

export const summarizeRules = (rules: ClosureRule[]): RuleSummary => ({
  total: rules.length,
  enabled: rules.filter(rule => rule.status === '启用').length,
  disabled: rules.filter(rule => rule.status === '停用').length,
  hitCount: rules.reduce((sum, rule) => sum + rule.hitCount, 0)
})
