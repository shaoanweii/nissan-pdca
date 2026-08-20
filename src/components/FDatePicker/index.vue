<script lang="ts" setup>
import { ref, onBeforeMount, watch, computed } from 'vue'
import dayjs from 'dayjs'
import { getTime } from '@/service/common'
import to from 'await-to-js'
import { useAppStoreWithOut } from '@/stores/modules/app'
import { Message } from '@arco-design/web-vue'
import useComQueryStore from '@/stores/modules/comQuery'

/**
 * 时间维度配置
 */
interface TimeOptionsItem {
  zhName: string
  name: 'week' | 'month' | 'season' | 'year' | 'customer'
  // type: '0' | '1' | '2' | '3' | '-1'
  type: 'w' | 'm' | '-1'
  option: any[]
}

/**
 * 时间listItem
 */
interface TimeItem {
  season?: string
  endDate?: string
  dateUnit?: string
  dateYear?: string
  startDate?: string
  endDateStr?: string
  timeFilter?: string
  starDateStr?: string
}

const { controller } = defineProps<{
  controller: string
}>()

const emits = defineEmits(['change'])
const appstore = useAppStoreWithOut()
const comQueryStore = useComQueryStore()

// 自定义
const CUSTOMER = '-1'
const poperShow = ref(false)
const leafLoading = ref(false)
const timeDimensionType = ref('')
const timeDimensionOptions = ref<TimeOptionsItem[]>([
  {
    zhName: '日期筛选',
    name: 'customer',
    type: '-1',
    option: []
  },
  {
    zhName: '月度',
    name: 'month',
    type: 'm',
    option: []
  },
  {
    zhName: '周度',
    name: 'week',
    type: 'w',
    option: []
  }
])
const timeValue = ref<any>([])
// const pickerMinDate = ref()
const curTime = ref<TimeItem>({})
// const cacheCurTime = ref<TimeItem>({})
const cacheTimeDimensionType = ref('0')
/**
 * @description: 计算两个时间的差值
 * @param {*} targetTime
 * @param {*} compareTime
 * @return {*}
 */
// function checkTimeDifference(targetTime: any, compareTime: any) {
//   const target = dayjs(targetTime)
//   const compare = dayjs(compareTime)
//   const diffInDays = compare.diff(target, 'day')
//   return Math.abs(diffInDays) >= 91
// }

const selectedTime = ref()
const onRangePickerSelect = (val: any) => {
  selectedTime.value = val?.[0]
}
// 可选择的时间范围
const disabledDate = (current: any) => {
  if (selectedTime.value) {
    const startDate = dayjs(selectedTime.value).subtract(1, 'year')
    const endDate = dayjs(selectedTime.value).add(1, 'year')
    const currentDate = dayjs(current)
    if (currentDate.isBefore(startDate) || currentDate.isAfter(endDate)) {
      return true
    }
    // if (checkTimeDifference(selectedTime.value, current)) {
    //   return true
    // }
  }
  return false
}
const loading = ref(false)

const init = async () => {
  loading.value = true
  let defaultDimension = timeDimensionOptions.value[0]
  if (appstore.sysConfig.defaultPeriod) {
    defaultDimension = timeDimensionOptions.value.find(
      el => el.type === appstore.sysConfig.defaultPeriod
    )!
  }

  timeOptionChange(defaultDimension || timeDimensionOptions.value[0])

  loading.value = false
}
onBeforeMount(() => {
  init()
})

const resetTime = () => {
  curTime.value = {}
  comQueryStore.setCacheTime(undefined)
  init()
}

/**
 * set当前选择的时间
 * @param time
 */
const setCurTime = (time: any) => {
  if (timeDimensionType.value === CUSTOMER) {
    curTime.value.startDate = time[0] ? dayjs(time[0]).format('YYYY-MM-DD') : time.startDate
    curTime.value.endDate = time[1] ? dayjs(time[1]).format('YYYY-MM-DD') : time.endDate
    curTime.value.dateUnit = '-1'
  } else {
    curTime.value = time
  }
  poperShow.value = false
  catchFlag.value = false
  comQueryStore.setCacheTime(curTime.value)
  emits('change', curTime.value)
}

