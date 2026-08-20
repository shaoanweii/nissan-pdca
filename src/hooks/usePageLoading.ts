import { useAppStoreWithOut } from '@/stores/modules/app'

export const usePageLoading = (): {
  loadStart: () => void
  loadDone: (isDelayed?: boolean, timer?: number) => void
} => {
  const appStore = useAppStoreWithOut()
  const loadStart = () => {
    appStore.setPageLoading(true)
  }

  const loadDone = (isDelayed = false, timer = 500) => {
    if (isDelayed) {
      setTimeout(() => {
        appStore.setPageLoading(false)
      }, timer)
    } else {
      appStore.setPageLoading(false)
    }
  }

  return {
    loadStart,
    loadDone
  }
}
