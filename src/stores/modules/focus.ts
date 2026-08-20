import { defineStore } from 'pinia'
// import store from '..'

interface FocusStore {
  tagType: Common.TagType
}

const useFocusStore = defineStore('focus', {
  state: (): FocusStore => ({
    tagType: 'PROD' // QY PROD
  }),
  getters: {},
  actions: {
    setTagType(type: Common.TagType) {
      this.tagType = type
    }
  }
})

export default useFocusStore

// export const useExperienceTestStoreWithOut = () => {
//   return useExperienceTestStore(store)
// }
