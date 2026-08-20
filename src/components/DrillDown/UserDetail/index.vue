<template>
  <a-drawer
    class="f-drawer user-detail"
    :width="1150"
    :visible="visible"
    :footer="false"
    @open="handleOpen"
    @ok="handleOk"
    @cancel="handleCancel"
    unmountOnClose
  >
    <template #title>
      <span class="fd-title">用户详情</span>
    </template>
    <div class="ud-content">
      <div style="width: 351px" class="">
        <div class="f-card overflow-hidden">
          <div style="height: 90px" class="bgc-def flex-align-center pl-24 border-bottom-def">
            <SvgIcon name="avatar-male" width="44px" height="44px"></SvgIcon>
            <span class="ml-16 font-14">{{ userInfo?.username }}</span>
          </div>
          <div class="pxy-24">
            <NetEmotionalValue
              :emotionalValue="userInfo?.nsrC"
              :g="userInfo?.nsrG"
              class=""
            ></NetEmotionalValue>
            <ChannelSoundNumCard
              class="mt-16"
              :data="userInfo"
              @intentionChange="intentionChange"
            ></ChannelSoundNumCard>
          </div>
        </div>

        <div class="f-card mt-16" style="height: 321px">
          <div class="mt-24 ml-24 font-16 lh-24 color-4b5468">渠道分布</div>
          <FEcharts
            :empty="userInfo?.channelAttention?.length === 0"
            :options="echartOptions3"
            width="100%"
            height="273px"
          ></FEcharts>
        </div>
      </div>
      <!-- 数据轨迹 -->
      <div class="flex-1 ml-24 border-1168ca-01 radius-8 flex-direction-column">
        <div
          class="border-bottom-26292e-015 flex-align-center justify-between px-24 flex-none"
          style="height: 65px"
        >
          <div class="font-16 lh-24 color-4b5468">数据轨迹</div>
          <div>
            <FSelect
              v-model="channelids"
              :multiple="false"
              :options="trailChannel"
              :subLength="10"
              :field-names="{ value: 'channelCode', label: 'channelName' }"
              @change="channelChange"
              :style="{
                width: '161px'
              }"
            />
          </div>
        </div>
        <div class="pxy-24 flex-1-0-auto" style="height: 0; overflow-y: auto">
          <template v-if="trailData?.length">
            <DataTimeLine :data="trailData" :trailChannel="trailChannel"></DataTimeLine>
          </template>
          <template v-else>
            <FEmpty></FEmpty>
          </template>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<script lang="ts" setup>
import NetEmotionalValue from './components/NetEmotionalValue.vue'
import ChannelSoundNumCard from './components/ChannelSoundNumCard.vue'
import DataTimeLine from './components/DataTimeLine.vue'
import useComQueryStore from '@/stores/modules/comQuery'
import to from 'await-to-js'
import { getDataTrail, getDataTrailChannel, getUserDetail } from '@/service/vocOverview'
import { defColorList } from '@/constant'
import { Message } from '@arco-design/web-vue'
import {
  getIndexedPerformanceDataTrail,
  getIndexedPerformanceUserDetail,
  indexGetDataTrailChannel
} from '@/service/experienceTest'
import {
  focusGetDataTrailChannel,
  focusGetIndexedPerformanceDataTrail,
  focusGetIndexedPerformanceUserDetail
} from '@/service/focus'
import {
  insightGetDataTrailChannel,
  insightGetIndexedPerformanceDataTrail,
  insightGetIndexedPerformanceUserDetail
} from '@/service/insights'
import {
  warningGetDataTrail,
  warningGetDataTrailChannel,
  warningGetUserDetail
} from '@/service/riskWarning'
import {
  getDataTrailChannelByPraise,
  getIndexedPerformanceDataTrailByPraise,
  getIndexedPerformanceUserDetailByPraise
} from '@/service/praise'
import { defTooltip, toolTipPosition } from '@/utils/echartsConfig'
import useDrillDownStore from '@/stores/modules/drillDown'
import useFocusStore from '@/stores/modules/focus'
import { usePageLoading } from '@/hooks/usePageLoading'

interface Props {
  record: any
  mapKey: MapKey
}

const { record, mapKey } = defineProps<Props>()

const visible = defineModel({ default: false })

const comQueryStore = useComQueryStore()
const drillDownStore = useDrillDownStore()
const focusStore = useFocusStore()

const userInfo = ref<Record<any, any>>({})
const trailData = ref<Record<any, any>[]>([])
const trailChannel = ref<Record<any, any>[]>([])

const channelids = ref('all')

