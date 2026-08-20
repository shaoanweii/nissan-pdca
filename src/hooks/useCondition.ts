import to from 'await-to-js'
import type { Conditions, ConditionsDetailItem } from '@/types'

/**
 * 处理数据字典的数据格式
 * @param options
 */
export default function useConditions(api: (params?: any) => Promise<any>, params?: any) {
  const conditions = reactive<Record<string, ConditionsDetailItem[]>>({})
  const getConditions = async () => {
    const [, data] = await to(api(params ? params : undefined))
    if (data) {
      Object.assign(conditions, handleConditions(data.result || []))
    }
  }
  // 处理字典数据格式
  const handleConditions = (conditions: Conditions[]) => {
    const newConditions: Record<string, ConditionsDetailItem[]> = {}
    conditions?.forEach(el => {
      newConditions[el.key] = el.details
    })
    return newConditions
  }

  onBeforeMount(() => {
    if (!!api) {
      getConditions()
    }
  })

  return {
    conditions
  }
}
