import request from './request'

/**
 * @description: 初始化获取品牌及品牌关联数据
 * @return {*}
 */
export const getListByRoleId = (data = {}) => {
  return request<any>({
    url: `/report/role/getListByRoleId`,
    method: 'POST',
    data
  })
}

/**
 * @description: 新增获取初始值
 * @param {any} roleId
 * @return {*}
 */
export const queryMenuPermissionList = (data = {}) => {
  return request<any>({
    url: `/report/role/queryMenuPermissionList`,
    method: 'POST',
    data
  })
}

/**
 * @description: 新增or更新角色
 * @param {any} data
 * @return {*}
 */
export const saveOrUpdateRole = (data: any) => {
  return request<any>({
    url: `/report/role/saveOrUpdateRole`,
    method: 'POST',
    data
  })
}

/**
 * @description: 查询角色列表
 * @param {SysRole} data
 * @return {*}
 */
export const queryList = (data: SysRole.QueryReq) => {
  return request<any>({
    url: `/report/role/list`,
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
    url: '/report/role/conditions',
    method: 'GET'
  })
}
