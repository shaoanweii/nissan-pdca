<template>
  <div class="flex-align-center">
    <!-- 
      content="时间筛选对应同/环比计算说明：<br/>
选择左侧月份时，环比按照月维度进行统计计算，即“（本月数据-上月数据）/上月数据*100%”
选择右侧自定义日期时，环比按照天数进行统计计算，即“（所选天数数据-上期天数数据）/上期天数数据*100%”
同比计算逻辑同理"
:style="{ width: '550px', padding: '8px 12px', backgroundColor: '#000' }"
position="br"
    -->
    <a-tooltip position="tr" content-class="tooltipContent">
      <template #content>
        <div class="w-full radius-4 range-picker-tip">
          <p class="w-full">时间筛选对应同/环比计算说明：</p>
          <p class="w-full">
            1.选择左侧月份时，环比按照月维度统计计算，即“（本月数据-上月数据）/上月数据*100%”
          </p>
          <p class="w-full">
            2.选择右侧自定义日期时，环比按照天数统计计算，即“（所选天数数据-上期天数数据）/上期天数数据*100%”
          </p>
          <p class="w-full">同比计算逻辑同理</p>
        </div>
      </template>

      <SvgIcon name="information-line" width="16px" height="16px" class="mr-8"></SvgIcon>
    </a-tooltip>
    <FRangePicker :controller="controller" @change="timeChange"></FRangePicker>
    <!-- <FDatePicker
      v-if="displayFields.includes('time')"
      ref="fDatePickerRef"
      controller="operationLog"
      @change="timeChange"
    ></FDatePicker> -->

    <FCascader
      v-if="displayFields.includes('region')"
      key="region"
      v-model="comQueryStore.form.areaIds"
      :options="regionOptions"
      :subLength="4"
      placeholder="全部区域"
      :field-names="{ value: 'id', label: 'name', children: 'child' }"
      :style="{
        width: px2rem('190px')
      }"
      class="ml-16 border-def radius-4 bg-white overflow-hidden"
    ></FCascader>

    <FCascader
      v-if="displayFields.includes('channel')"
      key="channel"
      v-model="comQueryStore.form.channelIds"
      :options="channelOptions"
      :subLength="4"
      placeholder="全部渠道"
      :field-names="{ value: 'code', label: 'name', children: 'child' }"
      :style="{
        width: px2rem('190px')
      }"
      class="ml-16 border-def radius-4 bg-white overflow-hidden"
    ></FCascader>

    <FCascader
      v-if="displayFields.includes('tagLabel')"
      key="tagLabel"
      v-model="comQueryStore.form.tagLabelList"
      :options="tagOptions"
      :check-strictly="false"
      :path-mode="true"
      :allowClear="true"
      placeholder="全部分类"
      :subLength="4"
      :field-names="{ value: 'tagCode', label: 'tagName', children: 'child' }"
      class="ml-16 border-def radius-4 bg-white overflow-hidden"
      :style="{
        width: px2rem('190px')
      }"
    ></FCascader>

    <FSelect
      v-if="displayFields.includes('carSeries')"
      key="carSeries"
      v-model="comQueryStore.form.carSeriesList"
      :multiple="true"
      :options="carSeriesOptions"
      placeholder="全部车系"
      :subLength="4"
      :field-names="{ value: 'name', label: 'name' }"
      class="ml-16 overflow-hidden"
      :style="{
        width: px2rem('180px')
      }"
    />

    <FSelect
      v-if="displayFields.includes('riskLevel')"
      key="riskLevel"
      v-model="comQueryStore.form.riskLevelList"
      :multiple="true"
      :options="riskLevelOptions"
      :subLength="4"
      placeholder="全部等级"
      :field-names="{ value: 'key', label: 'value' }"
      class="ml-16 overflow-hidden"
      :style="{
        width: px2rem('160px')
      }"
    />

    <a-button
      v-if="displayFields.includes('query')"
      type="primary"
      class="ml-16 acro-btn-def"
      @click="handleQuery"
      >查询</a-button
    >
    <a-button
      v-if="displayFields.includes('reset')"
      class="ml-16 acro-btn-def-plain"
      @click="handleReset"
    >
      <!-- <template #icon>
        <icon-refresh :size="16" />
      </template> -->
      <!-- <SvgIcon name="refresh" width="16" height="16"></SvgIcon> -->
      重置
    </a-button>
  </div>
</template>

<script lang="ts" setup>
import {
  findCarSeries,
  findChannel,
  findRegion,
  findTagLabelType,
  getRiskLevel
} from '@/service/common'
import { useComQueryStoreWithOut } from '@/stores/modules/comQuery'
import useFocusStore from '@/stores/modules/focus'
import { useUserStoreWithOut } from '@/stores/modules/user'
import eventBus from '@/utils/eventBus'
import { Message } from '@arco-design/web-vue'
import to from 'await-to-js'
import { once } from 'lodash-es'
import { px2rem } from '@/utils/rem'

