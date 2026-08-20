import type { AxiosRequestConfig } from 'axios'
import sylphyImage from '@/assets/svg/car/xuan-yi.svg'
import altimaImage from '@/assets/svg/car/tian-lai.svg'
import xtrailImage from '@/assets/svg/car/qi-jun.svg'
import qashqaiImage from '@/assets/svg/car/xiao-ke.svg'
import pathfinderImage from '@/assets/svg/car/tan-lu.svg'

type MockResponse<T = any> = {
  code: string
  message: string
  result: T
}

export const isMockEnabled = import.meta.env.VITE_USE_MOCK !== 'false'

const ok = <T>(result: T): MockResponse<T> => ({
  code: '200',
  message: '操作成功',
  result
})

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

const dates = ['2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07']
const productTags = ['智能座舱', '驾乘舒适性', '动力响应', '空间布局', '能耗表现']
const serviceTags = ['服务态度', '专业程度', '维修效率', '价格透明', '预约便捷']
const qualityTags = ['车机系统', '制动系统', '内饰工艺', '车身异响', '空调系统']

const conditions = [
  {
    key: 'sentiment',
    details: [
      { key: '全部情感', value: '' },
      { key: '正面', value: 'POSITIVE' },
      { key: '中性', value: 'NEUTRAL' },
      { key: '负面', value: 'NEGATIVE' }
    ]
  },
  {
    key: 'intention',
    details: [
      { key: '全部意图', value: '' },
      { key: '咨询', value: 'CONSULT' },
      { key: '建议', value: 'SUGGESTION' },
      { key: '抱怨', value: 'COMPLAIN' },
      { key: '投诉', value: 'COMPLAINT' },
      { key: '表扬', value: 'PRAISE' }
    ]
  },
  {
    key: 'customerType',
    details: [
      { key: '车主', value: 'OWNER' },
      { key: '潜客', value: 'PROSPECT' }
    ]
  },
  {
    key: 'customerGender',
    details: [
      { key: '男', value: 'M' },
      { key: '女', value: 'F' }
    ]
  },
  {
    key: 'carOwnerAge',
    details: [
      { key: '25岁以下', value: '1' },
      { key: '25-35岁', value: '2' },
      { key: '36-45岁', value: '3' },
      { key: '46岁以上', value: '4' }
    ]
  },
  {
    key: 'carAge',
    details: [
      { key: '1年以内', value: '1' },
      { key: '1-3年', value: '2' },
      { key: '3年以上', value: '3' }
    ]
  },
  {
    key: 'period',
    details: [
      { key: 'd', value: '日' },
      { key: 'w', value: '周' },
      { key: 'm', value: '月' },
      { key: 'q', value: '季' },
      { key: 'y', value: '年' }
    ]
  },
  {
    key: 'status',
    details: [
      { key: '启用', value: '1' },
      { key: '停用', value: '0' }
    ]
  },
  {
    key: 'brand',
    details: [
      { key: '东风日产', value: 'NISSAN' },
      { key: '东风日产启辰', value: 'VENUCIA' }
    ]
  }
]

const regions = [
  {
    id: 'CN-E',
    name: '华东区',
    child: [
      { id: 'SH', name: '上海市' },
      { id: 'JS', name: '江苏省' },
      { id: 'ZJ', name: '浙江省' }
    ]
  },
  {
    id: 'CN-S',
    name: '华南区',
    child: [
      { id: 'GD', name: '广东省' },
      { id: 'GX', name: '广西壮族自治区' },
      { id: 'FJ', name: '福建省' }
    ]
  },
  {
    id: 'CN-N',
    name: '华北区',
    child: [
      { id: 'BJ', name: '北京市' },
      { id: 'TJ', name: '天津市' },
      { id: 'HE', name: '河北省' }
    ]
  }
]

const channels = [
  {
    code: 'HOTLINE',
    name: '400热线',
    child: [
      { code: 'CALL', name: '呼入' },
      { code: 'FOLLOW', name: '回访' }
    ]
  },
  {
    code: 'APP',
    name: '日产智联APP',
    child: [
      { code: 'APP_FEEDBACK', name: '用户反馈' },
      { code: 'APP_COMMUNITY', name: '车友社区' }
    ]
  },
  {
    code: 'DEALER',
    name: '经销商',
    child: [
      { code: 'SALES', name: '销售服务' },
      { code: 'AFTER_SALES', name: '售后服务' }
    ]
  }
]

const carSeries = [
  { code: 'SYLPHY', name: '轩逸', image: sylphyImage },
  { code: 'ALTIMA', name: '天籁', image: altimaImage },
  { code: 'XTRAIL', name: '奇骏', image: xtrailImage },
  { code: 'QASHQAI', name: '逍客', image: qashqaiImage },
  { code: 'PATHFINDER', name: '探陆', image: pathfinderImage }
]

const tagTree = (type = 'PROD') => {
  const names = type === 'SERVICE' ? serviceTags : type === 'QY' ? qualityTags : productTags
  return names.map((name, index) => ({
    tagCode: `${type}-${index + 1}`,
    tagName: name,
    child: [
      { tagCode: `${type}-${index + 1}-1`, tagName: `${name}体验` },
      { tagCode: `${type}-${index + 1}-2`, tagName: `${name}改进建议` }
    ]
  }))
}

