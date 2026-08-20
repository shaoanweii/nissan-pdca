import router from './router'
import useUserStore from '@/stores/modules/user'
import axios from 'axios'
import { usePageLoading } from './hooks/usePageLoading'
import useComQueryStore from './stores/modules/comQuery'
import { VERSION_KEY } from './constant'
import { isMockEnabled } from './service/mock'

const { loadStart, loadDone } = usePageLoading()

const isRefresh = import.meta.env.VITE_REFRESH === 'true'

router.beforeEach(async (to, from, next) => {
  loadStart()
  // 检查版本更新
  if (from.path !== '/' && isRefresh) {
    checkAppNewVersion()
  }

  const userStore = useUserStore()
  if (isMockEnabled && !userStore.clientId) {
    await userStore.getUserPermissions()
  }
  if (!userStore.menuList.length) {
    userStore.setMenuList([])
  }

  next()
})

router.afterEach(to => {
  useComQueryStore().resetConditionByPage(to.name as string)
  // 设置是否显示品牌
  if (['settingsSysSettings', 'reportManagement'].includes(to.name as string)) {
    useUserStore().setIsHideBrand(false)
  } else {
    useUserStore().setIsHideBrand(true)
  }

  loadDone(true)
})

router.onError((err: any) => {
  console.log('err', err)
})

// 检查服务端是否已经更新，如果更新刷新页面
async function checkAppNewVersion() {
  const url = `/report/version.json?t=${Date.now()}`
  let res = null
  try {
    res = await axios.get(url)
  } catch (err) {
    console.error('checkAppNewVersion error: ', err)
  }
  if (!res) return
  const version = res.data.version
  const localVersion = localStorage.getItem(VERSION_KEY)
  if (localVersion && localVersion !== version) {
    localStorage.setItem(VERSION_KEY, version)
    window.location.reload()
  }
  localStorage.setItem(VERSION_KEY, version)
}

// 监听页面打开显示
document.addEventListener('visibilitychange', function () {
  if (!document.hidden && isRefresh) {
    checkAppNewVersion()
  }
})
