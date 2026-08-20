<template>
  <div class="page-container">
    <div class="content-header">
      <div class="flex-justify-between align-center">
        <div class="title mr-24">VOC 总览</div>
        <ComQuery
          controller="homePage"
          :displayFields="['time', 'channel', 'query', 'reset']"
          @change="handleQuery"
        ></ComQuery>
      </div>
      <div class="ch-subtitle mt-7">
        <!-- {{ titleDescription.vocView }} -->
        {{ userStore.verbal?.viewSubTitle }}
      </div>
    </div>
    <div class="container">
      <template v-if="isShowPage">
        <div class="color-09121f font-16 fw-600 lh-24 mt-26 mb-20">数据简报</div>
        <DataBriefing :data="presentationData"></DataBriefing>

        <div class="color-09121f font-16 fw-600 lh-24 mt-30 mb-20">体验指数</div>

        <!-- 体验指数 -->
        <a-grid :cols="3" :col-gap="20">
          <a-grid-item>
            <FCard
              titleIcon="account-pin-circle-line"
              :toolTipContent="userStore.verbal?.viewUserExperienceIndex"
              title="用户体验指数"
            >
              <UserIndex class="mt-12" :data="userIndexData"></UserIndex>
            </FCard>
          </a-grid-item>
          <a-grid-item>
            <FCard
              titleIcon="smile"
              :toolTipContent="userStore.verbal?.viewProdExperienceIndex"
              title="产品体验指数"
            >
              <!-- <template #extra>
                <FSelect3
                  v-model="prodTagValue"
                  :multiple="false"
                  :options="prodTagOptions"
                  placeholder="全部分类"
                  :field-names="{ value: 'tagCode', label: 'tagName' }"
                  :subLength="7"
                  class="mr-10"
                  :style="{
                    width: '140px'
                  }"
                  @change="(val: any) => handleTagChangeByTagLabel('PROD', val)"
                />
              </template> -->
              <ProductIndex class="mt-12" :data="productIndexData"></ProductIndex>
            </FCard>
          </a-grid-item>
          <a-grid-item>
            <FCard
              titleIcon="guard"
              :toolTipContent="userStore.verbal?.viewServiceExperienceIndex"
              title="服务体验指数"
            >
              <!-- <template #extra>
                <FSelect3
                  v-model="serviceTagValue"
                  :multiple="false"
                  :options="serviceTagOptions"
                  placeholder="全部分类"
                  :field-names="{ value: 'tagCode', label: 'tagName' }"
                  :subLength="7"
                  class="mr-10"
                  :style="{
                    width: '140px'
                  }"
                  @change="(val: any) => handleTagChangeByTagLabel('SERVICE', val)"
                />
              </template> -->
              <ServiceIndex
                class="mt-12"
                :data="serviceIndexData"
                :mapData="serviceMapData"
              ></ServiceIndex>
            </FCard>
          </a-grid-item>
        </a-grid>

        <div class="color-09121f font-16 fw-600 lh-24 mt-30 mb-20">聚焦关注</div>

        <a-grid :cols="3" :col-gap="20">
          <a-grid-item>
            <FCard
              titleIcon="car-washing-line"
              :toolTipContent="userStore.verbal?.viewProdFocusDistribution"
              title="产品分类分布"
              height="591px"
            >
              <template #extra>
                <FSelect2
                  v-model="foucesRef1Intention"
                  :multiple="false"
                  :options="conditions.intention"
                  :subLength="4"
                  placeholder="全部意图"
                  :field-names="{ value: 'value', label: 'value' }"
                  class="mr-10"
                  :style="{
                    width: '140px'
                  }"
                  @change="(val: any) => focusDistributionByIntention('PRODUCT', val)"
                />
              </template>
              <FocusDistribution
                ref="foucesRef1"
                distributionType="PRODUCT"
                key="PRODUCT"
              ></FocusDistribution>
            </FCard>
          </a-grid-item>
          <a-grid-item>
            <FCard
              titleIcon="customer-service-line"
              :toolTipContent="userStore.verbal?.viewServiceFocusDistribution"
              title="服务分类分布"
              height="591px"
            >
              <template #extra>
                <FSelect2
                  v-model="foucesRef2Intention"
                  :multiple="false"
                  :options="conditions.intention"
                  placeholder="全部意图"
                  :field-names="{ value: 'value', label: 'value' }"
                  :subLength="4"
                  class="mr-10"
                  :style="{
                    width: '140px'
                  }"
                  @change="(val: any) => focusDistributionByIntention('SERVICE', val)"
                />
              </template>
              <FocusDistribution
                ref="foucesRef2"
                distributionType="SERVICE"
                key="SERVICE"
              ></FocusDistribution>
            </FCard>
          </a-grid-item>
          <a-grid-item>
            <FCard
              titleIcon="maintenance-line"
              titleIconColor="#0086D0"
              :toolTipContent="userStore.verbal?.viewQyFocusDistribution"
              title="品质分类分布"
              height="591px"
            >
              <template #extra>
                <FSelect2
                  v-model="foucesRef3Intention"
                  :multiple="false"
                  :options="conditions.intention"
                  placeholder="全部意图"
                  :field-names="{ value: 'value', label: 'value' }"
                  :subLength="4"
                  class="mr-10"
                  :style="{
                    width: '140px'
                  }"
                  @change="(val: any) => focusDistributionByIntention('QUALITY', val)"
                />
              </template>
              <FocusDistribution
                ref="foucesRef3"
                distributionType="QUALITY"
                key="QUALITY"
              ></FocusDistribution>
            </FCard>
          </a-grid-item>
        </a-grid>

        <div class="color-09121f font-16 fw-600 lh-24 mt-30 mb-20">风险预警</div>

        <a-grid :cols="3" :col-gap="20">
          <a-grid-item :span="2">
            <FCard
              titleIcon="dvd-line"
              :toolTipContent="userStore.verbal?.viewRiskEarlyEventWarning"
              title="风险事件预警"
              height="664px"
            >
              <a-grid :cols="3" :col-gap="11">
                <a-grid-item>
                  <RiskEvent
                    :type="1"
                    :data="riskProduct"
                    :permissionCode="permissionDict.prodRisk"
                  ></RiskEvent>
                </a-grid-item>
                <a-grid-item>
                  <RiskEvent
                    :type="2"
                    :data="riskService"
                    :permissionCode="permissionDict.servicesRisk"
                  ></RiskEvent>
                </a-grid-item>
                <a-grid-item>
                  <RiskEvent
                    :type="3"
                    :data="riskQuality"
                    :permissionCode="permissionDict.qualityRisk"
                  ></RiskEvent>
                </a-grid-item>
              </a-grid>
            </FCard>
          </a-grid-item>

          <a-grid-item>
            <FCard
              titleIcon="spam-line"
              :toolTipContent="userStore.verbal?.viewRiskEarlyUserWarning"
              title="风险用户预警"
              height="664px"
            >
              <RiskEvent
                :type="4"
                :data="riskEarlyUserData"
                :permissionCode="permissionDict.highFrequencyComplaintUsers"
              ></RiskEvent>
            </FCard>
          </a-grid-item>
        </a-grid>
      </template>
      <!-- 数据简报下钻 -->
      <DrillDown v-model="drilDownStore.visible"></DrillDown>
      <!-- 风险下钻 -->
      <RiskDD v-model="drilDownStore.riskVisible"></RiskDD>
    </div>
  </div>
