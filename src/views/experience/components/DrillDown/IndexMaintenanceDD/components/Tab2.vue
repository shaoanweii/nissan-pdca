<template>
  <div class="w-full font-14">
    <div class="flex">
      <div class="lh-32 color-666 text-align-right" style="width: 72px">
        <!-- <span>*</span> -->
        <span class="ml-5">指标类型:</span>
      </div>
      <div class="flex-1 ml-16" style="width: 0">
        <a-select
          v-model="indexType"
          :style="{ width: '140px' }"
          class="border-def bg-white radius-4"
          @change="indexTypeChange"
        >
          <a-option v-for="(item, index) of exponentialType" :key="index" :value="item.value">{{
            item.name
          }}</a-option>
        </a-select>
        <a-button type="outline" class="ml-16 radius-4" @click="handleSetTab(3)">
          <template #icon>
            <icon-plus />
          </template>
          添加指标
        </a-button>
      </div>
    </div>
    <template v-if="exponentialType[indexType]?.exponentialGranularity">
      <!-- <div class="flex mt-14">
        <div class="lh-32 color-666 text-align-right" style="width: 72px">
          <span>*</span>
          <span class="ml-5">时间粒度:</span>
        </div>
        <div class="flex-1 ml-16" style="width: 0">
          <FSwitchGroup
            v-model="dateUtilIndex"
            size="medium"
            :group="periodList"
            @change="dateUtilChange"
          />
        </div>
      </div> -->
      <div class="flex mt-14">
        <div class="lh-32 color-666 text-align-right" style="width: 72px">
          <span>*</span>
          <span class="ml-5">年份:</span>
        </div>
        <div class="flex-1 ml-16" style="width: 0">
          <a-select
            v-model="yearIndex"
            :style="{ width: '120px' }"
            class="border-def bg-white radius-4"
            @change="yearChange"
          >
            <a-option v-for="(item, index) of yearList" :key="index" :value="item.value">{{
              item.label
            }}</a-option>
            <!-- <a-option :value="1">2022年</a-option>
            <a-option :value="2">2023年</a-option>
            <a-option :value="3">2024年</a-option> -->
          </a-select>
        </div>
      </div>

      <div class="flex mt-14">
        <div class="lh-32 color-666 text-align-right" style="width: 72px">
          <!-- <span>*</span> -->
          <span class="ml-5">指标数据:</span>
        </div>
        <div class="flex-1 ml-16" style="width: 0">
          <div class="flex flex-wrap font-14 color-333 lh-20" style="width: 700px">
            <div
              v-for="(item, index) of exponentialType[indexType]?.exponentialGranularity?.[
                dateUtilIndex
              ]?.granularity?.[yearIndex]?.granularityDetail"
              :key="`${index}-${indexType}-${dateUtilIndex}-${yearIndex}`"
              class="border-def"
              :style="{
                width: '110px',
                margin: '0 -1px -1px'
              }"
            >
              <!-- <div class="py-10 px-28 bgc-def border-bottom-def">第{{ item }}周</div> -->
              <div class="py-10 px-28 bgc-def border-bottom-def">{{ item.name }}</div>
              <a-input-number
                v-model="item.value"
                style="width: 107px; height: 40px; border-radius: 0"
                class="bg-white"
              />
              <!-- <a-input
                v-model="item.value"
                style="width: 107px; height: 40px; border-radius: 0"
                class="bg-white"
              ></a-input> -->
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { findDateDimensionality } from '@/service/experienceTest'
import type { ConditionsDetailItem } from '@/types'
import { Message } from '@arco-design/web-vue'
import to from 'await-to-js'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
import isoWeek from 'dayjs/plugin/isoWeek'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear'

dayjs.extend(isoWeek)
dayjs.extend(isLeapYear)
dayjs.extend(isoWeeksInYear)

interface Props {
  data: Record<any, any>[]
}

const { data } = defineProps<Props>()
const emits = defineEmits(['setTab'])
const conditions = inject('conditions') as Record<string, ConditionsDetailItem[]>

const indexType = ref()
const dateUtilIndex = ref(0)
const yearIndex = ref()
const exponentialType = ref<Record<any, any>[]>([])
const yearOriginList = ref([])

