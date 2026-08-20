<template>
  <a-row class="mt-14 h-full">
    <a-col flex="407px">
      <a-grid
        :cols="22"
        class="pt-6 pb-7 mb-6 bgc-def"
        :class="{ 'pr-10': tableData?.length > 10 }"
        style="border-radius: 4px 4px 0 0"
      >
        <a-grid-item :span="2" class="text-align-center">
          <span class="color-09121f font-14 lh-20"></span>
        </a-grid-item>
        <a-grid-item :span="6" class="">
          <span class="color-26292e font-14 lh-20">观点名称</span>
        </a-grid-item>
        <a-grid-item :span="4" class="text-align-center">
          <span class="color-26292e font-14 lh-20">观点数</span>
        </a-grid-item>
        <a-grid-item :span="5" class="text-align-right">
          <span class="color-26292e font-14 lh-20 pr-16">环比</span>
        </a-grid-item>
        <a-grid-item :span="5" class="text-align-right">
          <span class="color-26292e font-14 lh-20 pr-18">同比</span>
        </a-grid-item>
      </a-grid>

      <div class="table-body" @scroll="targetScroll">
        <template v-if="tableData?.length">
          <!-- bg-fbeef1-1 -->
          <a-grid
            v-for="(item, index) of tableData"
            :key="index"
            :class="[
              index % 2 === 0 ? 'bgc-f9f9f9' : '',
              item.tagName === selectedTagName ? 'bg-e7f5fb-1' : ''
            ]"
            :cols="22"
            class="py-8 lh-24"
          >
            <a-grid-item :span="2" class="text-align-center flex-xy-center">
              <span class="font-14" :class="[rankColorMap[index + 1]]">{{ index + 1 }}</span>
            </a-grid-item>
            <a-grid-item
              :span="6"
              class="ellipsis-single-line point"
              v-drillDownPerm="props.permissionCode"
              @click="handleClickDD(item)"
            >
              <a-tooltip :content="item?.tagName">
                <span class="color-26292e font-14">{{ item?.tagName }}</span>
              </a-tooltip>
            </a-grid-item>
            <a-grid-item :span="4" class="text-align-center">
              <span class="color-26292e font-14">{{ item.tagC }}</span>
            </a-grid-item>
            <a-grid-item
              :span="5"
              class="flex-align-center justify-end color-dd3e3e point"
              @click="handleClickTopicChange(item)"
            >
              <RatioRY :value="item?.tagRp"></RatioRY>
            </a-grid-item>
            <a-grid-item
              :span="5"
              class="flex-align-center justify-end color-009949 point"
              @click="handleClickTopicChange(item)"
            >
              <RatioRY :value="item?.tagYp"></RatioRY>
            </a-grid-item>
          </a-grid>
        </template>
        <template v-else>
          <FEmpty />
        </template>
      </div>
    </a-col>
    <a-col flex="60px" class="h-full">
      <div ref="syncContainerRef" class="hide-scrollbar" style="margin-top: 39px; height: 400px">
        <template v-for="(item, index) of tableData" :key="index">
          <div class="flex-align-center" style="height: 40px">
            <SvgIcon
              name="arrow-right-fill"
              width="20px"
              height="20px"
              class="color-0082d6 font-20 mx-20"
              v-if="item.tagName === selectedTagName"
            ></SvgIcon>
          </div>
        </template>
      </div>
    </a-col>
    <a-col flex="auto" class="h-full" style="width: 0">
      <FEcharts
        v-if="isShowEcharts"
        :empty="!(lineData?.length !== 0)"
        :options="echartOptions"
        width="100%"
        height="100%"
      ></FEcharts>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { getFocusedTop, getFocusedTopLine } from '@/service/focus'
import useComQueryStore from '@/stores/modules/comQuery'
import useFocusStore from '@/stores/modules/focus'
import { Message } from '@arco-design/web-vue'
import to from 'await-to-js'
import { rankColorMap } from '@/constant'
import { defTooltip } from '@/utils/echartsConfig'
import useDrillDownStore from '@/stores/modules/drillDown'
import { findValueByArr, formatNumber, formatNumberByMaxValue2Unit } from '@/utils'

