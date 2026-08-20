declare namespace CommonType {
  namespace hooks {
    type PageName = 'founding' | 'processing' | 'discovery' | 'baseSettings'

    type PermKeyItem = { perm: string; key: string }

    interface TPPage {
      defaultActive: string
      permKeyMap: Map<string, PermKeyItem>
    }
  }

  interface ComQueryReq {
    pageNum: number // 页码
    pageSize: number // 每页大小
    clientId: string // 客户id
  }
}

declare namespace Common {
  namespace hooks {
    type PageName = 'founding' | 'processing' | 'discovery' | 'baseSettings'

    type PermKeyItem = { perm: string; key: string }

    interface TPPage {
      defaultActive: string
      permKeyMap: Map<string, PermKeyItem>
    }
  }

  interface ComQueryReq {
    pageNum?: number // 页码
    pageSize?: number // 每页大小
    clientId?: string // 客户id
  }

  interface ComClientId {
    clientId: string
  }

  interface ComUserId {
    userId: string
  }

  interface ComConditionQuery {
    clientId: string
    roleId: string
    brandCode: string
  }

  type TagType = 'PROD' | 'SERVICE' | 'QY'

  type HighFrequencySurgeGroupValue = 'tagC desc' | 'tagRp desc'

  interface FSwitchGroupItem<T = string> {
    label: string
    value: T
  }
}