// 时间粒度
const periodList = computed(() => {
  return conditions.period?.map((el: any, index: number) => {
    return {
      ...el,
      label: el.value,
      value: index
    }
  })
})

/**
 * @description: 获取年份
 * @return {*}
 */
const getYear = async () => {
  const [errs, data] = await to(findDateDimensionality())
  if (errs) {
    Message.error(errs.message)
    yearOriginList.value = []
  }
  if (data) {
    yearOriginList.value = data.result
  }
}

const yearList = computed(() => {
  return yearOriginList.value?.map((el: any, index: number) => ({
    ...el,
    label: el.yearName,
    key: el.year,
    value: index
  }))
  // return [
  //   { label: '2021年', key: '2021', value: 0 },
  //   { label: '2022年', key: '2022', value: 1 },
  //   { label: '2023年', key: '2023', value: 2 },
  //   { label: '2024年', key: '2024', value: 3 }
  // ]
})

/**
 * @description: 根据年份获取当前周或者月
 * @param {*} year
 * @param {*} unit
 * @return {*}
 */
function getTimeUnits(year: any, unit: any) {
  if (unit === 'w') {
    // 使用dayjs创建当年的12月31日的日期对象
    const lastDayOfYear = dayjs(`${year}-12-31`)
    // 获取当年最后一天所在的周数（按照ISO 8601标准，周从周一开始，取值范围是1-53）
    // const weekNumber = lastDayOfYear.isoWeek()
    const weekNumber = lastDayOfYear.isoWeeksInYear()
    return weekNumber
  } else if (unit === 'm') {
    return 12
  }
  return null
}

// 指标数据
const generateWeek = (year: string) => {
  const wNum = getTimeUnits(year, 'w')
  const arr = Array.from({ length: wNum || 52 })
  const weekList = []
  for (let index = 0; index < arr.length; index++) {
    weekList.push({
      name: `第${index + 1}周`,
      value: null,
      sort: index
    })
  }
  return cloneDeep(weekList)
}
// 指标数据
const generateMonth = (year: string) => {
  const mNum = getTimeUnits(year, 'm')
  const arr = Array.from({ length: mNum || 12 })
  const monthList = []
  for (let index = 0; index < arr.length; index++) {
    monthList.push({
      name: `第${index + 1}月`,
      value: null,
      sort: index
    })
  }
  return cloneDeep(monthList)
}

// 年份
const generateDetail = (unit: any) => {
  const arr = yearList.value || []
  const detailList = []
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index]

    let dateList: any = []
    if (unit === 'w') {
      dateList = generateWeek(element.key)
    } else if (unit === 'm') {
      dateList = generateMonth(element.key)
    }

    detailList.push({
      year: element.key,
      granularityDetail: dateList
    })
  }
  return cloneDeep(detailList)
}

// 时间粒度
const generateUnit = () => {
  // const arr = conditions.period || []
  const arr = [
    // {
    //   key: 'w',
    //   value: '周',
    //   code: null,
    //   img: null,
    //   startThresholdValue: null,
    //   sort: null,
    //   endThresholdValue: null
    // },
    {
      key: 'm',
      value: '月',
      code: null,
      img: null,
      startThresholdValue: null,
      sort: null,
      endThresholdValue: null
    }
  ]
  const unitList = []
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index]
    unitList.push({
      granularityUnit: element.key,
      granularity: generateDetail(element.key)
    })
  }
  return cloneDeep(unitList)
}

onBeforeMount(async () => {
  await getYear()
  exponentialType.value = data

  if (exponentialType.value?.length) {
    // 默认选择指标的第一个选项
    indexType.value = 0

    // 默认选择当前年份
    yearIndex.value = yearList.value.findIndex(el => el.key === dayjs().get('year')?.toString())

    exponentialType.value = exponentialType.value.map((el: any, index: number) => {
      if (!el.exponentialGranularity || el.exponentialGranularity?.length === 0) {
        el.exponentialGranularity = generateUnit()
      }
      return {
        ...el,
        value: index
      }
    })
  }
})

const indexTypeChange = () => {}

const dateUtilChange = () => {}

const yearChange = async () => {}

const handleSetTab = (val: number) => {
  emits('setTab', val)
}

const getIndexData = () => {
  return exponentialType.value?.filter((el: any) => el.name)
}

defineExpose({ getIndexData })
</script>

<style lang="scss" scoped></style>
