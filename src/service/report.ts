import request from './request'

/**
 * @description: 生成报告
 * @param {Report.Entity} data
 * @return {*}
 */
export const generateReport = (data: Report.Entity) => {
  return request<any>({
    url: '/report/reportCenter/generateReport',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取报告列表
 * @return {*}
 */
export const findReportList = () => {
  return request<any>({
    url: '/report/reportCenter/findReportList',
    method: 'get'
  })
}

/**
 * @description: 获取配置条件
 * @return {*}
 */
export const getConditions = () => {
  return request<any>({
    url: '/report/reportCenter/conditions',
    method: 'get'
  })
}

/**
 * @description: 获取标签类型
 * @return {*}
 */
export const getTagType = (brandCode: string) => {
  return request<any>({
    url: '/report/reportCenter/getTagType',
    method: 'get',
    params: {
      brandCode
    }
  })
}

/**
 * @description:获取专营店树
 * @param {object} data
 * @return {*}
 */
export const getRegionTree = (data: { brandCode: string; clientId: string }) => {
  return request<any>({
    url: '/report/reportCenter/getRegionTree',
    method: 'post',
    data
  })
}
