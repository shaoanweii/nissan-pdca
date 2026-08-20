<template>
  <a-range-picker
    v-model="timer"
    class="border-def radius-4 bg-white"
    :style="{ width: px2rem('260px') }"
    shortcuts-position="left"
    :shortcuts="rangeShortcuts"
    :disabledDate="disabledDate"
    :allow-clear="false"
    :trigger-props="{
      contentClass: 'frangePicker'
    }"
    @select-shortcut="onSelectShortcut"
    @change="onChange"
    @select="onRangePickerSelect"
  />
</template>

<script lang="ts" setup>
import { getTime } from '@/service/common'
import useComQueryStore from '@/stores/modules/comQuery'
import { Message } from '@arco-design/web-vue'
import to from 'await-to-js'
import dayjs from 'dayjs'
import { px2rem } from '@/utils/rem'

const { controller, isCacheTime = true } = defineProps<{
  controller: string
  isCacheTime?: boolean
}>()

const emits = defineEmits(['change'])
const comQueryStore = useComQueryStore()

// const testTime = [
//   {
//     label: 'next 2 days',
//     value: () => [dayjs(), dayjs().add(2, 'day')]
//   },
//   {
//     label: 'next 7 days',
//     value: () => [dayjs(), dayjs().add(1, 'month')]
//   },
//   {
//     label: 'next 30 days',
//     value: () => [dayjs(), dayjs().add(1, 'month')]
//   },
//   {
//     label: 'next 6 months',
//     value: () => [dayjs(), dayjs().add(6, 'month')]
//   },
//   {
//     label: 'next 12 months',
//     value: () => [dayjs(), dayjs().add(1, 'year')]
//   },
//   {
//     label: 'next 10 years',
//     value: () => [dayjs(), dayjs().add(10, 'year')]
//   }
// ]

const timer = ref<any>([])
const timerObj = ref<any>({
  dateUnit: 'm',
  endDate: '',
  startDate: ''
})

const selectedTime = ref()

const rangeShortcuts = ref<any>()
/**
 * @description: 根据时间维度获取数据时间
 * @return {*}
 */
const getTimeList = async (dateUnit = 'm') => {
  const [errs, data] = await to(getTime(controller, dateUnit))
  if (errs) {
    Message.error(errs.message)
  }
  if (data) {
    rangeShortcuts.value =
      data?.result?.map((item: any) => ({
        ...item,
        label: item.timeFilter,
        value: () => [dayjs(item.startDate), dayjs(item.endDate)]
      })) || []
  }
}

/**
 * @description: 快捷选择时间(月维度)
 * @param {*} item
 * @return {*}
 */
const onSelectShortcut = (item: any) => {
  // console.log('onSelectShortcut--item', item)
  setTimer('custom', item)
}

const onChange = (val: any) => {
  console.log('onChange---val', val)
}
/**
 * @description: 选择时间
 * @param {*} val
 * @return {*}
 */
const onRangePickerSelect = (val: any) => {
  selectedTime.value = val?.[0]
  if (val?.length === 2) {
    const tempDate = val.sort((a: any, b: any) => {
      const dateA: any = new Date(a)
      const dateB: any = new Date(b)
      return dateA - dateB
    })
    setTimer('custom', {
      dateUnit: '-1',
      startDate: tempDate[0],
      endDate: tempDate[1]
    })
  }
}

/**
 * @description: 设置时间
 * @return {*}
 */
const setTimer = (type: 'default' | 'custom', val?: any) => {
  if (type === 'default') {
    timerObj.value.dateUnit = rangeShortcuts.value?.[0]?.dateUnit
    timerObj.value.startDate = rangeShortcuts.value?.[0]?.startDate
    timerObj.value.endDate = rangeShortcuts.value?.[0]?.endDate
    timerObj.value.month = rangeShortcuts.value?.[0]?.month
    timerObj.value.week = rangeShortcuts.value?.[0]?.week
  }
  if (type === 'custom' && val) {
    timerObj.value.dateUnit = val.dateUnit
    timerObj.value.startDate = val.startDate
    timerObj.value.endDate = val.endDate
    timerObj.value.month = val?.month
    timerObj.value.week = val?.week
  }

  if (timerObj.value.startDate && timerObj.value.endDate) {
    timer.value = [timerObj.value.startDate, timerObj.value.endDate]
  }
  if (isCacheTime) {
    comQueryStore.setCacheTime(timerObj.value)
  }

  emits('change', timerObj.value)
}

/**
 * @description: 时间禁用(前后一年)
 * @param {*} current
 * @return {*}
 */
const disabledDate = (current: any) => {
  if (selectedTime.value) {
    const startDate = dayjs(selectedTime.value).subtract(1, 'year')
    const endDate = dayjs(selectedTime.value).add(1, 'year')
    const currentDate = dayjs(current)
    if (currentDate.isBefore(startDate) || currentDate.isAfter(endDate)) {
      return true
    }
  }
  return false
}

/**
 * @description: 初始化
 * @return {*}
 */
const init = async () => {
  await getTimeList()
  if (isCacheTime && comQueryStore.cacheTime) {
    setTimer('custom', comQueryStore.cacheTime)
  } else {
    setTimer('default')
  }
}

init()
</script>

<style lang="scss">
.frangePicker {
  margin-right: 30px;
  .arco-picker-shortcuts {
    max-height: 309px;
  }
  .arco-picker-week-list {
    font-size: 14px;
  }
}
</style>