</template>
<script lang="ts" setup>
import DataBriefing from './components/DataBriefing/index.vue'
import UserIndex from './components/UserIndex.vue'
import ProductIndex from './components/ProductIndex.vue'
import FocusDistribution from './components/FocusDistribution.vue'
import RiskEvent from './components/RiskEvent/index.vue'
import ServiceIndex from './components/ServiceIndex.vue'
import DrillDown from './components/DrillDown/index.vue'
import RiskDD from './components/DrillDown/RiskDD.vue'
import {
  getDataPresentation,
  getMapDistribution,
  getProductExperienceIndex,
  getRiskEarlyEventWarning,
  getRiskEarlyUserWarning,
  getServiceExperienceIndex,
  getUserExperienceIndex,
  homePageConditions
} from '@/service/vocOverview'
import to from 'await-to-js'
import useDrillDownStore from '@/stores/modules/drillDown'
import useComQueryStore from '@/stores/modules/comQuery'
import eventBus from '@/utils/eventBus'
import useConditions from '@/hooks/useCondition'
import { Message } from '@arco-design/web-vue'
import useUserStore from '@/stores/modules/user'
import { usePageLoading } from '@/hooks/usePageLoading'
import { findTagLabelType } from '@/service/common'
import { permissionDict } from '@/constant/permissionDict'

