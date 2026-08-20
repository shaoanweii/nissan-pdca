import request from './request'

/**
 * @description: 获取风险预警播报
 * @param {any} data
 * @return {*}
 */
export const getRiskWarningBroadcast = (data: any) => {
  return request<any>({
    url: '/report/riskBroadcast/getRiskWarningBroadcast',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取投诉用户预警播报
 * @param {any} data
 * @return {*}
 */
export const getComplainingUser = (data: any) => {
  return request<any>({
    url: '/report/riskBroadcast/getComplainingUser',
    method: 'POST',
    data
  })
}
/**
 * @description: 获取投诉用户预警播报详情列表
 * @param {any} data
 * @return {*}
 */
export const complaintsDetail = (data: any) => {
  return request<any>({
    url: '/report/riskBroadcast/complaintsDetail',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取下钻问题简报
 * @param {any} data
 * @return {*}
 */
export const warningGetBriefReport = (data: any) => {
  return request<any>({
    url: '/report/riskBroadcast/getBriefReport',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取高频词
 * @param {any} data
 * @return {*}
 */
export const warningGetHighFrequencyWord = (data: any) => {
  return request<any>({
    url: '/report/riskBroadcast/getHighFrequencyWord',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取情感意图趋势
 * @param {any} data
 * @return {*}
 */
export const warningGetEmotionIntentionTrends = (data: any) => {
  return request<any>({
    url: '/report/riskBroadcast/getEmotionIntentionTrends',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取趋势列表
 * @param {any} data
 * @return {*}
 */
export const warningGetTrendList = (data: any) => {
  return request<any>({
    url: '/report/riskBroadcast/getTrendList',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取风险用户声音
 * @param {any} data
 * @return {*}
 */
export const warningGetRiskUserVoice = (data: any) => {
  return request<any>({
    url: '/report/riskBroadcast/getRiskUserVoice',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取用户声音详情
 * @param {any} data
 * @return {*}
 */
export const warningGetUserVoiceDetail = (data: any) => {
  return request<any>({
    url: '/report/riskBroadcast/getUserVoiceDetail',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取风险用户列表
 * @param {any} data
 * @return {*}
 */
export const warningGetRiskUserList = (data: any) => {
  return request<any>({
    url: '/report/riskBroadcast/getRiskUserList',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取数据轨迹渠道下拉选项
 * @param {any} data
 * @return {*}
 */
export const warningGetDataTrailChannel = (data: any) => {
  return request<any>({
    url: '/report/riskBroadcast/getDataTrailChannel',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取数据轨迹
 * @param {any} data
 * @return {*}
 */
export const warningGetDataTrail = (data: any) => {
  return request<any>({
    url: '/report/riskBroadcast/getDataTrail',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取用户详情
 * @param {any} data
 * @return {*}
 */
export const warningGetUserDetail = (data: any) => {
  return request<any>({
    url: '/report/riskBroadcast/getUserDetail',
    method: 'POST',
    data
  })
}