/**
 * 时间维度更新
 * @param item
 */
const timeOptionChange = (item: any, flag = false) => {
  timeDimensionType.value = item.type
  getTimeList(item, flag)
}

/**
 *
 * 获取当前维度(周、月、季、年、自定义)的option
 */
const curTimeOption = computed<TimeOptionsItem>({
  get() {
    return (timeDimensionOptions.value.find(item => item.type == timeDimensionType.value) ||
      {}) as TimeOptionsItem
  },
  set(val: any) {
    const index = timeDimensionOptions.value.findIndex(item => item.type == val.type)
    timeDimensionOptions.value[index] = val
  }
})

const catchFlag = ref(true)

watch(
  () => poperShow.value,
  (nval: boolean) => {
    if (nval) {
      catchFlag.value = true
      cacheTimeDimensionType.value = timeDimensionType.value
      if (timeDimensionType.value === CUSTOMER) {
        timeValue.value = [curTime.value?.startDate, curTime.value?.endDate]
      }
    } else {
      // 只选择时间维度不选择时间。维度恢复成上一次的值
      if (catchFlag.value) {
        timeDimensionType.value = cacheTimeDimensionType.value
      }
    }
  }
)

const getTimeList = async (item: any, flag = false) => {
  // 设置自定义时间默认值
  if (timeDimensionType.value === CUSTOMER) {
    timeValue.value = [curTime.value?.startDate, curTime.value?.endDate]
    return
  }

  if (!flag && comQueryStore.cacheTime) {
    timeDimensionType.value = comQueryStore.cacheTime?.dateUnit
  }

  //异步请求获取
  leafLoading.value = true

  const [errs, data] = await to(getTime(controller, timeDimensionType.value))
  if (errs) {
    Message.error(errs.message)
  }
  leafLoading.value = false
  if (data?.result) {
    if (comQueryStore.cacheTime?.dateUnit === 'w') {
      timeDimensionOptions.value[0].option = data?.result || []
    }
    if (comQueryStore.cacheTime?.dateUnit === 'm') {
      timeDimensionOptions.value[1].option = data?.result || []
    }
    item.option = data?.result || []
    curTimeOption.value = item
  }
  // 设置默认值
  if (!curTime.value.startDate) {
    if (comQueryStore.cacheTime) {
      setCurTime(comQueryStore.cacheTime)
    } else {
      setCurTime(curTimeOption.value.option[0])
    }
  }
}

defineExpose({ resetTime })
</script>

<template>
  <!-- v-loading="loading" -->
  <a-spin :loading="loading">
    <div class="cycle-time-picker">
      <a-popover
        v-model:popup-visible="poperShow"
        placement="bottom-start"
        width="auto"
        trigger="click"
      >
        <!--时间维度-->
        <div class="select-wrapper">
          <span>{{ curTimeOption?.zhName }}</span>
          <icon-down :class="{ active: poperShow }" />
          <!-- <icon-up /> -->
        </div>
        <template #content>
          <!--维度详情-->
          <div class="ctp-wrapper">
            <div class="ctp-panel">
              <!--周月季年list-->
              <ul class="el-select-dropdown__list menu">
                <template v-for="(item, index) in timeDimensionOptions" :key="index">
                  <li
                    class="el-select-dropdown__item"
                    :class="{ active: timeDimensionType === item.type }"
                    @click.stop.prevent="timeOptionChange(item, true)"
                  >
                    <span>{{ item.zhName }}</span>
                    <icon-right />
                  </li>
                </template>
              </ul>
              <!--周月季年-详情-->
              <!-- height="350px" -->
              <a-scrollbar style="height: 350px; overflow: auto">
                <!-- v-loading="leafLoading" -->
                <a-spin :loading="leafLoading">
                  <ul class="el-select-dropdown__list leaf" v-show="timeDimensionType !== CUSTOMER">
                    <li
                      class="el-select-dropdown__item"
                      v-for="item in curTimeOption.option"
                      :key="item.time"
                      :class="{ active: curTime?.timeFilter === item.timeFilter }"
                      @click="setCurTime(item)"
                    >
                      <span>{{ item.timeFilter }}</span>
                      <icon-check v-if="curTime?.timeFilter === item.timeFilter" class="ml-10" />
                    </li>
                  </ul>
                </a-spin>
              </a-scrollbar>
              <!--自定义时间-->
              <a-range-picker
                v-if="timeDimensionType === CUSTOMER"
                v-model="timeValue"
                hide-trigger
                value-format="YYYY-MM-DD"
                style="width: 560px; margin-left: 20px"
                :disabledDate="disabledDate"
                @change="setCurTime"
                @select="onRangePickerSelect"
              />
            </div>
          </div>
        </template>
      </a-popover>
      <div class="ctp-time">
        <span class="ctpt-content">
          <template v-if="timeDimensionType !== CUSTOMER">
            <span>{{ curTime?.timeFilter }}</span>
            <span style="padding: 0 5px">:</span>
          </template>
          <span
            >{{ curTime?.startDate && dayjs(curTime?.startDate).format('YYYY.MM.DD') }} -
            {{ curTime?.endDate && dayjs(curTime?.endDate).format('YYYY.MM.DD') }}</span
          >
        </span>
        <icon-calendar class="ml-10" />
        <!-- <el-icon class="ml-10">
        <Calendar />
      </el-icon> -->
      </div>
    </div>
  </a-spin>
