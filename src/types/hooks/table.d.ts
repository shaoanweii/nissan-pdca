export interface Options {
  // 查询接口
  queryApi: (params?: any) => Promise<any>
  // 删除接口
  deleteApi?: (params?: any) => Promise<any>
  // 详情接口
  detailApi?: (params?: any) => Promise<any>
  // 在外部处理查询数据接口返回的数据
  dataCallBackByQueryApi?: (params?: any) => any
  filter?: object | undefined
  // 表单重置白名单
  resetKeyWhiteList?: string[]
}

export interface Form<T = DefaultData> {
  visible?: boolean
  operation: 'add' | 'view' | 'edit' | ''
  data: T
}

export interface DefaultData {
  [key: string]: any
}

export interface SelectionItem {
  key: string
  value: string
  code?: string
}

export interface Selection {
  key: string
  details: SelectionItem[]
}

export interface Table<Item = any> {
  filter?: any
  selection?: Selection[]
  loading?: boolean
  list: Item[]
  total: number
  pageNum: number
  pageSize: number
  [key: string]: any
}
