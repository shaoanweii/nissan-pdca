import request from './request'

/**
 * @description: 好评反馈趋势
 * @param {any} data
 * @return {any}
 */
export const findFavorableFeedbackTrend = (data?: any) => {
  return request<any>({
    url: '/report/favorableFeedback/findFavorableFeedbackTrend',
    method: 'POST',
    data
  })
}

/**
 * @description: 好评反馈趋势折线图
 * @param {any} data
 * @return {any}
 */
export const findFavorableFeedbackTrendLine = (data?: any) => {
  return request<any>({
    url: '/report/favorableFeedback/findFavorableFeedbackTrendLine',
    method: 'POST',
    data
  })
}

/**
 * @description: 好评反馈趋势折线图
 * @param {any} data
 * @return {any}
 */
export const findFavorableFeedbackTrendDefaultLine = (data?: any) => {
  return request<any>({
    url: '/report/favorableFeedback/findFavorableFeedbackTrendDefaultLine',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取车系好评反馈占比
 * @param {any} data
 * @return {any}
 */
export const findCarSeriesProportion = (data?: any) => {
  return request<any>({
    url: '/report/favorableFeedback/findCarSeriesProportion',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取区域好评反馈占比
 * @param {any} data
 * @return {any}
 */
export const findRegionProportion = (data?: any) => {
  return request<any>({
    url: '/report/favorableFeedback/findRegionProportion',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取产品-服务好评TOP柱图
 * @param {any} data
 * @return {any}
 */
export const findFavorableTopZhu = (data?: any) => {
  return request<any>({
    url: '/report/favorableFeedback/findFavorableTopZhu',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取产品-服务好评TOP列表
 * @param {any} data
 * @return {any}
 */
export const findFavorableTopList = (data?: any) => {
  return request<any>({
    url: '/report/favorableFeedback/findFavorableTopList',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取用户声音
 * @param {any} data
 * @return {any}
 */
export const getUserVoiceByPraise = (data?: any) => {
  return request<any>({
    url: '/report/favorableFeedback/getUserVoice',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取用户声音详情
 * @param {any} data
 * @return {any}
 */
export const getUserVoiceDetailByPraise = (data?: any) => {
  return request<any>({
    url: '/report/favorableFeedback/getUserVoiceDetail',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取用户列表
 * @param {any} data
 * @return {any}
 */
export const getUserListByPraise = (data?: any) => {
  return request<any>({
    url: '/report/favorableFeedback/getUserList',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取用户详情
 * @param {any} data
 * @return {any}
 */
export const getIndexedPerformanceUserDetailByPraise = (data?: any) => {
  return request<any>({
    url: '/report/favorableFeedback/getIndexedPerformanceUserDetail',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取数据轨迹
 * @param {any} data
 * @return {any}
 */
export const getIndexedPerformanceDataTrailByPraise = (data?: any) => {
  return request<any>({
    url: '/report/favorableFeedback/getIndexedPerformanceDataTrail',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取数据轨迹渠道下拉选项
 * @param {any} data
 * @return {any}
 */
export const getDataTrailChannelByPraise = (data?: any) => {
  return request<any>({
    url: '/report/favorableFeedback/getDataTrailChannel',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取趋势变化(区域)
 * @param {any} data
 * @return {any}
 */
export const getRegionTrendChange = (data?: any) => {
  return request<any>({
    url: '/report/favorableFeedback/getRegionTrendChange',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取观点趋势
 * @param {any} data
 * @return {any}
 */
export const getOpinionTrendByPraise = (data?: any) => {
  return request<any>({
    url: '/report/favorableFeedback/getOpinionTrend',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取观点趋势
 * @param {any} data
 * @return {any}
 */
export const getCarSeriesOpinionTrend = (data?: any) => {
  return request<any>({
    url: '/report/favorableFeedback/getCarSeriesOpinionTrend',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取观点趋势联动折线图
 * @param {any} data
 * @return {any}
 */
export const getLinkageOpinionTrendByPraise = (data?: any) => {
  return request<any>({
    url: '/report/favorableFeedback/getLinkageOpinionTrend',
    method: 'POST',
    data
  })
}
