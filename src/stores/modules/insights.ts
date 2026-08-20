import { defineStore } from 'pinia'
// import store from '..'
import { HighFrequencySurgeGroup } from '@/constant'

interface InsightsStore {
  prodOrder: Common.HighFrequencySurgeGroupValue
  serviceOrder: Common.HighFrequencySurgeGroupValue
}

const useInsightsStore = defineStore('insights', {
  state: (): InsightsStore => ({
    prodOrder: HighFrequencySurgeGroup[0].value,
    serviceOrder: HighFrequencySurgeGroup[0].value
  }),
  getters: {},
  actions: {
    setProdOrder(str: Common.HighFrequencySurgeGroupValue) {
      this.prodOrder = str
    },
    setProdOrderDefault() {
      this.prodOrder = HighFrequencySurgeGroup[0].value
    },
    setServiceOrder(str: Common.HighFrequencySurgeGroupValue) {
      this.serviceOrder = str
    },
    setServiceOrderDefault() {
      this.serviceOrder = HighFrequencySurgeGroup[0].value
    }
  }
})

export default useInsightsStore
