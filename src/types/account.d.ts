declare namespace Account {
  interface Entity {
    userId?: string // 部门id
    deptId?: string // 部门id
    roleId?: string // 角色id
    employeeId?: string // 员工编号
    accountName?: string // 账号名称
    accountPwd?: string // 账号密码
    userName?: string // 用户名
    contact?: string // 联系方式
    position?: string // 职位
    email?: string // 邮箱
    remark?: string // 备注
    status?: string // 停用/启用状态
    clientId?: string // 客户id
  }

  interface Query extends Common.QueryInfo {
    deptId?: string // 部门 ID
    roleId?: string // 角色 ID
    userName?: string // 员工编号或姓名
  }

  interface QueryByUserId {
    userId: string
  }
}
