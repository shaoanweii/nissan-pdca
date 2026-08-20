import request from './request'

/**
 * @description: 更新系统配置
 * @param {SysSettings} data
 * @return {*}
 */
export const updateSystemConfig = (data: SysSettings.Entity) => {
  return request<any>({
    url: '/report/systemConfig/updateSystemConfig',
    method: 'POST',
    data
  })
}

/**
 * @description: 查询系统配置
 * @param {Common} data
 * @return {*}
 */
export const findSystemConfig = (data: Common.ComClientId) => {
  return request<any>({
    url: '/report/systemConfig/findSystemConfig',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取选项条件
 * @return {*}
 */
export const getConditions = () => {
  return request<any>({
    url: '/report/systemConfig/conditions',
    method: 'GET'
  })
}
