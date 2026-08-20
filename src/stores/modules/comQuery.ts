import { defineStore } from 'pinia'
import store from '..'
import router from '@/router'
import useUserStore from './user'
import { handleTagPath2CheckStrictly } from '@/utils'

interface ComQueryStore {
  form: {
    channel: string | undefined
    channelIds: string | undefined
    clientId: string | undefined
    startDate: string | undefined
    endDate: string | undefined
    datePeriod: string | undefined
    brandCodeList: string[] | undefined
    areaIds: string[] | undefined
    carSeriesList: string[] | undefined
    tagLabelList: string[] | undefined
    riskLevelList: any[] | undefined
  }
  cacheTime: Record<any, any> | null
  brandCode?: string | undefined
  brandName?: string | undefined
  tagOptions?: any[] | null | undefined
}

type FormKeys = keyof ComQueryStore['form']

const useComQueryStore = defineStore('comQuery', {
  state: (): ComQueryStore => ({
    form: {
      clientId: undefined,
      startDate: undefined,
      endDate: undefined,
      datePeriod: undefined,
      channel: undefined,
      channelIds: undefined,
      brandCodeList: undefined,
      areaIds: undefined,
      carSeriesList: undefined,
      tagLabelList: undefined,
      riskLevelList: undefined
    },
    cacheTime: null,
    brandCode: undefined,
    brandName: undefined,
    tagOptions: []
  }),
  getters: {
    requiredForm(): any {
      return {
        clientId: this.form.clientId,
        startDate: this.form.startDate,
        endDate: this.form.endDate,
        datePeriod: this.form.datePeriod,
        brandCodeList: this.form.brandCodeList

        // areaIds: this.form.areaIds,
        // carSeriesList: this.form.carSeriesList,
        // tagLabelList: this.form.tagLabelList,
        // riskLevelList: this.form.riskLevelList
      }
    },
    formByVocView(): any {
      return {
        channelIds: this.form.channelIds
      }
    },
    formByTesting(): any {
      return {
        areaIds: this.form.areaIds,
        channelIds: this.form.channelIds,
        carSeriesList: this.form.carSeriesList
      }
    },
    formByInsights(): any {
      return {
        areaIds: this.form.areaIds,
        channelIds: this.form.channelIds,
        carSeriesList: this.form.carSeriesList
      }
    },
    formByFocus(): any {
      return {
        areaIds: this.form.areaIds,
        channelIds: this.form.channelIds,
        carSeriesList: this.form.carSeriesList,
        tagLabelList: handleTagPath2CheckStrictly(this.form.tagLabelList, this.tagOptions)
      }
    },
    formByWarning(): any {
      return {
        riskLevelList: this.form.riskLevelList
      }
    },
    formByPraise(): any {
      return {
        areaIds: this.form.areaIds,
        channelIds: this.form.channelIds,
        carSeriesList: this.form.carSeriesList
      }
    },
    getDateParam(): any {
      let _dimensionality
      if (this.cacheTime?.dateUnit === 'm') {
        _dimensionality = this.cacheTime?.month
      } else if (this.cacheTime?.dateUnit === 'w') {
        _dimensionality = this.cacheTime?.week
      }
      return {
        year: this.cacheTime?.year || new Date().getFullYear(),
        dimensionality: _dimensionality || -1,
        datePeriod: this.cacheTime?.dateUnit,
        startDate: this.form.startDate,
        endDate: this.form.endDate,
        clientId: this.form.clientId,
        brandCodeList: this.form.brandCodeList
      }
    }
  },
  actions: {
    clearForm(key: FormKeys | FormKeys[]) {
      if (Array.isArray(key)) {
        key.forEach((_key: FormKeys) => {
          this.form[_key] = undefined
        })
      } else {
        this.form[key] = undefined
      }
    },
    setCarSeriesList(seriesName: string) {
      this.form.carSeriesList = seriesName ? [seriesName] : []
    },
    setRiskLevelList(riskLevel: string[]) {
      this.form.riskLevelList = riskLevel
    },
    setAreaIds(areaId: string[]) {
      this.form.areaIds = areaId
    },
    setTagLabelList(tagLabel: any[]) {
      this.form.tagLabelList = tagLabel
    },
    setBrandCodeList(code: string) {
      const userStore = useUserStore()
      // code 这里的code是品牌的中文例如： 日产
      this.form.brandCodeList = code ? [code] : []
      this.brandCode = code
      userStore.getFindThreshold(code)
    },
    // setBrandCode(code: string) {
    //   // code 这里的code是品牌的code例如： 日产
    //   this.brandCode = code
    // },
    setForm(form: any) {
      this.form = Object.assign(this.form, form)
      // this.form = form
      // this.form.clientId = form.clientId
    },
    setCacheTime(time: any) {
      this.cacheTime = time
    },
    setTagOptions(options: any[]) {
      this.tagOptions = options
    },
    linkToExperience(params?: any) {
      // const router = useRouter()
      router.push({
        name: 'experience',
        query: params
      })
    },
    /**
     * @description: 根据路由重置页面查询条件
     * @param {string} toKey
     * @return {*}
     */
    resetConditionByPage(toKey: string) {
      console.log('toKey', toKey)
      // 区域 comQueryStore.form.areaIds
      // 渠道 comQueryStore.form.channelIds
      // 车系 comQueryStore.form.carSeriesList
      // 风险等级 comQueryStore.form.riskLevelList
      // 标签分类 comQueryStore.form.tagLabelList

      if (toKey === 'vocView') {
        this.form.areaIds = undefined
        this.form.carSeriesList = undefined
        this.form.riskLevelList = undefined
        this.form.tagLabelList = undefined
      } else if (toKey === 'experienceTesting') {
        this.form.riskLevelList = undefined
        this.form.tagLabelList = undefined
      } else if (toKey === 'userfFocus') {
      } else if (toKey === 'useriInsights') {
        this.form.riskLevelList = undefined
        this.form.tagLabelList = undefined
      } else if (toKey === 'riskWarning') {
        this.form.areaIds = undefined
        this.form.carSeriesList = undefined
        this.form.channelIds = undefined
        this.form.tagLabelList = undefined
      } else if (toKey === 'userpPraise') {
        this.form.riskLevelList = undefined
        this.form.tagLabelList = undefined
      }
    }
  }
})

export default useComQueryStore

export const useComQueryStoreWithOut = () => {
  return useComQueryStore(store)
}