</template>

<style lang="less" scoped>
.cycle-time-picker {
  background: #fff;
  display: inline-flex;
  border-radius: 4px;
  border: 1px solid #dde3ee;
  align-items: center;
  height: 32px;
  line-height: 32px;
  min-width: 300px;
  .ctp-time {
    padding: 0 10px 0 10px;
    white-space: nowrap;
    display: flex;
    align-items: center;
    min-width: 282px;
    .ctpt-content {
      flex: 1;
    }
  }

  .select-wrapper {
    padding-left: 12px;
    padding-right: 10px;
    display: flex;
    align-items: center;
    border-right: 1px solid #dde3ee;
    cursor: pointer;
    transition: 0.3s ease;

    span {
      width: 60px;
      white-space: nowrap;
    }

    .active {
      transition: 0.3s ease;
      transform: rotate(180deg);
    }

    i {
      transition: 0.3s ease;

      &.active {
        transform: rotate(180deg);
      }
    }
  }
}

.ml-10 {
  margin-left: 10px;
}

.ctp-wrapper {
  .ctp-panel {
    display: flex;
    position: relative;

    .el-select-dropdown__list {
      box-sizing: border-box;
      list-style: none;
      margin: 0;
      padding: 6px 0;
      min-width: 120px;
    }
    .el-select-dropdown__item {
      box-sizing: border-box;
      color: #606266;
      cursor: pointer;
      font-size: 14px;
      height: 34px;
      line-height: 34px;
      overflow: hidden;
      //padding: 0 32px 0 20px;
      position: relative;
      text-overflow: ellipsis;
      white-space: nowrap;
      min-width: 86px;
      padding: 0 12px;
      display: flex;
      align-items: center;

      > span {
        flex: 1;
      }

      i {
        color: inherit;
      }

      .el-icon-check {
        font-weight: bold;
        color: #287bc8;
        margin-left: 10px;
        display: none;
      }

      &.active {
        color: #287bc8;

        .el-icon-check {
          display: inline-block;
        }
      }
    }

    .el-select-dropdown__list.menu {
      border-right: 1px solid #dde3ee;
    }

    .el-select-dropdown__list.leaf {
      height: 350px;
      // overflow: auto;
    }

    &:deep(.ed-range-editor.ed-input__wrapper) {
      width: 0;
      height: 0;
      border: none !important;
      padding: 0;
      position: absolute;
      left: -200px;
    }
    &:deep(.ed-picker__popper.ed-popper) {
      border: none;
      box-shadow: none;
      position: relative !important;
      inset: 0 !important;
    }
    &:deep(.ed-range-editor--small .ed-range-separator) {
      visibility: hidden;
    }
  }
}
</style>
