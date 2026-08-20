import request from './request'

/**
 * @description: 获取产品-服务-品质分类占比
 * @param {any} data
 * @return {any}
 */
export const getClassificationProportion = (data?: any) => {
  return request<any>({
    url: '/report/userFocusedAttention/getClassificationProportion',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取产品-服务-品质焦点TOP
 * @param {any} data
 * @return {any}
 */
export const getFocusedTop = (data?: any) => {
  return request<any>({
    url: '/report/userFocusedAttention/getFocusedTop',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取产品-服务-品质焦点TOP折线图
 * @param {any} data
 * @return {any}
 */
export const getFocusedTopLine = (data?: any) => {
  return request<any>({
    url: '/report/userFocusedAttention/getFocusedTopLine',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取情感分布
 * @param {any} data
 * @return {any}
 */
export const getEmotionDistribution = (data?: any) => {
  return request<any>({
    url: '/report/userFocusedAttention/getEmotionDistribution',
    method: 'POST',
    data
  })
}

/**
 * @description: 情感分布详情图
 * @param {any} data
 * @return {any}
 */
export const getEmotionDetail = (data?: any) => {
  return request<any>({
    url: '/report/userFocusedAttention/getEmotionDetail',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取数据轨迹渠道下拉选项
 * @param {any} data
 * @return {any}
 */
export const focusGetDataTrailChannel = (data?: any) => {
  return request<any>({
    url: '/report/userFocusedAttention/getDataTrailChannel',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取数据轨迹
 * @param {any} data
 * @return {any}
 */
export const focusGetIndexedPerformanceDataTrail = (data?: any) => {
  return request<any>({
    url: '/report/userFocusedAttention/getIndexedPerformanceDataTrail',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取用户详情
 * @param {any} data
 * @return {any}
 */
export const focusGetIndexedPerformanceUserDetail = (data?: any) => {
  return request<any>({
    url: '/report/userFocusedAttention/getIndexedPerformanceUserDetail',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取用户列表
 * @param {any} data
 * @return {any}
 */
export const focusGetUserList = (data?: any) => {
  return request<any>({
    url: '/report/userFocusedAttention/getUserList',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取用户声音
 * @param {any} data
 * @return {any}
 */
export const focusGetUserVoice = (data?: any) => {
  return request<any>({
    url: '/report/userFocusedAttention/getUserVoice',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取用户声音详情
 * @param {any} data
 * @return {any}
 */
export const focusGetUserVoiceDetail = (data?: any) => {
  return request<any>({
    url: '/report/userFocusedAttention/getUserVoiceDetail',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取观点趋势
 * @param {any} data
 * @return {any}
 */
export const focusGetOpinionTrend = (data?: any) => {
  return request<any>({
    url: '/report/userFocusedAttention/getOpinionTrend',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取观点趋势联动折线图
 * @param {any} data
 * @return {any}
 */
export const focusGetLinkageOpinionTrend = (data?: any) => {
  return request<any>({
    url: '/report/userFocusedAttention/getLinkageOpinionTrend',
    method: 'POST',
    data
  })
}
