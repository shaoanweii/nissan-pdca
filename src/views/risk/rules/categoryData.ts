export type CategoryStatus = '启用' | '停用'
export type CategoryMode = 'create' | 'edit'

export interface RuleCategory {
  id: string
  name: string
  description: string
  order: number
  status: CategoryStatus
  updatedAt: string
}

export interface CategoryFilters {
  keyword: string
  status: '' | CategoryStatus
}

export const initialCategories: RuleCategory[] = [
  {
    id: 'RT001',
    name: '车型课题',
    description: '与车型设计、性能、配置等相关的问题',
    order: 1,
    status: '启用',
    updatedAt: '2026-08-19 10:30'
  },
  {
    id: 'RT002',
    name: '产品问题',
    description: '产品质量、功能、使用等相关问题',
    order: 2,
    status: '启用',
    updatedAt: '2026-08-19 09:45'
  },
  {
    id: 'RT003',
    name: '服务体验',
    description: '售前、售中、售后服务体验相关问题',
    order: 3,
    status: '停用',
    updatedAt: '2026-08-19 08:20'
  },
  {
    id: 'RT004',
    name: '渠道问题',
    description: '经销商、渠道管理相关问题',
    order: 4,
    status: '启用',
    updatedAt: '2026-08-19 07:15'
  },
  {
    id: 'RT005',
    name: '质量故障',
    description: '零部件质量、故障表现及耐久性相关问题',
    order: 5,
    status: '启用',
    updatedAt: '2026-08-18 18:40'
  },
  {
    id: 'RT006',
    name: '功能体验',
    description: '车辆功能可用性、易用性及异常表现相关问题',
    order: 6,
    status: '启用',
    updatedAt: '2026-08-18 17:25'
  },
  {
    id: 'RT007',
    name: '性能表现',
    description: '动力、制动、加速及综合性能相关反馈',
    order: 7,
    status: '启用',
    updatedAt: '2026-08-18 16:10'
  },
  {
    id: 'RT008',
    name: '智能座舱',
    description: '车机、语音、导航及座舱智能化相关问题',
    order: 8,
    status: '启用',
    updatedAt: '2026-08-18 15:05'
  },
  {
    id: 'RT009',
    name: '车联网服务',
    description: '车辆联网、远程控制及在线服务相关问题',
    order: 9,
    status: '停用',
    updatedAt: '2026-08-18 14:30'
  },
  {
    id: 'RT010',
    name: '驾驶操控',
    description: '转向、底盘、操稳及驾驶感受相关反馈',
    order: 10,
    status: '启用',
    updatedAt: '2026-08-18 13:45'
  },
  {
    id: 'RT011',
    name: '舒适体验',
    description: '空间、座椅、空调、噪声及乘坐舒适性问题',
    order: 11,
    status: '启用',
    updatedAt: '2026-08-18 12:20'
  },
  {
    id: 'RT012',
    name: '安全问题',
    description: '主被动安全功能、风险感知及安全隐患反馈',
    order: 12,
    status: '启用',
    updatedAt: '2026-08-18 11:35'
  },
  {
    id: 'RT013',
    name: '能耗续航',
    description: '油耗、电耗、充电效率及续航表现相关问题',
    order: 13,
    status: '启用',
    updatedAt: '2026-08-18 10:50'
  },
  {
    id: 'RT014',
    name: '外观设计',
    description: '车身造型、颜色、灯具及外观品质相关反馈',
    order: 14,
    status: '启用',
    updatedAt: '2026-08-18 10:05'
  },
  {
    id: 'RT015',
    name: '内饰工艺',
    description: '内饰设计、材质、装配及工艺品质相关问题',
    order: 15,
    status: '停用',
    updatedAt: '2026-08-18 09:30'
  },
  {
    id: 'RT016',
    name: '交付体验',
    description: '订车、提车、交付流程及车辆准备相关反馈',
    order: 16,
    status: '启用',
    updatedAt: '2026-08-18 08:45'
  },
  {
    id: 'RT017',
    name: '售后维修',
    description: '保养、维修、配件供应及维修质量相关问题',
    order: 17,
    status: '启用',
    updatedAt: '2026-08-17 17:30'
  },
  {
    id: 'RT018',
    name: '客服沟通',
    description: '客服响应、沟通效率及问题解决体验相关反馈',
    order: 18,
    status: '启用',
    updatedAt: '2026-08-17 16:15'
  },
  {
    id: 'RT019',
    name: '品牌认知',
    description: '品牌形象、口碑认知及传播内容相关反馈',
    order: 19,
    status: '停用',
    updatedAt: '2026-08-17 15:20'
  },
  {
    id: 'RT020',
    name: '价格权益',
    description: '车辆价格、促销政策、会员及用户权益相关问题',
    order: 20,
    status: '启用',
    updatedAt: '2026-08-17 14:05'
  }
]

export const cloneCategories = () => initialCategories.map(category => ({ ...category }))

export const emptyCategoryFilters = (): CategoryFilters => ({
  keyword: '',
  status: ''
})

export const filterCategories = (categories: RuleCategory[], filters: CategoryFilters) => {
  const keyword = filters.keyword.trim()
  return categories
    .filter(category => {
      if (keyword && !category.name.includes(keyword)) return false
      if (filters.status && category.status !== filters.status) return false
      return true
    })
    .sort((left, right) => left.order - right.order)
}