const baseFormMap = computed(() => {
  const map: Record<MapKey, any> = {
    vocView: { ...comQueryStore.requiredForm, ...comQueryStore.formByVocView },
    vocViewInRisk: { ...comQueryStore.requiredForm, ...comQueryStore.formByVocView, reportType: 1 },
    testing: { ...comQueryStore.requiredForm, ...comQueryStore.formByTesting },
    focus: {
      ...comQueryStore.requiredForm,
      ...comQueryStore.formByFocus,
      ...drillDownStore.focusInitData.labelTypeLevelList
    },
    insights: {
      ...comQueryStore.requiredForm,
      ...comQueryStore.formByInsights,
      labelTypeLevelFirstList: drillDownStore.insightInitData.labelTypeLevelFirstList
    },
    warning: { ...comQueryStore.requiredForm, ...comQueryStore.formByWarning, reportType: 1 },
    praise: {
      ...comQueryStore.requiredForm,
      ...comQueryStore.formByPraise,
      ...drillDownStore.praiseInitData?.labelTypeLevelList
    }
  }
  return map[mapKey]
})

const detailApiMap = computed(() => {
  const apiMap: Record<MapKey, any> = {
    vocView: getUserDetail,
    vocViewInRisk: getUserDetail,
    testing: getIndexedPerformanceUserDetail,
    focus: focusGetIndexedPerformanceUserDetail,
    insights: insightGetIndexedPerformanceUserDetail,
    warning: warningGetUserDetail,
    praise: getIndexedPerformanceUserDetailByPraise
  }

  return apiMap[mapKey]
})

const trailApiMap = computed(() => {
  const apiMap: Record<MapKey, any> = {
    vocView: getDataTrail,
    vocViewInRisk: getDataTrail,
    testing: getIndexedPerformanceDataTrail,
    focus: focusGetIndexedPerformanceDataTrail,
    insights: insightGetIndexedPerformanceDataTrail,
    warning: warningGetDataTrail,
    praise: getIndexedPerformanceDataTrailByPraise
  }
  return apiMap[mapKey]
})

const channelApiMap = computed(() => {
  const apiMap: Record<MapKey, any> = {
    vocView: getDataTrailChannel,
    vocViewInRisk: getDataTrailChannel,
    testing: indexGetDataTrailChannel,
    focus: focusGetDataTrailChannel,
    insights: insightGetDataTrailChannel,
    warning: warningGetDataTrailChannel,
    praise: getDataTrailChannelByPraise
  }

  return apiMap[mapKey]
})

const handleParams = () => {
  if (mapKey === 'vocViewInRisk') {
    baseFormMap.value.riskId = drillDownStore.riskInitData.riskId || undefined
    baseFormMap.value.sentimentList = ['负面']
  }

  if (mapKey === 'testing') {
    baseFormMap.value.labelTypeLevelFourList = drillDownStore.fourTagName
    baseFormMap.value.userJourneyCode = drillDownStore.indexInitData.userJourneyCode
    baseFormMap.value.labelTypeLevelFirstList = drillDownStore.indexInitData.labelTypeLevelFirstList
  }

  if (mapKey === 'focus') {
    baseFormMap.value.tagType = focusStore.tagType || undefined

    baseFormMap.value.topicList = drillDownStore.topicList

    if (['PROD', 'SERVICE'].includes(focusStore.tagType)) {
      baseFormMap.value.faultLevelList = undefined
      baseFormMap.value.sentimentList = drillDownStore.focusEmotionName
    }
    if (['QY'].includes(focusStore.tagType)) {
      baseFormMap.value.sentimentList = undefined
      baseFormMap.value.faultLevelList = drillDownStore.focusEmotionName
    }
  }

  if (mapKey === 'insights') {
    baseFormMap.value.tagType = drillDownStore.insightTagType

    if (drillDownStore.insightInitData.level?.toString() === '2') {
      baseFormMap.value.labelTypeLevelSecondList = drillDownStore.insightTagName
      baseFormMap.value.labelTypeLevelFourList = undefined
    }
    if (drillDownStore.insightInitData.level?.toString() === '4') {
      baseFormMap.value.labelTypeLevelSecondList = undefined
      baseFormMap.value.labelTypeLevelFourList = drillDownStore.insightTagName
    }
    baseFormMap.value.mentionCarSeries = drillDownStore.insightInitData?.mentionCarSeries
    // table.filter.carSeries = drillDownStore.insightInitData?.carSeries
    // baseFormMap.value.carSeriesList = drillDownStore.insightInitData?.carSeriesList
    if (drillDownStore.insightInitData?.carSeriesList) {
      baseFormMap.value.carSeriesList = drillDownStore.insightInitData?.carSeriesList
    }
  }

  if (mapKey === 'warning') {
    baseFormMap.value.riskId = drillDownStore.riskWarningInitData.riskId || undefined
    baseFormMap.value.tagLabelList = drillDownStore.riskWarningInitData.tagLabelList || undefined
    baseFormMap.value.sentimentList = ['负面']
  }

  if (mapKey === 'praise') {
    const { viewType, labelType } = drillDownStore.praiseInitData

    baseFormMap.value.labelTypeList = labelType ? [labelType] : undefined

    if (viewType === 1) {
      baseFormMap.value.bigAreaIds = drillDownStore.praiseInitData?.data?.tagCode || undefined
    } else {
      baseFormMap.value.bigAreaIds = undefined
    }

    if (viewType === 2) {
      baseFormMap.value.carSeries = drillDownStore.praiseInitData?.data?.tagName || undefined
    } else {
      baseFormMap.value.carSeries = undefined
    }

    if ([3, 4].includes(viewType)) {
      baseFormMap.value.topicList = drillDownStore.praiseInitData?.tagName
        ? [drillDownStore.praiseInitData?.tagName]
        : undefined

      baseFormMap.value.tagLabelList = drillDownStore.praiseInitData?.tagLabelList
    } else {
      baseFormMap.value.topicList = undefined
      baseFormMap.value.tagLabelList = undefined
    }
  }
}