type fields =
  | 'time'
  | 'region'
  | 'channel'
  | 'carSeries'
  | 'tagLabel'
  | 'query'
  | 'reset'
  | 'riskLevel'
interface Props {
  displayFields: fields[]
  controller: string
}

const {
  displayFields = [
    'time',
    'region',
    'channel',
    'carSeries',
    'tagLabel',
    'query',
    'reset',
    'riskLevel'
  ],
  controller
} = defineProps<Props>()

const emits = defineEmits(['change', 'reset'])
const fDatePickerRef = ref()

const userStore = useUserStoreWithOut()
const comQueryStore = useComQueryStoreWithOut()
const focusStore = useFocusStore()

const onceInit = once(() => {
  emits('change')
})
const timeChange = (val: any) => {
  // console.log('val---timeChange', val)
  comQueryStore.setForm({
    startDate: val.startDate,
    endDate: val.endDate,
    datePeriod: val.dateUnit
  })
  onceInit()
}

const regionOptions = ref<any[]>([])
const channelOptions = ref<any[]>([])
const carSeriesOptions = ref<any[]>([])
const tagOptions = ref<any[]>([])
const riskLevelOptions = ref<any[]>([])

const getRegionOptions = async (params: any) => {
  const [err1s, data1] = await to(findRegion(params))
  if (err1s) {
    Message.error(err1s.message)
  }
  // regionOptions.value = data1?.result || []

  regionOptions.value = (data1?.result || [])?.map((el: any) => {
    if (!el.child || el.child?.length === 0) {
      el.child = null
    }
    return el
  })
}

const getChannelOptions = async (params: any) => {
  const [errs2, data2] = await to(findChannel(params))
  if (errs2) {
    Message.error(errs2.message)
  }
  channelOptions.value = data2?.result || []
}

const getCarSeriesOptions = async (params: any) => {
  const [errs3, data3] = await to(findCarSeries(params))
  if (errs3) {
    Message.error(errs3.message)
  }
  carSeriesOptions.value = data3?.result || []
}

const getRiskLevelOptions = async () => {
  const [errs3, data3] = await to(getRiskLevel())
  if (errs3) {
    Message.error(errs3.message)
  }
  riskLevelOptions.value = data3?.result || []
}

const getCommonConditions = async () => {
  const params = {
    clientId: userStore.clientId,
    roleId: userStore.roleId,
    // brandCode: comQueryStore.form?.brandCodeList?.[0] || userStore.brands[0]?.value
    brandCode: comQueryStore.brandCode || userStore.brands[0]?.value
  }
  if (displayFields.includes('region')) {
    getRegionOptions(params)
  }

  if (displayFields.includes('channel')) {
    getChannelOptions(params)
  }

  if (displayFields.includes('carSeries')) {
    getCarSeriesOptions(params)
  }

  if (displayFields.includes('riskLevel')) {
    getRiskLevelOptions()
  }
}

const getTagLabelType = async () => {
  const params = {
    clientId: userStore.clientId,
    roleId: userStore.roleId,
    brandCode: comQueryStore.form?.brandCodeList?.[0] || userStore.brands[0]?.value,
    tagLibType: focusStore.tagType
  }
  if (displayFields.includes('tagLabel')) {
    const [errs4, data4] = await to(findTagLabelType(params))
    if (errs4) {
      Message.error(errs4.message)
    }
    tagOptions.value = data4?.result || []
    comQueryStore.setTagOptions(data4?.result)
  }
}

const init = async () => {
  await getCommonConditions()
  getTagLabelType()
}

// setTimeout(() => {
//   init()
// })

nextTick(() => {
  init()
})

eventBus.on('brandChange', init)
eventBus.on('tagTypeChange', getTagLabelType)

onBeforeUnmount(() => {
  eventBus.off('brandChange', init)
  eventBus.off('tagTypeChange', getTagLabelType)
})

const handleQuery = () => {
  emits('change')
}

const handleReset = () => {
  fDatePickerRef.value?.resetTime()
  if (displayFields.includes('channel')) {
    comQueryStore.clearForm('channelIds')
  }
  if (displayFields.includes('region')) {
    comQueryStore.clearForm('areaIds')
  }
  if (displayFields.includes('carSeries')) {
    comQueryStore.clearForm('carSeriesList')
  }
  if (displayFields.includes('tagLabel')) {
    comQueryStore.clearForm('tagLabelList')
  }
  if (displayFields.includes('riskLevel')) {
    comQueryStore.clearForm('riskLevelList')
  }

  emits('reset')
  // 重置完成触发查询
  handleQuery()
}
</script>

<style lang="scss" scoped>
.range-picker-tip {
  width: 730px;
  padding: 8px 12px;
  background-color: #000;
}
</style>
