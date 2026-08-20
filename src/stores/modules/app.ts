import { defineStore } from 'pinia'
import store from '..'
import { removeWatermark, setWaterMark } from '@/utils/watermark'
import useUserStore from './user'

interface AppStore {
  showPaginationMinLength: number
  pageLoading: boolean
  sysConfig: SysSettings.Entity
  defSysConfig: SysSettings.Entity
}

const useAppStore = defineStore('app', {
  state: (): AppStore => ({
    // 分页数据大于等于10 展示分页器
    showPaginationMinLength: 10,
    // 全局loading
    pageLoading: false,
    // 系统是否显示水印
    sysConfig: {
      id: '',
      clientId: '',
      systemWatermarking: false,
      documentWatermarking: false,
      defaultPeriod: 'q'
    },
    defSysConfig: {
      id: '',
      clientId: '',
      systemWatermarking: false,
      documentWatermarking: false,
      defaultPeriod: 'q'
    }
  }),
  getters: {},
  actions: {
    setPageLoading(pageLoading: boolean) {
      this.pageLoading = pageLoading
    },
    /**
     * @description: 全局配置
     * @param {SysSettings} sysConfig
     * @return {*}
     */
    setSysConfig(sysConfig: SysSettings.Entity) {
      const userStore = useUserStore()
      this.sysConfig = sysConfig

      if (sysConfig.systemWatermarking) {
        setWaterMark(
          '', // userStore.userInfo.employeeId,
          '', //userStore.userInfo.deptName,
          userStore.userInfo.username,
          ''
        )
      } else {
        removeWatermark()
      }
    },
    /**
     * @description: 缓存一份系统配置用于恢复系统配置
     * @param {SysSettings} sysConfig
     * @return {*}
     */
    setDefSysConfig(sysConfig: SysSettings.Entity) {
      this.defSysConfig = sysConfig
    },
    resetSysConfig() {
      this.setSysConfig(this.defSysConfig)
    }
  }
})

export default useAppStore

export const useAppStoreWithOut = () => {
  return useAppStore(store)
}