const { conditions } = useConditions(homePageConditions)

const drilDownStore = useDrillDownStore()
const comQueryStore = useComQueryStore()
const userStore = useUserStore()

const isShowPage = ref(false)

const foucesRef1 = ref()
const foucesRef2 = ref()
const foucesRef3 = ref()

// '全选'
const foucesRef1Intention = ref()
const foucesRef2Intention = ref()
const foucesRef3Intention = ref()

const presentationData = ref({})
const userIndexData = ref([])
const serviceIndexData = ref([])
const productIndexData = ref([])

const riskProduct = ref({})
const riskService = ref({})
const riskQuality = ref({})
const riskEarlyUserData = ref({})
const serviceMapData = ref([])

// const prodTagOptions = ref([])
// const prodTagValue = ref()
// const serviceTagOptions = ref([])
// const serviceTagValue = ref([])

/**
 * @description: 根据标签类型查询分类
 * @param {*} tagType
 * @return {*}
 */
const getTagLabelType = async (tagType: Common.TagType) => {
  const params = {
    clientId: userStore.clientId,
    roleId: userStore.roleId,
    brandCode: comQueryStore.form?.brandCodeList?.[0] || userStore.brands[0]?.value,
    tagLibType: tagType
  }
  const [errs, data] = await to(findTagLabelType(params))
  if (errs) {
    Message.error(errs.message)
  }
  return data?.result || []
}

/**
 * @description: 查询服务体验指数
 * @return {*}
 */
const queryServiceExperienceIndex = async (tagLabelList?: string) => {
  const [siErr, serviceIndex] = await to(
    getServiceExperienceIndex({
      ...comQueryStore.requiredForm,
      ...comQueryStore.formByVocView,
      tagLabelList: tagLabelList ? [[tagLabelList]] : undefined
    })
  )
  if (siErr) {
    Message.error(siErr.message)
  }
  if (serviceIndex) {
    serviceIndexData.value = serviceIndex?.result
  }
}

/**
 * @description: 查询产品体验指数
 * @return {*}
 */
const queryProductExperienceIndex = async (tagLabelList?: string) => {
  const [piErr, productIndex] = await to(
    getProductExperienceIndex({
      ...comQueryStore.requiredForm,
      ...comQueryStore.formByVocView,
      tagLabelList: tagLabelList ? [[tagLabelList]] : undefined
    })
  )
  if (piErr) {
    Message.error(piErr.message)
  }
  if (productIndex) {
    productIndexData.value = productIndex?.result
  }
}

/**
 * @description: 根据标签类型查询对应的数据
 * @param {*} tagType
 * @param {*} val
 * @return {*}
 */
