import request from './request'

/**
 * 获取用户信息
 */
export const userInfo = () => {
  return request<any>({
    method: 'post',
    url: `/report/userInfo`
  })
}

/**
 * 获取用户权限、全局客户选项，客户默认值等信息
 */
export const userPermissions = () => {
  return request<any>({
    method: 'post',
    url: `/report/userPermissions`
  })
}

/**
 * @description: 根据品牌获取阈值
 * @return {*}
 */
export const findThreshold = (data: any) => {
  return request<any>({
    method: 'post',
    url: `/report/findThreshold`,
    data
  })
}

/**
 * @description: 获取时间范围
 * @param {string} type 日:d 月:m 周：w 季:q 年:y
 * @return {*}
 */
export const getTime = (controller: string, type: string) => {
  return request<any>({
    url: `/report/${controller}/getTime?type=${type}`,
    method: 'GET'
  })
}

// 获取区域：/findRegion
// 获取渠道：/findChannel
// 获取车系：/findCarSeries
// 获取业务标签：/findBusinessTag
// 获取质量标签：//findQualityTag

/**
 * @description: 获取区域
 * @param {Common} data
 * @return {*}
 */
export const findRegion = (data: Common.ComConditionQuery) => {
  return request<any>({
    url: `/report/findRegion`,
    method: 'POST',
    data
  })
}

/**
 * @description: 获取渠道
 * @param {Common} data
 * @return {*}
 */
export const findChannel = (data: Common.ComConditionQuery) => {
  return request<any>({
    url: `/report/findChannel`,
    method: 'POST',
    data
  })
}

/**
 * @description: 获取车系
 * @param {Common} data
 * @return {*}
 */
export const findCarSeries = (data: Common.ComConditionQuery) => {
  return request<any>({
    url: `/report/findCarSeries`,
    method: 'POST',
    data
  })
}

/**
 * @description: 获取业务标签
 * @param {Common} data
 * @return {*}
 */
export const findBusinessTag = (data: Common.ComConditionQuery) => {
  return request<any>({
    url: `/report/findBusinessTag`,
    method: 'POST',
    data
  })
}
/**
 * @description: 获取质量标签
 * @param {Common} data
 * @return {*}
 * {
    "clientId": "764547797eb2e192763f5334028d49c9",
    "roleId":"1846490611230121986",
    "brandCode":"A11"
}
 */
export const findQualityTag = (data: Common.ComConditionQuery) => {
  return request<any>({
    url: `/report/findQualityTag`,
    method: 'POST',
    data
  })
}

export const findTagLabelType = (data: Common.ComConditionQuery) => {
  return request<any>({
    url: `/report/findTagLabelType`,
    method: 'POST',
    data
  })
}

/**
 * @description: 校验token有效性
 * @param {string} token
 * @return {*}
 */
export const checkToken = (data: { tokenKey: string }) => {
  return request<any>({
    url: `/report/dndc/sso/checkToken`,
    method: 'POST',
    data
  })
}

/**
 * @description: 获取风险等级
 * @return {*}
 */
export const getRiskLevel = () => {
  return request<any>({
    url: `/report/riskBroadcast/getRiskLevel`,
    method: 'get'
  })
}

/**
 * @description: 页面功能介绍的pdf下载
 * @return {*}
 */
export const getHandBook = () => {
  return request<any>({
    url: `/report/getHandBook`,
    method: 'get'
  })
}