const trend = (name = '综合体验') =>
  dates.map((date, index) => ({
    date,
    tagName: name,
    nsrC: 1680 + index * 145,
    nsrG: 76.2 + index * 1.1,
    nsrRp: 4.8 + index * 0.6,
    nsrYp: 0.2 + index * 0.2,
    tagC: 680 + index * 72,
    tagNsrC: 680 + index * 72,
    tagNsrG: 75.6 + index,
    tagNsrR: 4.2 + index * 0.4,
    tagNsrY: 0.3 + index * 0.1,
    tagRp: 5.2 + index * 0.5,
    tagYp: 0.2 + index * 0.2
  }))

const tagStats = (names = productTags) =>
  names.map((tagName, index) => ({
    tagName,
    tagCode: `TAG-${index + 1}`,
    firstCode: `FIRST-${index + 1}`,
    secondCode: `SECOND-${index + 1}`,
    level: (index % 3) + 1,
    tagC: 1280 - index * 137,
    tagP: 29.8 - index * 2.1,
    tagRp: 6.5 - index * 0.5,
    tagYp: 1.2 + index * 0.3,
    nsrC: 1280 - index * 137,
    nsrG: 82.1 - index * 1.4,
    nsrRp: 6.5 - index * 0.5,
    nsrYp: 1.2 + index * 0.3,
    opinionC: 920 - index * 83,
    opinionRP: 7.1 - index * 0.4,
    opinionYP: 1.1 + index * 0.2,
    labelType: 'PROD'
  }))

const users = Array.from({ length: 12 }, (_, index) => ({
  userId: `VOC-U-${String(index + 1).padStart(3, '0')}`,
  username: ['李先生', '王女士', '陈先生', '张女士', '赵先生', '周女士'][index % 6],
  nsrC: 9 + index * 2,
  nsrG: 78.3 + index * 0.7,
  channelC: 2 + (index % 4),
  billC: 3 + index,
  opinionC: 8 + index * 2,
  statementC: 4 + index,
  consultC: 2 + (index % 3),
  suggestionC: 1 + (index % 4),
  complainC: index % 5,
  complaintC: index % 3,
  praiseC: 4 + index
}))

const voices = Array.from({ length: 12 }, (_, index) => ({
  newId: `VOICE-${String(index + 1).padStart(3, '0')}`,
  userId: users[index].userId,
  username: users[index].username,
  channelName: ['日产智联APP', '400热线', '经销商回访'][index % 3],
  channelBiz: ['APP反馈', '售后咨询', '交车回访'][index % 3],
  carSeriesName: carSeries[index % carSeries.length].name,
  provinceName: ['上海市', '广东省', '江苏省', '北京市'][index % 4],
  bizCreateTime: `2026-08-${String(15 - index).padStart(2, '0')} ${String(9 + (index % 8)).padStart(
    2,
    '0'
  )}:20:00`,
  originalTextScene: [
    '新车的座椅包裹性很好，长途驾驶也不容易疲劳。',
    '车机语音识别比之前更快，希望后续增加更多应用。',
    '保养预约很方便，服务顾问提前说明了费用和时间。',
    '高速行驶时车内很安静，动力输出也很平顺。'
  ][index % 4],
  opinion: [productTags[index % 5], serviceTags[index % 5]],
  focus: productTags[index % 5]
}))

const trails = voices.slice(0, 8).map(item => ({
  bizCreateTime: item.bizCreateTime,
  channelBiz: item.channelBiz,
  channelName: item.channelName,
  opinion: item.opinion,
  originalTextScene: item.originalTextScene
}))

const riskDetails = (prefix: string) => [
  {
    riskId: `${prefix}-01`,
    riskLevelS: '高',
    risk: '车机升级后偶发卡顿',
    focusName: '车机系统',
    negativeC: 86,
    userC: 41
  },
  {
    riskId: `${prefix}-02`,
    riskLevelS: '中',
    risk: '售后维修等待时间偏长',
    focusName: '维修效率',
    negativeC: 64,
    userC: 33
  },
  {
    riskId: `${prefix}-03`,
    riskLevelS: '低',
    risk: '低速路段偶发车身异响',
    focusName: '车身异响',
    negativeC: 39,
    userC: 21
  }
]

const riskBroadcast = {
  productSumC: 189,
  productTitle: '产品风险事件',
  productRiskEarly: [
    { levelName: '高风险', levelCode: 'HIGH', nsrC: 36, riskDetail: riskDetails('PROD-H') },
    { levelName: '中风险', levelCode: 'MIDDLE', nsrC: 61, riskDetail: riskDetails('PROD-M') },
    { levelName: '低风险', levelCode: 'LOW', nsrC: 92, riskDetail: riskDetails('PROD-L') }
  ],
  serviceSumC: 143,
  serviceTitle: '服务风险事件',
  serviceRiskEarly: [
    { levelName: '高风险', levelCode: 'HIGH', nsrC: 24, riskDetail: riskDetails('SERV-H') },
    { levelName: '中风险', levelCode: 'MIDDLE', nsrC: 48, riskDetail: riskDetails('SERV-M') },
    { levelName: '低风险', levelCode: 'LOW', nsrC: 71, riskDetail: riskDetails('SERV-L') }
  ],
  qualitySumC: 97,
  qualityTitle: '品质风险事件',
  qualityRiskEarly: [
    { levelName: '高风险', levelCode: 'HIGH', nsrC: 15, riskDetail: riskDetails('QY-H') },
    { levelName: '中风险', levelCode: 'MIDDLE', nsrC: 31, riskDetail: riskDetails('QY-M') },
    { levelName: '低风险', levelCode: 'LOW', nsrC: 51, riskDetail: riskDetails('QY-L') }
  ]
}