const handleOpen = async () => {
  handleParams()
  getTrailChannel()
  // 获取用户详情
  const [errs, userData] = await to(
    detailApiMap.value({
      ...baseFormMap.value,
      // userId: record.userId,
      oneId: record.userId,
      customerName: record.username
    })
  )
  if (errs) {
    Message.error(errs.message)
  }
  if (userData) {
    userInfo.value = (userData as any)?.result
  }
  getTrailDetail()
}

const channelChange = (val: any) => {
  channelids.value = val
  getTrailDetail()
}

const intentionChange = async (intention: string) => {
  getTrailDetail(intention)
}

/**
 * @description: 获取用户轨迹
 * @return {*}
 */
const getTrailDetail = async (intention?: string) => {
  const [errs1, data1] = await to(
    trailApiMap.value({
      ...baseFormMap.value,
      // userId: record.userId,
      oneId: record.userId,
      customerName: record.username,
      channelIds:
        channelids.value === 'all' ? undefined : channelids.value ? [channelids.value] : [],
      intention
    })
  )
  if (errs1) {
    Message.error(errs1.message)
  }
  if (data1) {
    trailData.value = (data1 as any)?.result
  }
}

// 获取用户轨迹下的渠道
const getTrailChannel = async () => {
  const [errs2, data2] = await to(
    channelApiMap.value({
      ...baseFormMap.value,
      // userId: record.userId,
      oneId: record.userId,
      customerName: record.username
    })
  )
  if (errs2) {
    Message.error(errs2.message)
  }
  if (data2) {
    trailChannel.value = (data2 as any)?.result

    if (!trailChannel.value?.length) {
      channelids.value = ''
    }
  }
}

const handleOk = () => {}

const handleCancel = () => {
  visible.value = false
  channelids.value = 'all'
}

const echartOptions3 = computed(() => {
  const _data = userInfo.value?.channelAttention?.map((el: any) => ({
    name: el.tagName,
    value: el.tagC,
    ...el
  }))
  return {
    title: {
      show: false,
      text: '发生分布'
    },
    tooltip: {
      trigger: 'item',
      position: (point: any, params: any, dom: any, rect: any, size: any) => {
        return toolTipPosition(point, params, dom, rect, size)
      },
      formatter: (params: any) => {
        return defTooltip('pie', params)
      },
      padding: 0,
      borderWidth: 0,
      borderColor: 'rgba(0, 0, 0, 0)'
    },
    legend: {
      show: false,
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: 83,
        color: defColorList,
        // radius: '50%',
        // radius: ['50%', '70%'],
        data: _data,
        // [
        //   { value: 1048, name: 'Search Engine' },
        //   { value: 735, name: 'Direct' },
        //   { value: 580, name: 'Email' },
        //   { value: 484, name: 'Union Ads' },
        //   { value: 300, name: 'Video Ads' }
        // ],
        label: {
          show: true,
          // formatter: '{b} : {d}%'
          formatter: '{b} : {d}%'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
})
</script>

<style lang="scss">
.user-detail {
  .arco-drawer-body {
    padding: 14px 24px 24px;
  }
  .ud-content {
    display: flex;
    height: 100%;
  }
}
</style>