const handleTagChangeByTagLabel = (tagType: Common.TagType, val: any) => {
  let str = val
  if (val) {
    str = ['all', '全部分类'].includes(val) ? undefined : val
  }

  if (tagType === 'PROD') {
    queryProductExperienceIndex(str)
  } else if (tagType === 'SERVICE') {
    queryServiceExperienceIndex(str)
  }
}

const { loadStart, loadDone } = usePageLoading()
const handleQuery = async () => {
  isShowPage.value = true
  loadStart()

  // prodTagOptions.value = await getTagLabelType('PROD')
  // serviceTagOptions.value = await getTagLabelType('SERVICE')
  const [errs, data] = await to(
    getDataPresentation({ ...comQueryStore.requiredForm, ...comQueryStore.formByVocView })
  )
  if (errs) {
    Message.error(errs.message)
    loadDone()
  }
  if (data) {
    presentationData.value = data.result
  }

  const [uiErr, userIndex] = await to(
    getUserExperienceIndex({ ...comQueryStore.requiredForm, ...comQueryStore.formByVocView })
  )
  if (uiErr) {
    Message.error(uiErr.message)
    loadDone()
  }
  if (userIndex) {
    userIndexData.value = userIndex?.result
  }

  queryServiceExperienceIndex()

  queryProductExperienceIndex()

  const [mdErr, mapData] = await to(
    getMapDistribution({ ...comQueryStore.requiredForm, ...comQueryStore.formByVocView })
  )
  if (mdErr) {
    Message.error(mdErr.message)
    loadDone()
  }
  if (mapData?.result) {
    serviceMapData.value = mapData?.result
  }

  foucesRef1.value?.handleQuery(foucesRef1Intention.value)
  foucesRef2.value?.handleQuery(foucesRef2Intention.value)
  foucesRef3.value?.handleQuery(foucesRef3Intention.value)

  const [reeErr, riskEarlyEvent] = await to(
    getRiskEarlyEventWarning({ ...comQueryStore.requiredForm, ...comQueryStore.formByVocView })
  )
  if (reeErr) {
    Message.error(reeErr.message)
    loadDone()
  }
  if (riskEarlyEvent) {
    riskProduct.value = {
      sumc: riskEarlyEvent?.result.productSumC,
      title: riskEarlyEvent?.result.productTitle,
      list: riskEarlyEvent?.result.productRiskEarly
    }

    riskService.value = {
      sumc: riskEarlyEvent?.result.serviceSumC,
      title: riskEarlyEvent?.result.serviceTitle,
      list: riskEarlyEvent?.result.serviceRiskEarly
    }

    riskQuality.value = {
      sumc: riskEarlyEvent?.result.qualitySumC,
      title: riskEarlyEvent?.result.qualityTitle,
      list: riskEarlyEvent?.result.qualityRiskEarly
    }
  }
  const [reuErr, riskEarlyUser] = await to(
    getRiskEarlyUserWarning({ ...comQueryStore.requiredForm, ...comQueryStore.formByVocView })
  )
  if (reuErr) {
    Message.error(reuErr.message)
    loadDone()
  }
  if (riskEarlyUser) {
    riskEarlyUserData.value = {
      sumc: riskEarlyUser?.result?.userSumC,
      title: riskEarlyUser?.result?.userTitle,
      list: riskEarlyUser?.result?.userRiskEarly
    }
  }

  loadDone(true)
}

type FocusType = 'PRODUCT' | 'SERVICE' | 'QUALITY'

const focusDistributionByIntention = (type: FocusType, val: string) => {
  if (type === 'PRODUCT') {
    foucesRef1.value.handleQuery(val)
  } else if (type === 'SERVICE') {
    foucesRef2.value.handleQuery(val)
  } else if (type === 'QUALITY') {
    foucesRef3.value.handleQuery(val)
  }
}

eventBus.on('brandChange', () => {
  handleQuery()
})

onBeforeUnmount(() => {
  eventBus.off('brandChange')
})
</script>
<style lang="scss" scoped></style>
