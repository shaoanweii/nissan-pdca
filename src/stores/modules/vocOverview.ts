import { defineStore } from 'pinia'
import store from '..'

interface VocOverviewStore {}

const useVocOverviewStore = defineStore('vocOverview', {
  state: (): VocOverviewStore => ({}),
  getters: {},
  actions: {}
})

export default useVocOverviewStore

export const useVocOverviewStoreWithOut = () => {
  return useVocOverviewStore(store)
}
