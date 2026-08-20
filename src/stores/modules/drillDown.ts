import { defineStore } from 'pinia'
import store from '..'

type TabType = 1 | 2 | 3 | 4

interface BaseInitData {
  activeTab?: TabType
  [props: string]: any
}
interface RiskInitData extends BaseInitData {
  // user 用户风险   event 事件风险
  riskType?: 'user' | 'event'
}
interface DrillDownStore {
  visible: boolean
  riskVisible: boolean
  indexVisible: boolean
  initData: BaseInitData
  riskInitData: RiskInitData
  indexInitData: RiskInitData
  focusVisible: boolean
  focusInitData: BaseInitData
  insightVisible: boolean
  insightInitData: BaseInitData
  riskWarningVisible: boolean
  riskWarningInitData: BaseInitData
  praiseVisible: boolean
  praiseInitData: BaseInitData
}

const useDrillDownStore = defineStore('drillDown', {
  state: (): DrillDownStore => ({
    visible: false,
    riskVisible: false,
    riskInitData: {
      activeTab: 1
    },
    initData: {
      activeTab: 1
    },
    indexVisible: false,
    indexInitData: {
      activeTab: 1
    },
    focusVisible: false,
    focusInitData: {
      activeTab: 1
    },
    insightVisible: false,
    insightInitData: {
      activeTab: 1
    },
    riskWarningVisible: false,
    riskWarningInitData: {
      activeTab: 1
    },
    praiseVisible: false,
    praiseInitData: {
      activeTab: 1
    }
  }),
  getters: {
    // 从体验指数监测-体验指数分布散点图下钻的四级标签名称
    fourTagName(): any {
      const tagName = this.indexInitData?.data?.[2]
      return tagName ? [tagName] : undefined
    },
    focusEmotionName(): any {
      const emotionName = this.focusInitData.emotionName
      return emotionName ? [emotionName] : undefined
    },
    topicList(): any {
      return this.focusInitData?.tagName ? [this.focusInitData?.tagName] : undefined
    },
    insightTagName(): any {
      return this.insightInitData?.tagName ? [this.insightInitData?.tagName] : undefined
    },
    insightTagType(): any {
      return this.insightInitData?.tagType
    },
    // 体验指数监测页面下钻页需要的tagType
    testingTagType(): any {
      return this.indexInitData?.data?.[6]
    }
  },
  actions: {
    /**
     * @description: 数据总览下钻
     * @param {boolean} visible
     * @param {DrillDownStore} initData
     * @return {*}
     */
    setVisible(visible: boolean, initData: BaseInitData) {
      this.visible = visible
      this.initData = initData
    },
    /**
     * @description: 数据总览风险下钻
     * @param {boolean} visible
     * @param {DrillDownStore} initData
     * @return {*}
     */
    setRiskVisible(visible: boolean, initData: RiskInitData) {
      this.riskVisible = visible
      this.riskInitData = initData
    },
    /**
     * @description: 体验指数下钻
     * @param {boolean} visible
     * @param {DrillDownStore} initData
     * @return {*}
     */
    setIndexVisible(visible: boolean, initData: RiskInitData) {
      this.indexVisible = visible
      this.indexInitData = initData
    },

    /**
     * @description: 用户聚焦关注下钻
     * @param {boolean} visible
     * @param {DrillDownStore} initData
     * @return {*}
     */
    setFocusVisible(visible: boolean, initData: RiskInitData) {
      this.focusVisible = visible
      this.focusInitData = initData
    },
    /**
     * @description: 用户期待洞察下钻
     * @param {boolean} visible
     * @param {DrillDownStore} initData
     * @return {*}
     */
    setInsightVisible(visible: boolean, initData: RiskInitData) {
      this.insightVisible = visible
      this.insightInitData = initData
    },
    /**
     * @description: 风险预警播报下钻
     * @param {boolean} visible
     * @param {DrillDownStore} initData
     * @return {*}
     */
    setRiskWarningVisible(visible: boolean, initData: RiskInitData) {
      this.riskWarningVisible = visible
      this.riskWarningInitData = initData
    },
    /**
     * @description: 用户好评下钻
     * @param {boolean} visible
     * @param {DrillDownStore} initData
     * @return {*}
     */
    setPraiseVisible(visible: boolean, initData: RiskInitData) {
      this.praiseVisible = visible
      this.praiseInitData = initData
    }
  }
})

export default useDrillDownStore

export const useDrillDownStoreWithOut = () => {
  return useDrillDownStore(store)
}
