import CryptoJS from 'crypto-js'
import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'

export const getAssetsFile = (url: string) => {
  return new URL(`../assets/${url}`, import.meta.url).href
}

/**
 * AES 加密
 * @param value
 */
export const enCrypt = (value: string) => {
  const key = 'Futongdongfang!@'
  const tempKey = CryptoJS.enc.Utf8.parse(key)
  const srcs = CryptoJS.enc.Utf8.parse(value)
  const encrypted = CryptoJS.AES.encrypt(srcs, tempKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

export const extractData = (dataList: any, childKey = 'child') => {
  const newData = cloneDeep(dataList)
  return newData.map((item: any) => {
    const currentItem = { ...item }
    currentItem?.[childKey]?.map((el: any) => {
      el[childKey] = null
      return {
        ...el
      }
    })
    return currentItem
  })
}

/**
 * 生成一个结束时间为今天，开始时间为val前的时间段
 * @param val
 * @param timeType day month year
 * @param format YYYY-MM-DD
 */
export const generateCurDateRange = (
  val: number = 1,
  timeType: any = 'month',
  format: string = 'YYYY-MM-DD'
) => {
  return [dayjs().subtract(val, timeType).format(format), dayjs().format(format)]
}

function isObject(value: any) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * 将对象重置为初始值
 * @param obj
 */
export const resetObjectValues = (obj: { [key: string]: any }) => {
  if (!isObject(obj)) return obj
  Object.keys(obj).forEach(key => {
    const type = typeof obj[key]
    switch (type) {
      case 'object':
        if (Array.isArray(obj[key])) {
          // 如果是数组，则清空数组
          obj[key] = []
        } else if (obj[key] !== null) {
          // 如果是普通对象，则递归调用自身
          resetObjectValues(obj[key])
        }
        break
      case 'string':
        obj[key] = ''
        break
      case 'number':
        obj[key] = 0
        break
      case 'boolean':
        obj[key] = false
        break
      default:
        break
    }
  })
}

/**
 * 根据id过滤树形结构中的自身及子级节点
 * @param tree 树形结构
 * @param targetId 需要过滤的节点
 * @param targetKey 树形结构中与过滤节点的字段
 * @param childKey 子级key
 */
export const excludeNodeById = (
  tree: any,
  targetId: string,
  targetKey = 'id',
  childKey = 'child'
) => {
  const newTree = cloneDeep(tree)
  return newTree.filter((node: any) => {
    if (node[targetKey] !== targetId) {
      if (node[childKey] && node[childKey].length > 0) {
        node[childKey] = excludeNodeById(node[childKey], targetId)
        if (node[childKey].length === 0) {
          delete node[childKey]
        }
      }
      return true
    }
    return false
  })
}

/**
 * 延时器， 手动延时代码执行
 * @param timer
 */
export const delayer = (timer = 0) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(1)
    }, timer)
  })
}

/**
 * @description: 处理字符串超过50个截取并添加省略号
 * @param {string} str
 * @return {*}
 */
export const handleStrBySliceNum = (str: string, sliceNum: number) => {
  if (!str) return
  return str?.toString()?.length > sliceNum ? `${str?.toString()?.slice(0, sliceNum)}...` : str
}
/**
 * @description: 判断传入的数值是否为小数
 * @param {number} num
 * @return {*}
 */
export function isDecimal(num: number) {
  return num % 1 !== 0
}

/**
 * @description: 数字格式化 转 k w 亿
 * @param {any} num
 * @return {*}
 */
export function formatNumber(num: any) {
  if (isDecimal(num)) {
    return ''
  }
  if (Math.abs(num) >= 100000000) {
    return (num / 100000000).toFixed(1) + '亿'
  } else if (Math.abs(num) >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (Math.abs(num) >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

/**
 * @description: 将maxValue转为单位 然后格式话数字
 * @param {any} num
 * @param {any} maxValue
 * @return {*}
 */
export function formatNumberByMaxValue2Unit(num: any, maxValue: any) {
  if (isDecimal(num)) {
    return ''
  }
  if (num === 0) {
    return num
  }
  if (Math.abs(maxValue) >= 100000000) {
    return (num / 100000000).toFixed(1) + '亿'
  } else if (Math.abs(maxValue) >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (Math.abs(maxValue) >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

/**
 * @description: 获取数组中的最大值并且向上取整
 * @param {any} arr
 * @param {*} field
 * @return {*}
 */
export const findValueByArr = (arr: any[], field = 'value') => {
  if (arr?.length === 0) return 0
  const maxValue = arr?.reduce((prev: any, current: any) => {
    return prev.value > current.value ? prev : current
  })?.[field]
  return maxValue
  // if (maxValue > 950) {
  //   return Math.ceil(maxValue / 1000) * 1000
  // }
  // if (maxValue > 9900) {
  //   return Math.ceil(maxValue / 10000) * 10000
  // }
}

/**
 * @description: 将数字或string类型的数字强制保留2位小数
 * @param {any} num
 * @return {*}
 */
export function formatToTwoDecimal(num: any) {
  if (typeof num === 'string') {
    num = parseFloat(num)
    if (isNaN(num)) {
      return num
    }
  }
  if (typeof num !== 'number') {
    return num
  }
  return num.toFixed(2)
}

/**
 * @description: 将二维数组第一项相同的分组
 * @param {any} arr
 * @return {*}
 */
function groupByFirstItem(arr: any) {
  const result: any = {}
  arr.forEach((pair: any) => {
    const firstItem = pair[0]
    if (!result[firstItem]) {
      result[firstItem] = []
    }
    result[firstItem].push(pair)
  })
  return result
}

/**
 * @description: 将分类从cascader的path转为checkStrictly
 * @return {*}
 */
export const handleTagPath2CheckStrictly = (
  values: any,
  tagTree: any,
  fields = { value: 'tagCode', label: 'tagName', children: 'child' }
) => {
  if (!Array.isArray(values)) return []
  const group = groupByFirstItem(values)
  const arr: any = []
  Object.keys(group)?.forEach(el => {
    const curTagGroup =
      tagTree?.find((item: any) => item[fields.value] === el)?.[fields.children]?.length || 0
    if (curTagGroup === group[el]?.length) {
      arr.push([el])
    } else {
      arr.push(...group[el])
    }
  })
  return arr
}
