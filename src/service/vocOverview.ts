import request from './request'

/**
 * @description:数据简报
 * @param {any} data
 * @return {any}
 */
export const getDataPresentation = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getDataPresentation',
    method: 'POST',
    data
  })
}

/**
 * @description:获取用户体验指数
 * @param {any} data
 * @return {any}
 */
export const getUserExperienceIndex = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getUserExperienceIndex',
    method: 'POST',
    data
  })
}
/**
 * @description:获取服务体验指数
 * @param {any} data
 * @return {any}
 */
export const getServiceExperienceIndex = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getServiceExperienceIndex',
    method: 'POST',
    data
  })
}
/**
 * @description:获取产品体验指数
 * @param {any} data
 * @return {any}
 */
export const getProductExperienceIndex = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getProductExperienceIndex',
    method: 'POST',
    data
  })
}

/**
 * @description:获取产品焦点分布
 * @param {any} data
 * @return {any}
 */
export const getProductFocusAttention = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getProductFocusAttention',
    method: 'POST',
    data
  })
}

/**
 * @description:获取服务焦点分布
 * @param {any} data
 * @return {any}
 */
export const getServiceFocusAttention = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getServiceFocusAttention',
    method: 'POST',
    data
  })
}

/**
 * @description:获取质量焦点分布
 * @param {any} data
 * @return {any}
 */
export const getQualityFocusAttention = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getQualityFocusAttention',
    method: 'POST',
    data
  })
}

/**
 * @description:获取风险事件预警
 * @param {any} data
 * @return {any}
 */
export const getRiskEarlyEventWarning = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getRiskEarlyEventWarning',
    method: 'POST',
    data
  })
}
/**
 * @description:获取风险用户预警
 * @param {any} data
 * @return {any}
 */
export const getRiskEarlyUserWarning = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getRiskEarlyUserWarning',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取下钻页面用户列表
 * @param {any} data
 * @return {any}
 */
export const getUserList = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getUserList',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取下钻页面用户详情
 * @param {any} data
 * @return {any}
 */
export const getUserDetail = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getUserDetail',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取下钻页面数据轨迹
 * @param {any} data
 * @return {any}
 */
export const getDataTrail = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getDataTrail',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取下钻页面声音列表，单据列表
 * @param {any} data
 * @return {any}
 */
export const getUserVoice = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getUserVoice',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取下钻页面声音列表，单据列表 数据详情
 * @param {any} data
 * @return {any}
 */
export const getUserVoiceDetail = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getUserVoiceDetail',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取下钻页面趋势变化
 * @param {any} data
 * @return {any}
 */
export const getTrendVariation = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getTrendVariation',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取服务焦点关注联动柱状图
 * @param {any} data
 * @return {any}
 */
export const getServiceFocusAttentionLinkage = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getServiceFocusAttentionLinkage',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取质量焦点关注联动柱图
 * @param {any} data
 * @return {any}
 */
export const getQualityFocusAttentionLinkage = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getQualityFocusAttentionLinkage',
    method: 'POST',
    data
  })
}
/**
 * @description: 获取产品焦点关注联动柱状图
 * @param {any} data
 * @return {any}
 */
export const getProductFocusAttentionLinkage = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getProductFocusAttentionLinkage',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取单据列表
 * @param {any} data
 * @return {any}
 */
export const getBillList = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getBillList',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取风险下钻数据简报
 * @param {any} data
 * @return {any}
 */
export const getBriefReport = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getBriefReport',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取风险下钻情感意图趋势
 * @param {any} data
 * @return {any}
 */
export const getEmotionIntentionTrends = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getEmotionIntentionTrends',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取风险下钻高频词
 * @param {any} data
 * @return {any}
 */
export const getHighFrequencyWord = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getHighFrequencyWord',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取风险下钻风险值趋势变化
 * @param {any} data
 * @return {any}
 */
export const getTrendList = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getTrendList',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取风险声音列表
 * @param {any} data
 * @return {any}
 */
export const getRiskUserVoice = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getRiskUserVoice',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取风险用户列表
 * @param {any} data
 * @return {any}
 */
export const getRiskUserList = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getRiskUserList',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取服务体验指数-地图分布
 * @param {any} data
 * @return {any}
 */
export const getMapDistribution = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getMapDistribution',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取下拉选项
 * @param {any} data
 * @return {any}
 */
export const homePageConditions = (data?: any) => {
  return request<any>({
    url: '/report/homePage/conditions',
    method: 'get',
    data
  })
}

/**
 * @description: 获取数据轨迹渠道下拉选项
 * @param {any} data
 * @return {any}
 */
export const getDataTrailChannel = (data?: any) => {
  return request<any>({
    url: '/report/homePage/getDataTrailChannel',
    method: 'POST',
    data
  })
}