interface Props {
  permissionCode?: string // 下钻权限code
}

const props = defineProps<Props>()

const isShowEcharts = ref(false)
const comQueryStore = useComQueryStore()
const drillDownStore = useDrillDownStore()
const tableData = ref<Record<any, any>[]>([])
const lineData = ref<Record<any, any>[]>([])
const focusStore = useFocusStore()
const labelTypeLevelList = ref({})
const selectedTagName = ref()
const init = async (params?: any) => {
  labelTypeLevelList.value = params
  await getTableData()
  getLineData(tableData.value?.[0])
  selectedTagName.value = tableData.value?.[0]?.tagName
}

const getTableData = async () => {
  const [errs, data] = await to(
    getFocusedTop({
      ...comQueryStore.requiredForm,
      ...comQueryStore.formByFocus,
      tagType: focusStore.tagType,
      ...labelTypeLevelList.value
    })
  )
  if (errs) {
    Message.error(errs.message)
  }
  if (data) {
    tableData.value = data.result
  }
}

const getLineData = async (curTop: any) => {
  if (!curTop?.tagName) {
    lineData.value = []
    return
  }
  const [errs, data] = await to(
    getFocusedTopLine({
      ...comQueryStore.requiredForm,
      ...comQueryStore.formByFocus,
      tagType: focusStore.tagType,
      topicList: curTop?.tagName ? [curTop?.tagName] : undefined,
      ...labelTypeLevelList.value
    })
  )
  if (errs) {
    Message.error(errs.message)
  }
  if (data) {
    lineData.value = data.result
  }
}
// Topic Change
const handleClickTopicChange = (item: any) => {
  selectedTagName.value = item.tagName
  getLineData(item)
}

// 下钻
const handleClickDD = async (item: any) => {
  drillDownStore.setFocusVisible(true, { ...item, labelTypeLevelList: labelTypeLevelList.value })
}

onMounted(() => {
  setTimeout(() => {
    isShowEcharts.value = true
  }, 500)
})

const echartOptions = computed(() => {
  const data = lineData.value?.reduce(
    (acc, cur) => {
      const item = {
        name: cur.tagName,
        value: cur.tagC,
        rp: cur.tagRp,
        yp: cur.tagYp,
        ...cur
      }
      acc.axisX.push(cur.date)
      acc.l1Data.push(item)
      return acc
    },
    {
      axisX: [],
      l1Data: []
    }
  )

  const maxValue = findValueByArr(data?.l1Data)

  return {
    dataZoom: [
      {
        show: data?.l1Data?.length > 7,
        type: 'slider',
        height: 20,
        bottom: 8,
        showDetail: false,
        showDataShadow: false
      }
    ],
    grid: {
      top: 20,
      left: 0,
      right: 30,
      bottom: 40,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          type: 'solid'
        }
      },
      formatter: (params: any) => {
        return defTooltip('line-2', params, { t2Label: '观点数' })
      },
      padding: 0,
      borderWidth: 0,
      borderColor: 'rgba(0, 0, 0, 0)'
    },
    xAxis: {
      type: 'category',
      data: data.axisX,
      axisTick: {
        show: false,
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: any) => {
          // return formatNumber(value)
          return formatNumberByMaxValue2Unit(value, maxValue)
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [
      {
        data: data.l1Data,
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {
          opacity: 0.2,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#2B9ED9'
              },
              {
                offset: 1,
                color: '#fff'
              }
            ]
          }
        }
      }
    ]
  }
})

const { targetScroll, syncContainerRef } = useSyncScroll()

function useSyncScroll() {
  const syncContainerRef = ref()
  const targetScroll = ($event: any) => {
    syncContainerRef.value.scrollTop = $event.target.scrollTop
  }

  return { targetScroll, syncContainerRef }
}

defineExpose({ init })
</script>

<style lang="scss" scoped>
.table-body {
  height: 400px;
  overflow: auto;
}
</style>
