import request from './request'

/**
 * @description: 新增账号
 * @param {Account.Entity} data
 * @return {*}
 */
export const saveAccountInfo = (data: Account.Entity) => {
  return request<any>({
    url: '/report/accountInfo/saveAccountInfo',
    method: 'POST',
    data
  })
}

/**
 * @description: 更新账号
 * @param {Account.Entity} data
 * @return {*}
 */
export const updateAccountInfo = (data: Account.Entity) => {
  return request<any>({
    url: '/report/accountInfo/updateAccountInfo',
    method: 'POST',
    data
  })
}

/**
 * @description: 分页查询
 * @param {Account.Query} data
 * @return {*}
 */
export const findAccountInfoList = (data: Account.Query) => {
  return request<any>({
    url: '/report/accountInfo/findAccountInfoList',
    method: 'POST',
    data
  })
}

/**
 * @description: 根据id查询账号信息
 * @param {Common.QueryByUserId} data
 * @return {*}
 */
export const findAccountInfo = (data: Common.ComUserId & Common.ComClientId) => {
  return request<any>({
    url: '/report/accountInfo/findAccountInfo',
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
    url: '/report/accountInfo/conditions',
    method: 'GET'
  })
}

/**
 * @description: 查询所有角色
 * @param {Common} data
 * @return {*}
 */
export const queryRoleALlList = (data: Common.ComClientId) => {
  return request<any>({
    url: '/report/accountInfo/queryRoleALlList',
    method: 'POST',
    data
  })
}
/**
 * @description: 获取部门
 * @param {Common} data
 * @return {*}
 */
export const findDepartList = () => {
  return request<any>({
    url: '/report/accountInfo/findDepartList',
    method: 'POST'
  })
}
