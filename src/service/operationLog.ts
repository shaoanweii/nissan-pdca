import request from './request'

/**
 * @description: 获取操作日志列表
 * @param {SysSettings} data
 * @return {*}
 */
export const findOperationLog = (data: OperationLog.QueryReq) => {
  return request<any>({
    url: '/report/operationLog/findOperationLog',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取操作日志列表
 * @param {SysSettings} data
 * @return {*}
 */
export const downLoadOperationLog = (data: any) => {
  return request<any>({
    url: '/report/operationLog/downLoadOperationLog',
    method: 'POST',
    data,
    responseType: 'blob'
  })
}

/**
 * @description: 获取部门
 * @param {Common} data
 * @return {*}
 */
export const findDepartList = () => {
  return request<any>({
    url: '/report/operationLog/findDepartList',
    method: 'POST'
  })
}
