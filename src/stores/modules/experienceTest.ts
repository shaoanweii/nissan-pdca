import { defineStore } from 'pinia'
// import store from '..'

interface ExperienceTestStore {
  indexType: 1 | 2
}

const useExperienceTestStore = defineStore('experienceTest', {
  state: (): ExperienceTestStore => ({
    indexType: 1
  }),
  getters: {},
  actions: {
    setIndexType(type: 1 | 2) {
      this.indexType = type
    }
  }
})

export default useExperienceTestStore

// export const useExperienceTestStoreWithOut = () => {
//   return useExperienceTestStore(store)
// }
