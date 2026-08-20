import useUserStore from '@/stores/modules/user'
import { isMockEnabled } from '@/service/mock'

/**
 * 根据code判断是否有权限
 * @param btnPermissions
 */
export const hasPermission = (btnPermissions: string) => {
  if (isMockEnabled) return true
  const userStore = useUserStore()
  const userPermission = userStore.buttonPerm as string[]
  if (btnPermissions) {
    return userPermission.includes(btnPermissions)
  }
  return false
}

/**
 * 根据下钻权限 code 判断是否有权限
 * @param drillCode 下钻权限标识
 */
export const hasDrillDownPermission = (drillCode: string): boolean => {
  if (isMockEnabled) return true
  const userStore = useUserStore()
  const drillDowns = userStore.drillDowns as string[]
  if (drillCode) {
    return drillDowns?.includes(drillCode)
  }
  return true
}
