import request from './request'

/**
 * @description: 获取产品或服务期待分布饼图
 * @param {any} data
 * @return {any}
 */
export const getExpectationDistributionBing = (data?: any) => {
  return request<any>({
    url: '/report/userExpectInsight/getExpectationDistributionBing',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取产品或服务期待分布详情
 * @param {any} data
 * @return {any}
 */
export const getExpectationDistributionDetails = (data?: any) => {
  return request<any>({
    url: '/report/userExpectInsight/getExpectationDistributionDetails',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取本竞品车系同时提及分析
 * @param {any} data
 * @return {any}
 */
export const getCarSeriesMentionedAnalysis = (data?: any) => {
  return request<any>({
    url: '/report/userExpectInsight/getCarSeriesMentionedAnalysis',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取本竞品车系同时提及分析联动
 * @param {any} data
 * @return {any}
 */
export const getLinkedCarSeriesMentionedAnalysis = (data?: any) => {
  return request<any>({
    url: '/report/userExpectInsight/getLinkedCarSeriesMentionedAnalysis',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取用户声音
 * @param {any} data
 * @return {any}
 */
export const insightGetUserVoice = (data?: any) => {
  return request<any>({
    url: '/report/userExpectInsight/getUserVoice',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取用户声音详情
 * @param {any} data
 * @return {any}
 */
export const insightGetUserVoiceDetail = (data?: any) => {
  return request<any>({
    url: '/report/userExpectInsight/getUserVoiceDetail',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取用户列表
 * @param {any} data
 * @return {any}
 */
export const insightGetUserList = (data?: any) => {
  return request<any>({
    url: '/report/userExpectInsight/getUserList',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取用户详情
 * @param {any} data
 * @return {any}
 */
export const insightGetIndexedPerformanceUserDetail = (data?: any) => {
  return request<any>({
    url: '/report/userExpectInsight/getIndexedPerformanceUserDetail',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取数据轨迹
 * @param {any} data
 * @return {any}
 */
export const insightGetIndexedPerformanceDataTrail = (data?: any) => {
  return request<any>({
    url: '/report/userExpectInsight/getIndexedPerformanceDataTrail',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取数据轨迹渠道下拉选项
 * @param {any} data
 * @return {any}
 */
export const insightGetDataTrailChannel = (data?: any) => {
  return request<any>({
    url: '/report/userExpectInsight/getDataTrailChannel',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取观点趋势
 * @param {any} data
 * @return {any}
 */
export const insightGetOpinionTrend = (data?: any) => {
  return request<any>({
    url: '/report/userExpectInsight/getOpinionTrend',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取观点趋势联动折线图
 * @param {any} data
 * @return {any}
 */
export const insightGetLinkageOpinionTrend = (data?: any) => {
  return request<any>({
    url: '/report/userExpectInsight/getLinkageOpinionTrend',
    method: 'POST',
    data
  })
}
