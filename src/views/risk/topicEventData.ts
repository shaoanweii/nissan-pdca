export type TopicEventStatus =
  | '声音洞察'
  | '预警审核'
  | '业务响应'
  | '闭环处理'
  | '待确认'
  | '事件关闭'

export interface TopicVoice {
  id: string
  platform: string
  author: string
  title: string
  content: string
  time: string
  sentiment: '正面' | '中性' | '负面'
  tags: string[]
  selected?: boolean
}

export interface TopicEvent {
  id: string
  title: string
  category: string
  priority: '高' | '中' | '低'
  frequency: '实时' | '日' | '周' | '月' | '自定义'
  warningTime: string
  department: string
  owner: string
  source: string
  brand: string
  series: string
  status: TopicEventStatus
  valid: boolean
  evidenceCount: number
  voiceCount: number
  userCount: number
  deadline: string
  viewpoints: string[]
  summary: string
  voices: TopicVoice[]
}

const engineVoices: TopicVoice[] = [
  {
    id: 'V-001',
    platform: '汽车之家',
    author: '张**',
    title: '轩逸高速行驶时出现发动机异响',
    content:
      '我的轩逸跑到60码以上，发动机舱会传来嗡嗡的异响，特别是上坡的时候更明显，去4S店检查说正常，希望厂家重视这个问题。',
    time: '2025-10-07 13:40',
    sentiment: '负面',
    tags: ['轩逸', '发动机异响', '高速行驶', '4S店反馈'],
    selected: true
  },
  {
    id: 'V-002',
    platform: '在线客服',
    author: '王**',
    title: '天籁冷启动噪音偏大',
    content: '天籁冷启动时发动机噪音很大，持续几秒才慢慢变小，希望确认是否属于正常现象。',
    time: '2025-10-07 12:16',
    sentiment: '负面',
    tags: ['天籁', '冷启动', '发动机噪音']
  },
  {
    id: 'V-003',
    platform: 'App',
    author: '李**',
    title: '逍客方向盘轻微抖动',
    content: '逍客在低速行驶时方向盘有轻微抖动，40到60码时比较明显。',
    time: '2025-10-07 09:14',
    sentiment: '中性',
    tags: ['逍客', '方向盘抖动', '低速行驶']
  },
  {
    id: 'V-004',
    platform: '400客服',
    author: '刘**',
    title: '奇骏加速时响应迟缓',
    content: '奇骏在踩油门加速时感觉响应偏慢，超车时需要更深踩油门。',
    time: '2025-10-06 18:32',
    sentiment: '负面',
    tags: ['奇骏', '加速迟缓', '动力响应']
  }
]

export const initialTopicEvents: TopicEvent[] = [
  {
    id: 'KT202510071030001',
    title: '发动机异响课题',
    category: '动力总成',
    priority: '高',
    frequency: '自定义',
    warningTime: '2025-10-07 13:50:15',
    department: '客服中心',
    owner: '杨琳',
    source: '400 / 在线客服 / App',
    brand: '东风日产',
    series: '轩逸、天籁、逍客、奇骏',
    status: '预警审核',
    valid: true,
    evidenceCount: 1456,
    voiceCount: 32900,
    userCount: 14456,
    deadline: '2025-10-09 18:00:00',
    viewpoints: ['发动机异响', '发动机噪音', '冷启动', '方向盘抖动'],
    summary:
      '整体负面声音占比为68.82%，问题主要集中在发动机异响、冷启动噪声与方向盘抖动，轩逸相关声量最高，建议优先核查高速行驶和冷启动场景。',
    voices: engineVoices
  },
  {
    id: 'KT202510071030002',
    title: '变速箱顿挫课题',
    category: '产品设计',
    priority: '高',
    frequency: '日',
    warningTime: '2025-10-07 13:20:10',
    department: '售后服务部',
    owner: '张伟',
    source: '在线客服',
    brand: '东风日产',
    series: '天籁、奇骏',
    status: '业务响应',
    valid: true,
    evidenceCount: 892,
    voiceCount: 18520,
    userCount: 9380,
    deadline: '2025-10-10 18:00:00',
    viewpoints: ['低速顿挫', '换挡延迟', '动力衔接'],
    summary:
      '低速拥堵场景的顿挫反馈连续三日上升，主要集中在天籁与奇骏，需由售后服务部确认处置口径。',
    voices: engineVoices.slice(1)
  },
  {
    id: 'KT202510071030003',
    title: '车机黑屏重启课题',
    category: '智能座舱',
    priority: '中',
    frequency: '周',
    warningTime: '2025-10-07 12:15:23',
    department: '产品企划部',
    owner: '王芳',
    source: 'App',
    brand: '东风日产',
    series: '轩逸、逍客',
    status: '闭环处理',
    valid: true,
    evidenceCount: 643,
    voiceCount: 12380,
    userCount: 6215,
    deadline: '2025-10-12 18:00:00',
    viewpoints: ['车机黑屏', '系统重启', '导航卡顿'],
    summary: '车机黑屏问题集中在系统升级后的首次启动，已进入闭环处理，等待验证修复方案覆盖率。',
    voices: engineVoices.slice(0, 3)
  },
  {
    id: 'KT202510071030004',
    title: '导航定位偏移课题',
    category: '智能座舱',
    priority: '低',
    frequency: '月',
    warningTime: '2025-10-07 11:20:34',
    department: '质量保证部',
    owner: '徐嘉敏',
    source: '在线客服',
    brand: '东风日产',
    series: '奇骏',
    status: '待确认',
    valid: true,
    evidenceCount: 286,
    voiceCount: 5820,
    userCount: 2370,
    deadline: '2025-10-14 18:00:00',
    viewpoints: ['导航偏移', '定位延迟'],
    summary: '导航定位偏移已完成修复验证，当前等待责任部门确认闭环结果。',
    voices: engineVoices.slice(2)
  },
  {
    id: 'KT202510071030005',
    title: '空调制冷效果课题',
    category: '产品质量',
    priority: '中',
    frequency: '日',
    warningTime: '2025-10-07 10:45:12',
    department: '客服中心',
    owner: '赵敏',
    source: '400客服',
    brand: '东风日产',
    series: '轩逸',
    status: '事件关闭',
    valid: true,
    evidenceCount: 321,
    voiceCount: 7420,
    userCount: 3180,
    deadline: '2025-10-06 18:00:00',
    viewpoints: ['制冷慢', '出风温度'],
    summary: '经核查为季节性集中反馈，服务指引已更新并完成效果追踪，课题已关闭。',
    voices: engineVoices.slice(0, 2)
  },
  {
    id: 'KT202510071030006',
    title: '中控异响课题',
    category: '产品质量',
    priority: '高',
    frequency: '日',
    warningTime: '2025-10-07 09:35:29',
    department: '质量保证部',
    owner: '周明',
    source: 'App',
    brand: '东风日产',
    series: '天籁',
    status: '声音洞察',
    valid: false,
    evidenceCount: 168,
    voiceCount: 4260,
    userCount: 2044,
    deadline: '2025-10-08 12:00:00',
    viewpoints: ['中控异响', '颠簸路面'],
    summary: '中控异响声音样本仍在聚合，需补充颠簸路面工况证据后再判断是否触发课题预警。',
    voices: engineVoices.slice(1, 3)
  }
]

export const statusOrder: TopicEventStatus[] = [
  '声音洞察',
  '预警审核',
  '业务响应',
  '闭环处理',
  '待确认',
  '事件关闭'
]