const focusDistribution = (title: string, names: string[]) => ({
  title,
  tagSumC: 6328,
  focusDistribution: tagStats(names).slice(0, 4),
  tagDistribution: tagStats(names)
})

const list = <T>(items: T[]) => ({ list: items, total: items.length })

const userDetail = (userId?: string) => ({
  ...(users.find(item => item.userId === userId) || users[0]),
  channelAttention: [
    { tagName: '日产智联APP', tagC: 12 },
    { tagName: '400热线', tagC: 8 },
    { tagName: '经销商', tagC: 5 }
  ]
})

const roleMenu = [
  {
    id: 'M1',
    name: 'VOC总览',
    permissionKey: 'voc',
    checked: true,
    children: [{ id: 'M1-1', name: 'VOC总览', permissionKey: 'vocView', checked: true }]
  },
  {
    id: 'M2',
    name: '体验指数检测',
    permissionKey: 'experience',
    checked: true,
    children: [
      { id: 'M2-1', name: '体验指数检测', permissionKey: 'experienceTesting', checked: true }
    ]
  },
  {
    id: 'M3',
    name: '用户聚焦关注',
    permissionKey: 'userf',
    checked: true,
    children: [{ id: 'M3-1', name: '用户聚焦关注', permissionKey: 'userfFocus', checked: true }]
  },
  {
    id: 'M4',
    name: '用户期待洞察',
    permissionKey: 'useri',
    checked: true,
    children: [{ id: 'M4-1', name: '用户期待洞察', permissionKey: 'useriInsights', checked: true }]
  },
  {
    id: 'M5',
    name: '用户好评反馈',
    permissionKey: 'userp',
    checked: true,
    children: [{ id: 'M5-1', name: '用户好评反馈', permissionKey: 'userpPraise', checked: true }]
  },
  {
    id: 'M6',
    name: '课题事件闭环',
    permissionKey: 'risk',
    checked: true,
    children: [{ id: 'M6-1', name: '课题事件闭环', permissionKey: 'riskWarning', checked: true }]
  },
  {
    id: 'M7',
    name: '报告管理中心',
    permissionKey: 'report',
    checked: true,
    children: [
      { id: 'M7-1', name: '报告管理中心', permissionKey: 'reportManagement', checked: true }
    ]
  },
  {
    id: 'M8',
    name: '系统配置',
    permissionKey: 'settings',
    checked: true,
    children: [
      { id: 'M8-1', name: '系统设置', permissionKey: 'settingsSysSettings', checked: true },
      { id: 'M8-2', name: '操作日志', permissionKey: 'settingsOperationLog', checked: true },
      { id: 'M8-3', name: '账号管理', permissionKey: 'settingsAccount', checked: true },
      { id: 'M8-4', name: '角色管理', permissionKey: 'settingsRole', checked: true }
    ]
  }
]

const roleBrandGroup = (roleName = '数据分析员') => [
  {
    brandCode: 'NISSAN',
    brandName: '东风日产',
    checked: true,
    relationBuTag: tagTree('PROD'),
    serviceTag: tagTree('SERVICE'),
    qualityTag: tagTree('QY'),
    businessTagIds: ['PROD-1', 'PROD-2'],
    serviceTagIds: ['SERVICE-1'],
    qualityTagIds: ['QY-1'],
    dataChannel: channels,
    channelIds: ['HOTLINE', 'APP'],
    relationCar: carSeries,
    seriesIds: ['SYLPHY', 'ALTIMA'],
    area: regions,
    areaIds: ['SH', 'JS', 'GD'],
    appKanban: roleMenu,
    allPermission: true,
    isExport: true,
    isDownload: true,
    roleName,
    remark: '可查看与下钻所有VOC分析模块',
    status: 1,
    roleId: 'ROLE-ANALYST'
  }
]

