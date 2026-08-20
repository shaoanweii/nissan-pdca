declare namespace Api {
  namespace Common {
    /**
     * enable status
     *
     * - "1": enabled
     * - "0": disabled
     */
    type EnableStatus = '0' | '1'

    type CommonRecord<T = any> = {
      id?: string
      clientId: string
    } & T
    interface Params {
      id?: string
      clientId: string
      checkAdmin?: boolean
    }
  }

  namespace User {
    interface LoginReq {
      username: string
      password: string
      checkKey: string
      captcha: string
    }
  }

  namespace Role {
    type RoleParams = Common.CommonRecord<{
      enabled: string
      roleName: string
      permissionIdList: string[] | undefined
    }>
    type QueryInfoById = Pick<RoleParams, 'id' | 'clientId'>
    type QueryInfoByIdRecord = RoleParams & {
      roleAuthTreeList: PermissionTree[]
    }
    type ClientId = Pick<RoleParams, 'clientId'>
    type QueryMenu = Partial<ClientId & { selectAll?: boolean }>

    interface PermissionTree {
      code: string | null
      name: string
      // 选中状态
      checked: boolean
      // 当前节点是否是按钮   true 按钮
      checkButton: boolean
      // 半选状态
      indeterminate?: boolean
      // 展开状态
      expand?: boolean
      icon?: string
      path?: string
      pid: string
      id: string
      children?: PermissionTree[] | null
    }
  }

  namespace InsDataSource {
    interface params {
      clientId: string
      dataSourceId: string
      batchId?: string
    }

    interface ExportRawParams extends params {
      //  0 无效数据
      dataValidity?: string
      // -1 失败数据
      status?: string
    }
  }
}
