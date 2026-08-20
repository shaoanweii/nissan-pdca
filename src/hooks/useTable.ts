// import request from '../api/index'
import type { Options, Table, Form } from '@/types/hooks/table'
import { Message } from '@arco-design/web-vue'
import type { TableRowSelection, TableSortable } from '@arco-design/web-vue/es/table/interface'
import to from 'await-to-js'
import { cloneDeep } from 'lodash-es'

/**
 *
 * @param option
 * @param dataCallBackByQueryApi 在外部处理查询数据接口返回的数据
 */
export function useTable(option: Options) {
  // 列表数据
  const table = reactive<Table>({
    filter: {},
    selection: [],
    loading: false,
    list: [],
    total: 1,
    pageNum: 1,
    pageSize: 20
  })

  const rowSelection = reactive<TableRowSelection>({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false
  })

  const sortOpts: TableSortable = {
    sortDirections: ['ascend', 'descend'],
    sorter: true
  }

  const form = <Form>reactive({
    visible: false,
    operation: 'add', // edit view
    data: {}
  })

  const handleSortChange = (index: string, direction: string) => {
    if (direction) {
      const sortStr = direction === 'ascend' ? 'asc' : 'desc'
      table.filter['order'] = `${index} ${sortStr}`
    } else {
      delete table.filter['order']
    }
    getList(true)
  }

  const handleAdd = (defaultFormData = {}) => {
    form.data = { ...defaultFormData }
    form.visible = true
    form.operation = 'add'
  }
  const handleEdit = (item: Record<any, any>) => {
    form.data = cloneDeep(item)
    // if (!!option.detailApi) {
    //   const [, data] = to(await option.detailApi())
    // }
    form.visible = true
    form.operation = 'edit'
  }
  const handleView = (item: Record<any, any>) => {
    form.data = cloneDeep(item)
    form.visible = true
    form.operation = 'view'
  }

  const handleDelete = () => {
    // params: object
    // table.loading = true
    // // let params = {id: key}
    // const key = Object.keys(params)
    // const value = Object.values(params)
    // const method = option?.method || 'GET'
    // request<Table>({
    //   url: option?.deleteUrl,
    //   method,
    //   params: method == 'GET' ? params : undefined,
    //   data: method == 'POST' ? params : undefined
    // })
    //   .then(res => {
    //     table.loading = false
    //     Message.success(res.message)
    //     if (res.code === '500' && res.message === '当前规则为启用状态，无法删除') {
    //       return
    //     } else {
    //       table.list = table.list.filter(item => item[key[0]] != value[0])
    //       table.total = table.total - 1
    //     }
    //   })
    //   .catch((err: any) => {
    //     Message.error(err.message)
    //   })
    //   .finally(() => {
    //     table.loading = false
    //   })
  }

  /**
   * @description: 查询table数据
   * @param {boolean} isResetPageNum 是否重置页码
   * @return {*}
   */
  const getList = async (isResetPageNum?: boolean) => {
    table.loading = true

    if (isResetPageNum) {
      table.pageNum = 1
    }
    const _params = {
      ...table.filter,
      pageNum: table.pageNum,
      pageSize: table.pageSize
    }
    const [errs, data] = await to(option.queryApi(_params))
    if (errs) {
      table.list = []
      table.total = 0
      table.loading = false
      Message.error(errs.message)
      return
    }
    const response = data.result
    table.list = response.list
    table.total = response.total
    if (option.dataCallBackByQueryApi) {
      table.list = option.dataCallBackByQueryApi(response)
    }
    table.loading = false
    return response
  }

  // 当前页码改变
  const handleCurrentChange = (page: number) => {
    table.pageNum = page
    getList()
  }
  // 每页数量改变
  const handleSizeChange = (size: number) => {
    table.pageSize = size
    getList(true)
  }

  /**
   * @description: 查询
   * @param {function} beforeQuery 查询前处理函数
   * @return {*}
   */
  const handleQuery = (beforeQuery?: (params?: any) => void) => {
    beforeQuery && typeof beforeQuery === 'function' && beforeQuery(table)
    getList()
  }

  /**
   * @description: 重置
   * @param {function} beforeReset 重置前处理函数
   * @param {*} isResetPageNum 是否重置页码， 默认重置
   * @return {*}
   */
  const handleReset = (beforeReset?: (params?: any) => void, isResetPageNum = true) => {
    if (option?.resetKeyWhiteList && Array.isArray(option.resetKeyWhiteList)) {
      Object.keys(table.filter).forEach(key => {
        if (!option.resetKeyWhiteList?.includes(key)) {
          delete table.filter[key]
        }
      })
    } else {
      table.filter = {}
    }

    beforeReset && typeof beforeReset === 'function' && beforeReset(table)

    // if (isResetPageNum) {
    //   table.pageNum = 1
    // }

    getList(isResetPageNum)
  }

  const pagination = computed(() => {
    return {
      total: table.total,
      current: table.pageNum,
      pageSize: table.pageSize,
      showTotal: true,
      showPageSize: true,
      pageSizeOptions: [10, 15, 20, 25]
    }
  })

  return {
    table,
    form,
    sortOpts,
    rowSelection,
    pagination,
    // getTableData,
    handleSortChange,
    handleAdd,
    handleEdit,
    handleView,
    handleDelete,
    // getFirstPageTableData,
    //
    getList,
    handleQuery,
    handleReset,
    handleSizeChange,
    handleCurrentChange
  }
}
