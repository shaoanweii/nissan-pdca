import request from './request'

/**
 * @description: 产品+服务体验指数检测
 * @param {any} data
 * @return {any}
 */
export const getProductAndServiceIndexedPerformance = (data?: any) => {
  return request<any>({
    url: '/report/indexDetection/getProductAndServiceIndexedPerformance',
    method: 'POST',
    data
  })
}
/**
 * @description: 默认体验指数检测
 * @param {any} data
 * @return {any}
 */
export const getDefaultIndexedPerformance = (data?: any) => {
  return request<any>({
    url: '/report/indexDetection/getDefaultIndexedPerformance',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取观点趋势
 * @param {any} data
 * @return {any}
 */
export const getOpinionTrend = (data?: any) => {
  return request<any>({
    url: '/report/indexDetection/getOpinionTrend',
    method: 'POST',
    data
  })
}
/**
 * @description: 获取体验指数
 * @param {any} data
 * @return {any}
 */
export const getIndexedPerformance = (data?: any) => {
  return request<any>({
    url: '/report/indexDetection/getIndexedPerformance',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取体验指数分布
 * @param {any} data
 * @return {any}
 */
export const getIndexedDistribution = (data?: any) => {
  return request<any>({
    url: '/report/indexDetection/getIndexedDistribution',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取指数表现
 * @param {any} data
 * @return {any}
 */
export const getIndexDataPresentation = (data?: any) => {
  return request<any>({
    url: '/report/indexDetection/getIndexDataPresentation',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取用户声音
 * @param {any} data
 * @return {any}
 */
export const indexDetectionGetUserVoice = (data?: any) => {
  return request<any>({
    url: '/report/indexDetection/getUserVoice',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取用户列表
 * @param {any} data
 * @return {any}
 */
export const indexDetectionGetUserList = (data?: any) => {
  return request<any>({
    url: '/report/indexDetection/getUserList',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取用户详情
 * @param {any} data
 * @return {any}
 */
export const getIndexedPerformanceUserDetail = (data?: any) => {
  return request<any>({
    url: '/report/indexDetection/getIndexedPerformanceUserDetail',
    method: 'POST',
    data
  })
}
/**
 * @description: 获取数据轨迹
 * @param {any} data
 * @return {any}
 */
export const getIndexedPerformanceDataTrail = (data?: any) => {
  return request<any>({
    url: '/report/indexDetection/getIndexedPerformanceDataTrail',
    method: 'POST',
    data
  })
}

/**
 * @description: 用户旅途关联一二级
 * @param {any} data
 * @return {any}
 */
export const getLinkedIndexedDistribution = (data?: any) => {
  return request<any>({
    url: '/report/indexDetection/getLinkedIndexedDistribution',
    method: 'POST',
    data
  })
}

/**
 * @description: 一二级关联四级
 * @param {any} data
 * @return {any}
 */
export const getLinkageOpinionTrend = (data?: any) => {
  return request<any>({
    url: '/report/indexDetection/getLinkageOpinionTrend',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取数据轨迹渠道下拉选项
 * @param {any} data
 * @return {any}
 */
export const indexGetDataTrailChannel = (data?: any) => {
  return request<any>({
    url: '/report/indexDetection/getDataTrailChannel',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取用户声音详情
 * @param {any} data
 * @return {any}
 */
export const indexGetUserVoiceDetail = (data?: any) => {
  return request<any>({
    url: '/report/indexDetection/getUserVoiceDetail',
    method: 'POST',
    data
  })
}

/**
 * @description: 保存指数维护
 * @param {any} data
 * @return {any}
 */
export const saveExponentialConfig = (data?: any) => {
  return request<any>({
    url: '/report/indexDetection/saveExponentialConfig',
    method: 'POST',
    data
  })
}

/**
 * @description: 查询指数维护
 * @param {any} data
 * @return {any}
 */
export const findExponentialConfig = (data?: any) => {
  return request<any>({
    url: '/report/indexDetection/findExponentialConfig',
    method: 'POST',
    data
  })
}

/**
 * @description: 查询指标
 * @param {any} data
 * @return {any}
 */
export const findGranularityDetail = (data?: any) => {
  return request<any>({
    url: '/report/indexDetection/findGranularityDetail',
    method: 'POST',
    data
  })
}

/**
 * @description:  获取选项条件
 * @param {any} data
 * @return {any}
 */
export const getConditions = () => {
  return request<any>({
    url: '/report/indexDetection/conditions',
    method: 'get'
  })
}

/**
 * @description:  获取年份
 * @param {any} data
 * @return {any}
 */
export const findDateDimensionality = () => {
  return request<any>({
    url: `/report/findDateDimensionality`,
    method: 'get'
  })
}