function resultFor(path: string, config: AxiosRequestConfig): any {
  const body: any = config.data || config.params || {}
  const type = body.labelType || body.tagType || body.labelTypeList?.[0] || 'PROD'

  if (/\/getTime(?:\?|$)/.test(path))
    return [
      {
        timeFilter: '近六个月',
        startDate: '2026-02-01',
        endDate: '2026-07-31',
        dateUnit: 'm',
        month: '2026-07'
      }
    ]

  switch (path) {
    case '/report/userInfo':
      return {
        userId: 'VOC-DEMO-001',
        username: '日产VOC演示用户',
        employeeId: 'DFN-2026001',
        deptName: '客户体验管理部'
      }
    case '/report/userPermissions':
      return {
        clientIds: { details: [{ key: 'nissan-voc-demo-client', value: '东风日产' }] },
        defaultClientId: 'nissan-voc-demo-client',
        isAdmin: true,
        roleId: 'ROLE-ADMIN',
        menus: [],
        button: ['isExport', 'isDownload'],
        drillDowns: [],
        brands: {
          details: [
            { key: '东风日产', value: 'NISSAN', sort: 1 },
            { key: '东风日产启辰', value: 'VENUCIA', sort: 2 }
          ]
        },
        appTags: [
          { key: 'PROD', value: '产品' },
          { key: 'SERVICE', value: '服务' },
          { key: 'QY', value: '品质' }
        ],
        verbal: {},
        isExport: true,
        isDownload: true,
        systemInfoVo: {
          id: 'SYS-001',
          clientId: 'nissan-voc-demo-client',
          systemWatermarking: false,
          documentWatermarking: true,
          defaultPeriod: 'm'
        }
      }
    case '/report/findThreshold':
      return [
        { code: 'EXCELLENT', value: '优秀', startThresholdValue: 85, endThresholdValue: 100 },
        { code: 'GOOD', value: '良好', startThresholdValue: 75, endThresholdValue: 84.99 },
        { code: 'NORMAL', value: '一般', startThresholdValue: 60, endThresholdValue: 74.99 },
        { code: 'IMPROVE', value: '待改进', startThresholdValue: 0, endThresholdValue: 59.99 }
      ]
    case '/report/findRegion':
      return clone(regions)
    case '/report/findChannel':
      return clone(channels)
    case '/report/findCarSeries':
      return clone(carSeries)
    case '/report/findBusinessTag':
      return tagTree('PROD')
    case '/report/findQualityTag':
      return tagTree('QY')
    case '/report/findTagLabelType':
      return tagTree(type)
    case '/report/findDateDimensionality':
      return [
        { name: '日', value: 'd' },
        { name: '周', value: 'w' },
        { name: '月', value: 'm' },
        { name: '季', value: 'q' }
      ]
    case '/report/riskBroadcast/getRiskLevel':
      return [
        { key: '高风险', value: 'HIGH' },
        { key: '中风险', value: 'MIDDLE' },
        { key: '低风险', value: 'LOW' }
      ]

    case '/report/homePage/getDataPresentation':
    case '/report/indexDetection/getIndexDataPresentation':
      return {
        eiNsrC: 28640,
        eiNsrG: 82.6,
        eiNsrRp: 5.8,
        eiNsrYp: 1.4,
        eiTitle: '用户体验综合指数',
        prodNsr: 83.4,
        prodNsrG: 83.4,
        prodNsrRp: 6.2,
        prodTitle: '产品体验指数',
        servNsr: 81.7,
        servNsrG: 81.7,
        servNsrRp: 5.1,
        servTitle: '服务体验指数',
        userNsrC: 12480,
        userNsrRp: 4.6,
        userTitle: '发声用户数',
        serverOrderNsrC: 19632,
        serverOrderNsrRp: 7.3,
        serverOrderTitle: '服务单据数',
        positiveNsrC: 18456,
        positiveNsrRp: 8.2,
        positiveTitle: '正面观点数'
      }
    case '/report/homePage/getUserExperienceIndex':
      return [
        ...tagStats(productTags).map(item => ({ ...item, title: '产品', tagName: item.tagName })),
        ...tagStats(serviceTags).map(item => ({ ...item, title: '服务', tagName: item.tagName }))
      ]
    case '/report/homePage/getProductExperienceIndex':
      return carSeries.map((car, index) => ({
        name: car.name,
        imgUrl: '',
        core: index < 3,
        haltSales: false,
        nsrC: 5680 - index * 410,
        nsrG: 85.1 - index * 1.6,
        nsrRp: 6.3 - index * 0.4,
        nsrYp: 0.8 + index * 0.2
      }))
    case '/report/homePage/getServiceExperienceIndex':
      return ['华东区', '华南区', '华北区', '华中区', '西南区'].map((area, index) => ({
        area,
        nsrC: 4380 - index * 320,
        nsrG: 84.2 - index * 1.3,
        nsrRp: 5.5 - index * 0.4,
        nsrYp: 0.6 + index * 0.2
      }))
    case '/report/homePage/getMapDistribution':
      return [
        { areaCode: '310000', areaName: '上海', nsrC: 3920 },
        { areaCode: '440000', areaName: '广东', nsrC: 3650 },
        { areaCode: '320000', areaName: '江苏', nsrC: 3180 },
        { areaCode: '110000', areaName: '北京', nsrC: 2760 },
        { areaCode: '330000', areaName: '浙江', nsrC: 2480 }
      ]
    case '/report/homePage/getProductFocusAttention':
      return focusDistribution('产品聚焦关注', productTags)
    case '/report/homePage/getServiceFocusAttention':
      return focusDistribution('服务聚焦关注', serviceTags)
    case '/report/homePage/getQualityFocusAttention':
      return focusDistribution('品质聚焦关注', qualityTags)
    case '/report/homePage/getProductFocusAttentionLinkage':
      return tagStats(productTags)
    case '/report/homePage/getServiceFocusAttentionLinkage':
      return tagStats(serviceTags)
    case '/report/homePage/getQualityFocusAttentionLinkage':
      return tagStats(qualityTags)
    case '/report/homePage/getRiskEarlyEventWarning':
    case '/report/riskBroadcast/getRiskWarningBroadcast':
      return riskBroadcast
    case '/report/homePage/getRiskEarlyUserWarning':
      return {
        userSumC: 76,
        userTitle: '高频投诉用户',
        userRiskEarly: [
          { levelName: '高风险', levelCode: 'HIGH', nsrC: 18, riskDetail: riskDetails('USER-H') },
          { levelName: '中风险', levelCode: 'MIDDLE', nsrC: 25, riskDetail: riskDetails('USER-M') },
          { levelName: '低风险', levelCode: 'LOW', nsrC: 33, riskDetail: riskDetails('USER-L') }
        ]
      }

    case '/report/indexDetection/getDefaultIndexedPerformance':
      return trend().map(item => ({
        date: item.date,
        tagTopNsrC: item.nsrC,
        tagTopNsrG: item.nsrG,
        tagFirstNsrR: item.nsrRp,
        tagFirstNsrY: item.nsrYp
      }))
    case '/report/indexDetection/getProductAndServiceIndexedPerformance':
      return [
        ...trend('产品').map(item => ({ ...item, tagName: 'PROD' })),
        ...trend('服务').map(item => ({
          ...item,
          tagName: 'SERVICE',
          tagNsrC: item.tagNsrC - 120,
          tagNsrG: item.tagNsrG - 1.8
        }))
      ]
    case '/report/indexDetection/getIndexedDistribution':
      return {
        userJourney: [
          { code: 'know', name: '品牌认知', nsrC: 3860, nsrG: 80.2, nsrCText: '3,860' },
          { code: 'CarSelection', name: '选车对比', nsrC: 5320, nsrG: 81.6, nsrCText: '5,320' },
          { code: 'BuyCar', name: '购车交付', nsrC: 4280, nsrG: 84.1, nsrCText: '4,280' },
          { code: 'UseCar', name: '用车体验', nsrC: 9640, nsrG: 83.5, nsrCText: '9,640' },
          { code: 'Repurchase', name: '复购推荐', nsrC: 2980, nsrG: 86.3, nsrCText: '2,980' }
        ]
      }
    case '/report/indexDetection/getLinkedIndexedDistribution':
      return {
        indexedPerformance: tagStats(type === 'SERVICE' ? serviceTags : productTags).map(item => ({
          tagFirstName: item.tagName,
          tagFirstNsrC: item.nsrC,
          tagFirstNsrG: item.nsrG,
          tagFirstNsrR: item.nsrRp,
          tagFirstNsrY: item.nsrYp,
          tagFirstNsrCText: String(item.nsrC),
          subordinateTag: tagStats([`${item.tagName}-表现`, `${item.tagName}-体验`])
        }))
      }
    case '/report/indexDetection/getIndexedPerformance':
      return { experienceIndex: tagStats(type === 'SERVICE' ? serviceTags : productTags) }
    case '/report/indexDetection/findGranularityDetail':
      return [
        { name: '综合体验指数', value: 'ALL' },
        { name: '产品体验指数', value: 'PROD' },
        { name: '服务体验指数', value: 'SERVICE' }
      ]
    case '/report/indexDetection/findExponentialConfig':
      return [
        { tagCode: 'PROD-1', tagName: '产品体验', weight: 55, granularity: 'm' },
        { tagCode: 'SERVICE-1', tagName: '服务体验', weight: 45, granularity: 'm' }
      ]

    case '/report/userFocusedAttention/getClassificationProportion':
      return focusDistribution(
        `${type === 'SERVICE' ? '服务' : type === 'QY' ? '品质' : '产品'}分类占比`,
        type === 'SERVICE' ? serviceTags : type === 'QY' ? qualityTags : productTags
      )
    case '/report/userFocusedAttention/getFocusedTop':
      return tagStats(type === 'SERVICE' ? serviceTags : type === 'QY' ? qualityTags : productTags)
    case '/report/userFocusedAttention/getFocusedTopLine':
      return trend(type === 'SERVICE' ? '服务态度' : type === 'QY' ? '车机系统' : '智能座舱')
    case '/report/userFocusedAttention/getEmotionDistribution':
      return (type === 'QY' ? ['高', '较高', '中', '较低', '低'] : ['正面', '中性', '负面']).map(
        (emotionName, index) => ({
          emotionName,
          emotionC: 4520 - index * 780,
          emotionP:
            type === 'QY' ? [31.4, 25.2, 19.1, 14.6, 9.7][index] : [48.2, 31.6, 20.2][index],
          emotionRp: 5.1 - index * 0.7,
          emotionYp: 0.8 + index * 0.5,
          distributionZhu: tagStats(
            type === 'SERVICE' ? serviceTags : type === 'QY' ? qualityTags : productTags
          ).slice(0, 4),
          distributionDetail: tagStats(
            type === 'SERVICE' ? serviceTags : type === 'QY' ? qualityTags : productTags
          )
        })
      )
    case '/report/userFocusedAttention/getEmotionDetail':
      return tagStats(type === 'SERVICE' ? serviceTags : type === 'QY' ? qualityTags : productTags)

    case '/report/userExpectInsight/getExpectationDistributionBing':
      return tagStats(type === 'SERVICE' ? serviceTags : productTags)
    case '/report/userExpectInsight/getExpectationDistributionDetails':
      return tagStats(type === 'SERVICE' ? serviceTags : productTags)
    case '/report/userExpectInsight/getCarSeriesMentionedAnalysis':
      return carSeries.slice(0, 4).map((car, index) => ({
        carSeriesName: car.name,
        carSeriesImage: car.image,
        billC: 4380 - index * 460,
        carSeriesNsrRp: 7.2 - index * 0.5,
        carSeriesNsrYp: 0.8 + index * 0.3,
        mentionCarSeries: carSeries
          .filter(item => item.code !== car.code)
          .slice(0, 3)
          .map((other, otherIndex) => ({
            carSeriesName: other.name,
            carSeriesNsrC: 680 - otherIndex * 120,
            carSeriesNsrCp: 18.5 - otherIndex * 2.3,
            carSeriesNsrRp: 4.8 - otherIndex * 0.5
          })),
        mentionContent: tagStats(productTags)
          .slice(0, 4)
          .map(item => ({ tagName: item.tagName, tagNsrC: item.tagC }))
      }))
    case '/report/userExpectInsight/getLinkedCarSeriesMentionedAnalysis':
      return tagStats(productTags).map(item => ({ tagName: item.tagName, tagNsrC: item.tagC }))

    case '/report/favorableFeedback/findFavorableFeedbackTrend':
      return {
        globalFeedbackC: 18456,
        globalFeedbackRp: 8.2,
        globalFeedbackTitle: '全局好评数',
        prodFeedbackC: 11280,
        prodFeedbackRp: 7.5,
        prodFeedbackTitle: '产品好评数',
        serviceFeedbackC: 7176,
        serviceFeedbackRp: 9.1,
        serviceFeedbackTitle: '服务好评数'
      }
    case '/report/favorableFeedback/findFavorableFeedbackTrendDefaultLine':
      return trend('全局好评').map(item => ({
        date: item.date,
        topicC: item.tagC,
        topicRp: item.tagRp,
        topicYp: item.tagYp
      }))
    case '/report/favorableFeedback/findFavorableFeedbackTrendLine':
      return [
        ...trend('产品好评').map(item => ({
          date: item.date,
          topicC: item.tagC,
          topicRp: item.tagRp,
          topicYp: item.tagYp,
          labelType: 'PROD'
        })),
        ...trend('服务好评').map(item => ({
          date: item.date,
          topicC: item.tagC - 90,
          topicRp: item.tagRp - 0.5,
          topicYp: item.tagYp,
          labelType: 'SERVICE'
        }))
      ]
    case '/report/favorableFeedback/findCarSeriesProportion':
      return tagStats(carSeries.map(item => item.name))
    case '/report/favorableFeedback/findRegionProportion':
      return tagStats(['华东区', '华南区', '华北区', '华中区', '西南区'])
    case '/report/favorableFeedback/findFavorableTopZhu':
    case '/report/favorableFeedback/findFavorableTopList':
      return tagStats(type === 'SERVICE' ? serviceTags : productTags)

    case '/report/riskBroadcast/getComplainingUser':
      return {
        complaintsClassify: [
          {
            labelType: 'PROD',
            title: '产品问题',
            nsrSumC: 186,
            nsrP: 45.4,
            nsrRp: -3.2,
            nsrYp: 1.1
          },
          {
            labelType: 'SERVICE',
            title: '服务问题',
            nsrSumC: 137,
            nsrP: 33.4,
            nsrRp: -1.8,
            nsrYp: 0.6
          },
          { labelType: 'QY', title: '品质问题', nsrSumC: 87, nsrP: 21.2, nsrRp: -2.5, nsrYp: 0.9 }
        ],
        levelDistribution: {
          nsrSumC: 410,
          title: '投诉用户风险等级分布',
          riskDetail: [
            { riskLevelS: '高', riskC: 62, riskP: 15.1, riskRp: 2.3, riskYp: 0.8 },
            { riskLevelS: '中', riskC: 138, riskP: 33.7, riskRp: -1.1, riskYp: 0.5 },
            { riskLevelS: '低', riskC: 210, riskP: 51.2, riskRp: -2.4, riskYp: 1.2 }
          ]
        }
      }
    case '/report/riskBroadcast/complaintsDetail':
      return users.slice(0, 8).map((user, index) => ({
        ...user,
        riskId: `RISK-U-${index + 1}`,
        riskLevelS: ['高', '中', '低'][index % 3],
        risk: user.username,
        riskNsrC: 18 + index * 3,
        negativeC: 11 + index,
        complainC: 5 + (index % 4),
        carSeriesName: carSeries[index % 5].name,
        focusList: [
          { focusName: productTags[index % 5], focusC: 8 + index },
          { focusName: serviceTags[index % 5], focusC: 5 + index }
        ]
      }))
    case '/report/riskBroadcast/getBriefReport':
    case '/report/homePage/getBriefReport':
      return {
        focusNames: '车机系统,维修效率',
        carSeriesName: '轩逸',
        complainC: 28,
        complainRp: 4.3,
        dateUnit: '月',
        datePeriod: '2026-07',
        emotionC: 156,
        emotionRp: -2.1,
        endDate: '2026-07-31',
        negativeC: 96,
        negativeRp: 5.2,
        opinionWord: [
          { name: '车机卡顿', value: 86 },
          { name: '等待时间', value: 64 },
          { name: '异响', value: 39 }
        ],
        riskLeve: '高',
        startDate: '2026-07-01',
        userC: 72,
        userRp: 6.8
      }
    case '/report/riskBroadcast/getHighFrequencyWord':
    case '/report/homePage/getHighFrequencyWord':
      return ['卡顿', '等待', '异响', '响应慢', '收费', '语音识别'].map((word, index) => ({
        word,
        name: word,
        tagName: word,
        riskC: 186 - index * 21,
        tagC: 186 - index * 21,
        value: 186 - index * 21
      }))
    case '/report/riskBroadcast/getEmotionIntentionTrends':
    case '/report/homePage/getEmotionIntentionTrends':
      return dates.map((date, index) => ({
        date,
        negativeC: 216 - index * 11,
        negativeR: -3.2 + index * 0.7,
        negativeY: 0.8 + index * 0.2,
        complainC: 128 - index * 6,
        complainR: -2.1 + index * 0.5,
        complainY: 0.6 + index * 0.2,
        complaintC: 72 - index * 3,
        complaintR: -1.8 + index * 0.4,
        complaintY: 0.4 + index * 0.2
      }))
    case '/report/riskBroadcast/getTrendList':
    case '/report/homePage/getTrendList':
      return {
        riskNum: [
          { riskLevelS: '高', riskC: 62 },
          { riskLevelS: '中', riskC: 138 },
          { riskLevelS: '低', riskC: 210 }
        ],
        riskRecord: dates.flatMap((date, index) =>
          ['高', '中', '低'].map((riskLevelS, level) => ({
            date,
            riskC: 16 + index * 4 + level * 9,
            riskLevelS
          }))
        ),
        riskTrend: dates.flatMap((date, index) =>
          ['高', '中', '低'].map((riskLevelS, level) => ({
            date,
            riskC: 16 + index * 4 + level * 9,
            riskLevelS,
            riskRp: -2.4 + index * 0.6 + level * 0.2
          }))
        )
      }

    case '/report/reportCenter/findReportList':
      return [
        {
          id: 'REP-001',
          reportName: '2026年7月VOC月度洞察报告',
          timeScope: '2026-07-01 ~ 2026-07-31',
          brandCarSeries: '东风日产 / 全车系',
          channel: '全渠道',
          dlrShort: '全区域',
          tag: '产品、服务、品质',
          custType: '全部客户',
          gender: '全部',
          age: '全部',
          vocAge: '全部',
          createTime: '2026-08-01 09:20:00',
          status: '1',
          statusText: '生成完成',
          reportUrl: '/report/mock/nissan-voc-report.csv'
        },
        {
          id: 'REP-002',
          reportName: '轩逸产品体验专项分析',
          timeScope: '2026-04-01 ~ 2026-06-30',
          brandCarSeries: '东风日产 / 轩逸',
          channel: '日产智联APP、400热线',
          dlrShort: '华东区',
          tag: '智能座舱、驾乘舒适性',
          custType: '车主',
          gender: '全部',
          age: '25-45岁',
          vocAge: '1-3年',
          createTime: '2026-07-05 15:36:00',
          status: '1',
          statusText: '生成完成',
          reportUrl: '/report/mock/sylphy-analysis.csv'
        }
      ]
    case '/report/reportCenter/getTagType':
      return [
        { key: '产品', value: 'PROD' },
        { key: '服务', value: 'SERVICE' },
        { key: '品质', value: 'QY' }
      ]
    case '/report/reportCenter/getRegionTree':
      return regions

    case '/report/operationLog/findOperationLog':
      return list(
        Array.from({ length: 12 }, (_, index) => ({
          id: `LOG-${index + 1}`,
          operatorTime: `2026-08-${String(16 - index).padStart(2, '0')} ${String(
            9 + (index % 8)
          ).padStart(2, '0')}:18:30`,
          username: ['王晓明', '李丽', '陈晨'][index % 3],
          logContent: ['查询VOC总览', '导出用户原声', '更新系统配置', '查看风险详情'][index % 4],
          logDesc: '操作成功',
          ip: `10.20.16.${30 + index}`
        }))
      )
    case '/report/operationLog/findDepartList':
    case '/report/accountInfo/findDepartList':
      return [
        { value: 'D001', name: '客户体验管理部' },
        { value: 'D002', name: '市场研究部' },
        { value: 'D003', name: '售后服务部' }
      ]
    case '/report/accountInfo/findAccountInfoList':
      return list([
        {
          userId: 'A001',
          accountName: 'wangxm',
          userName: '王晓明',
          employeeId: 'DFN10086',
          deptName: '客户体验管理部',
          roleName: '系统管理员',
          roleId: 'ROLE-ADMIN',
          status: '1',
          statusName: '启用',
          loginCounts: 126,
          lastLoginTime: '2026-08-16 09:12:21'
        },
        {
          userId: 'A002',
          accountName: 'lili',
          userName: '李丽',
          employeeId: 'DFN10218',
          deptName: '市场研究部',
          roleName: '数据分析员',
          roleId: 'ROLE-ANALYST',
          status: '1',
          statusName: '启用',
          loginCounts: 89,
          lastLoginTime: '2026-08-15 17:42:09'
        },
        {
          userId: 'A003',
          accountName: 'chenchen',
          userName: '陈晨',
          employeeId: 'DFN10562',
          deptName: '售后服务部',
          roleName: '业务查看员',
          roleId: 'ROLE-VIEWER',
          status: '1',
          statusName: '启用',
          loginCounts: 53,
          lastLoginTime: '2026-08-14 13:26:18'
        }
      ])
    case '/report/accountInfo/findAccountInfo':
      return {
        userId: body.userId || 'A001',
        accountName: 'wangxm',
        userName: '王晓明',
        employeeId: 'DFN10086',
        deptName: '客户体验管理部',
        deptId: 'D001',
        email: 'wangxm@example.local',
        expiryDate: '2027-12-31',
        expiryDateBoolean: false,
        officePhone: '020-86868686',
        phone: '13800000001',
        position: 'VOC运营经理',
        roleId: 'ROLE-ADMIN',
        status: '1',
        clientId: 'nissan-voc-demo-client'
      }
    case '/report/accountInfo/queryRoleALlList':
      return [
        { id: 'ROLE-ADMIN', roleName: '系统管理员' },
        { id: 'ROLE-ANALYST', roleName: '数据分析员' },
        { id: 'ROLE-VIEWER', roleName: '业务查看员' }
      ]
    case '/report/role/list':
      return list([
        {
          roleId: 'ROLE-ADMIN',
          roleName: '系统管理员',
          brandName: '东风日产',
          remark: '系统全部权限',
          roleStatusName: '启用',
          status: 1
        },
        {
          roleId: 'ROLE-ANALYST',
          roleName: '数据分析员',
          brandName: '东风日产',
          remark: '看板、下钻与报告权限',
          roleStatusName: '启用',
          status: 1
        },
        {
          roleId: 'ROLE-VIEWER',
          roleName: '业务查看员',
          brandName: '东风日产',
          remark: '看板查看权限',
          roleStatusName: '启用',
          status: 1
        }
      ])
    case '/report/role/queryMenuPermissionList':
      return roleBrandGroup('数据分析员')
    case '/report/role/getListByRoleId':
      return roleBrandGroup('数据分析员')
    case '/report/systemConfig/findSystemConfig':
      return {
        id: 'SYS-001',
        clientId: 'nissan-voc-demo-client',
        systemWatermarking: false,
        documentWatermarking: true,
        defaultPeriod: 'm'
      }

    case '/report/homePage/conditions':
    case '/report/indexDetection/conditions':
    case '/report/reportCenter/conditions':
    case '/report/accountInfo/conditions':
    case '/report/role/conditions':
    case '/report/systemConfig/conditions':
      return conditions
  }

  if (
    path.endsWith('/getUserList') ||
    path.endsWith('/getRiskUserList') ||
    path.endsWith('/getBillList')
  )
    return list(users)
  if (path.endsWith('/getUserDetail') || path.endsWith('/getIndexedPerformanceUserDetail'))
    return userDetail(body.userId)
  if (path.endsWith('/getDataTrail') || path.endsWith('/getIndexedPerformanceDataTrail'))
    return trails
  if (path.endsWith('/getDataTrailChannel'))
    return [
      { tagName: '日产智联APP', tagC: 18, value: 'APP' },
      { tagName: '400热线', tagC: 12, value: 'HOTLINE' },
      { tagName: '经销商', tagC: 9, value: 'DEALER' }
    ]
  if (path.endsWith('/getUserVoice') || path.endsWith('/getRiskUserVoice')) return list(voices)
  if (path.endsWith('/getUserVoiceDetail'))
    return voices.find(item => item.newId === body.newId) || voices[0]
  if (
    path.endsWith('/getOpinionTrend') ||
    path.endsWith('/getLinkageOpinionTrend') ||
    path.endsWith('/getCarSeriesOpinionTrend') ||
    path.endsWith('/getRegionTrendChange')
  )
    return {
      trendZhu: tagStats(type === 'SERVICE' ? serviceTags : productTags),
      trendLine: trend()
    }

  if (/\/(save|update|generate|logout|checkToken|downLoad)/i.test(path)) return true
  if (/\/conditions$/.test(path)) return conditions
  return { status: 'ready', description: '东风日产VOC演示数据已就绪' }
}

export async function resolveMockRequest<T>(
  config: AxiosRequestConfig
): Promise<MockResponse<T> | any | null> {
  if (!isMockEnabled) return null
  const rawUrl = String(config.url || '')
  if (!rawUrl.startsWith('/report/') && !rawUrl.startsWith('/auth/')) return null
  const path = rawUrl.split('?')[0]
  if (config.responseType === 'blob') {
    return {
      status: 200,
      config,
      data: new Blob(['东风日产VOC演示数据'], { type: 'text/plain;charset=utf-8' })
    }
  }
  return ok(resultFor(path, config)) as MockResponse<T>
}
