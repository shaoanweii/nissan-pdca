<template>
  <a-row>
    <a-col flex="346px" class="mt-24">
      <!-- 
      presentationData?.eiNsrG ? emitionBorder3Map[presentationData?.eiNsrG] : border-3-bfc9dd 
      style="width: 346px"
      -->
      <div
        class="bg-c8e2fa-01 radius-11 shadow-6656563f pt-34 px-26 position-relative point ei-wrapper"
        :class="[
          experienceTestStore.indexType === 1 ? emitionBorder3Map[2] : 'border-3-transparent'
        ]"
        @click="indexTypeChange(1)"
      >
        <div class="flex-align-center py-8" :class="[isShowIndex ? '' : 'mt-20']">
          <EmotionStatus :nsrg="presentationData?.eiNsrG"></EmotionStatus>
          <div class="ml-28">
            <div class="flex-align-center">
              <span
                class="font-24 fw-600 lh-28"
                :class="[emitionColorMap[presentationData?.eiNsrG]]"
                >{{ formatToTwoDecimal(presentationData?.eiNsrC) }}</span
              >
              <RatioRY
                :value="presentationData?.eiNsrRp"
                :placeholderIcon="false"
                class="ml-12"
              ></RatioRY>
            </div>
            <!-- <div class="color-4b5468 font-20 lh-31 mt-7">综合体验指数</div> -->
            <div class="color-4b5468 font-20 lh-31 mt-7">{{ presentationData?.eiTitle }}</div>
          </div>
        </div>

        <img
          v-if="!isShowIndex"
          src="@/assets/imgs/wave.png"
          class="position-absolute"
          :style="{ top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }"
          alt=""
        />

        <!-- <SvgIcon
          v-if="!isShowIndex"
          name="wave"
          width="100%"
          height="100%"
          class="position-absolute"
          style="top: 0; left: 0"
        ></SvgIcon> -->

        <a-grid
          v-if="isShowIndex"
          :cols="2"
          :col-gap="16"
          :row-gap="20"
          class="mt-25"
          style="max-height: 70px; overflow-y: auto"
        >
          <a-grid-item
            v-for="(item, index) of indicatorDataList"
            :key="index"
            class="bgc-def radius-2 lh-24 color-26292e"
          >
            <span class="font-14 ml-8">{{ item.name }}:</span>
            <span class="font-12 ml-5">{{ item.value }}</span>
          </a-grid-item>
        </a-grid>
      </div>
    </a-col>
    <a-col flex="145px" class="mt-24 ml-18 point" @click="indexTypeChange(2)">
      <!-- 产品体验 -->
      <!-- 
         presentationData?.prodNsrG
              ? emitionBorder3Map[presentationData?.prodNsrG]
              : 'border-3-bfc9dd'
       -->
      <div
        class="bg-c8e2fa-01 radius-11 shadow-6656563f pt-27 ps-wrapper"
        :class="[
          experienceTestStore.indexType === 2 ? emitionBorder3Map[3] : 'border-3-transparent'
        ]"
      >
        <div class="flex-align-center direction-column">
          <div class="font-24 fw-600 lh-30" :class="[emitionColorMap[presentationData?.prodNsrG]]">
            {{ formatToTwoDecimal(presentationData?.prodNsr) }}
          </div>
          <div class="lh-24 color-27c29f">
            <RatioRY :value="presentationData?.prodNsrRp" :placeholderIcon="false"></RatioRY>
          </div>
          <div class="color-131b2a font-16 lh-19 mt-10">{{ presentationData?.prodTitle }}</div>
        </div>
      </div>
      <!-- 服务体验 -->
      <!-- 
        presentationData?.servNsrG
              ? emitionBorder3Map[presentationData?.servNsrG]
              : 'border-3-bfc9dd'
       -->
      <div
        class="bg-c8e2fa-01 radius-11 shadow-6656563f pt-27 mt-12 ps-wrapper"
        :class="[
          experienceTestStore.indexType === 2 ? emitionBorder3Map[1] : 'border-3-transparent'
        ]"
      >
        <div class="flex-align-center direction-column">
          <div class="font-24 fw-600 lh-30" :class="[emitionColorMap[presentationData?.servNsrG]]">
            {{ formatToTwoDecimal(presentationData?.servNsr) }}
          </div>
          <div class="lh-24 color-27c29f">
            <RatioRY :value="presentationData?.servNsrRp" :placeholderIcon="false"></RatioRY>
          </div>
          <div class="color-131b2a font-16 lh-19 mt-10">{{ presentationData?.servTitle }}</div>
        </div>
      </div>
    </a-col>

    <a-col flex="auto" class="ml-20" style="width: 0">
      <FEcharts :options="echartOptions" width="100%" height="294px"></FEcharts>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import useExperienceTestStore from '@/stores/modules/experienceTest'
import EmotionStatus from './EmotionStatus.vue'
import {
  emitionBase64InBgWhiteMap,
  emitionColorMap,
  emitionBorder3Map,
  emitionColorStrMap1
} from '@/constant'
import {
  findGranularityDetail,
  getDefaultIndexedPerformance,
  getIndexDataPresentation,
  getProductAndServiceIndexedPerformance
} from '@/service/experienceTest'
import to from 'await-to-js'
import useComQueryStore from '@/stores/modules/comQuery'
import { Message } from '@arco-design/web-vue'
import { debounce } from 'lodash-es'
import { defTooltip } from '@/utils/echartsConfig'
import { formatToTwoDecimal } from '@/utils'
import { px2rem } from '@/utils/rem'

const experienceTestStore = useExperienceTestStore()
const isShowIndex = ref(false)

const comQuery = useComQueryStore()

const indexTypeChange = debounce((type: 1 | 2) => {
  experienceTestStore.setIndexType(type)
  getLineData()
}, 300)

const presentationData = ref<Record<any, any>>({})
const performanceData = ref<Record<any, any>[]>([])

const echartsApi = computed(() => {
  const apiMap = {
    1: getDefaultIndexedPerformance,
    2: getProductAndServiceIndexedPerformance
  }
  return apiMap[experienceTestStore.indexType]
})

const getLineData = async () => {
  const [errs, data] = await to(
    echartsApi.value({ ...comQuery.requiredForm, ...comQuery.formByTesting })
  )
  if (errs) {
    Message.error(errs.message)
  }

  if (data) {
    performanceData.value = data.result
  }
}

const indicatorDataList = ref<any[]>([])
const getIndicatorData = async () => {
  const [errs, data] = await to(findGranularityDetail({ ...comQuery.getDateParam }))
  if (errs) {
    Message.error(errs.message)
  }
  if (data) {
    isShowIndex.value = data.result?.length
    indicatorDataList.value = data.result
  }
}

const query = async () => {
  const [errs, data] = await to(
    getIndexDataPresentation({ ...comQuery.requiredForm, ...comQuery.formByTesting })
  )
  if (errs) {
    Message.error(errs.message)
  }
  if (data) {
    presentationData.value = data.result
  }
  getLineData()
  getIndicatorData()
}

const transitionEchartsData = () => {
  if (experienceTestStore.indexType === 1) {
    return performanceData.value?.reduce(
      (acc, cur) => {
        const item = {
          name: '综合体验指数',
          value: formatToTwoDecimal(cur.tagTopNsrC),
          g: cur.tagTopNsrG,
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
  } else if (experienceTestStore.indexType === 2) {
    return performanceData.value?.reduce(
      (acc, cur) => {
        const item = {
          name: cur.date,
          value: formatToTwoDecimal(cur.tagNsrC),
          g: cur.tagNsrG,
          ...cur
        }
        acc.axisX.push(cur.date)
        // SERVICE PROD tagName
        if (cur.tagName === 'PROD') {
          item.name = '产品体验指数'
          acc.l1Data.push(item)
        }
        if (cur.tagName === 'SERVICE') {
          item.name = '服务体验指数'
          acc.l2Data.push(item)
        }

        return acc
      },
      {
        axisX: [],
        l1Data: [],
        l2Data: []
      }
    )
  }
}

const echartOptions = computed(() => {
  const data = transitionEchartsData()

  const areaStyle = (color = '#2BB8C2') => {
    return {
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
            color: color
          },
          {
            offset: 1,
            color: '#fff'
          }
        ]
      }
    }
  }
  // 综合指数
  const comprehensiveSeries = [
    {
      name: 'prodData',
      type: 'line',
      itemStyle: {
        color: '#2C9BDE'
      },
      // data: [220, 182, 191, 234, 290, 330, 310],
      data: data?.l1Data?.map((el: any) => {
        return {
          ...el,
          name: el.name,
          value: el.value,
          g: el.tagTopNsrG,
          rp: el.tagFirstNsrR,
          yp: el.tagFirstNsrY,
          symbol: `image://${emitionBase64InBgWhiteMap[el.g]}`,
          symbolSize: 20,
          label: {
            show: true,
            offset: [20, 10],
            color: emitionColorStrMap1[el.g]
          }
        }
      }),
      areaStyle: areaStyle('#2c9bde')
    }
  ]
  // 产品与服务指数
  const prodAndServiceSeries = [
    {
      name: '产品体验指数',
      type: 'line',
      itemStyle: {
        color: '#29b9c2'
      },
      // data: [220, 182, 191, 234, 290, 330, 310],
      data: data?.l1Data?.map((el: any) => {
        return {
          ...el,
          name: el.name,
          value: el.value,
          g: el.tagNsrG,
          rp: el.tagNsrR,
          yp: el.tagNsrY,
          symbol: `image://${emitionBase64InBgWhiteMap[el.g]}`,
          symbolSize: 20,
          label: {
            show: true,
            offset: [20, 10],
            color: emitionColorStrMap1[el.g]
          }
        }
      }),

      areaStyle: areaStyle('#29b9c2')
    },
    {
      name: '服务体验指数',
      type: 'line',
      itemStyle: {
        color: '#ff7b2f'
      },
      // data: [220, 182, 191, 234, 290, 330, 310],
      data: data?.l2Data?.map((el: any) => {
        return {
          name: el.name,
          value: el.value,
          g: el.tagNsrG,
          rp: el.tagNsrR,
          yp: el.tagNsrY,
          symbol: `image://${emitionBase64InBgWhiteMap[el.g]}`,
          symbolSize: 20,
          label: {
            show: true,
            offset: [20, 10],
            color: emitionColorStrMap1[el.g]
          }
        }
      }),
      areaStyle: areaStyle('#ff7b2f')
    }
  ]

  const axisX = [...new Set(data?.axisX)]

  const seriesMap = {
    1: comprehensiveSeries,
    2: prodAndServiceSeries
  }

  return {
    dataZoom: [
      {
        show: data?.l1Data?.length > 7,
        type: 'slider',
        height: 20,
        bottom: 8,
        showDetail: false,
        showDataShadow: false
        // backgroundColor: 'rgba(0,0,0,0)',
        // fillerColor: 'rgba(0,0,0,.2)'
        // startValue: this.chartData.length - 7,
        // endValue: this.chartData.length - 1
      }
      // {
      //   // 设置滚动条的隐藏或显示
      //   show: true,
      //   // 设置类型
      //   type: 'slider',
      //   // 是否显示detail，即拖拽时候显示详细数值信息
      //   showDetail: false,
      //   // 数据窗口范围的起始数值
      //   // startValue: 0,
      //   // 数据窗口范围的结束数值（一页显示多少条数据）
      //   // endValue: 12,
      //   // 控制哪个轴，如果是number表示控制一个轴，
      //   // 如果是Array表示控制多个轴。此处控制第二根轴
      //   xAxisIndex: [0],
      //   // empty：当前数据窗口外的数据，被设置为空。
      //   // 即不会影响其他轴的数据范围
      //   filterMode: 'empty',
      //   // 滚动条高度
      //   // width: 3,
      //   height: 6,
      //   // 滚动条显示位置
      //   // height: '80%',
      //   // 距离右边
      //   // right: 3,
      //   // 控制手柄的尺寸
      //   // handleSize: 0,
      //   // 是否锁定选择区域（或叫做数据窗口）的大小
      //   zoomLoxk: true
      //   // 组件离容器上侧的距离
      //   // 如果top的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐
      //   // top: 'middle'
      // }
      // {
      //   // 没有下面这块的话，只能拖动滚动条，
      //   // 鼠标滚轮在区域内不能控制外部滚动条
      //   type: 'inside',
      //   // 控制哪个轴，如果是number表示控制一个轴，
      //   // 如果是Array表示控制多个轴。此处控制第二根轴
      //   xAxisIndex: [0],
      //   // 滚轮是否触发缩放
      //   zoomOnMouseWheel: false,
      //   // 鼠标移动能否触发平移
      //   moveOnMouseMove: true,
      //   // 鼠标滚轮能否触发平移
      //   moveOnMouseWheel: true
      // }
    ],
    tooltip: {
      trigger: 'axis',
      // position: (point: any, params: any, dom: any, rect: any, size: any) => {
      //   return toolTipPosition(point, params, dom, rect, size)
      // },
      formatter: (params: any) => {
        const handleParams = params.map((item: any) => {
          return {
            ...item,
            g: item.data.g,
            data: {
              ...item.data,
              g: item.data.g,
              rp: item.data.rp,
              yp: item.data.yp
              // rp: item.data.tagFirstNsrR,
              // yp: item.data.tagFirstNsrY
            }
          }
        })
        return defTooltip('line-2', handleParams)
      },
      padding: 0,
      borderWidth: 0,
      borderColor: 'rgba(0, 0, 0, 0)'
    },
    legend: {
      show: false
    },
    grid: {
      top: 20,
      left: '5%',
      right: 40,
      bottom: 50,
      containLabel: false
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisTick: {
        show: false
      },
      // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      data: axisX
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed'
        }
      },
      min: function (value: any) {
        if (value.min === 0) {
          return value.min
        }
        const minValue = Math.floor(value.min)
        if (minValue < -100) {
          return -100
        }
        return minValue
      },
      max: function (value: any) {
        const maxValue = Math.ceil(value.max)
        if (maxValue > 100) {
          return 100
        }
        return maxValue
      }
    },
    series: seriesMap[experienceTestStore.indexType]
  }
})

defineExpose({
  query,
  getIndicatorData
})
</script>

<style lang="scss" scoped>
.ei-wrapper {
  width: 100%;
  min-width: 346px;
  /* width: 346px; */
  height: 270px;
}

.ps-wrapper {
  /* width: 145px; */
  width: 100%;
  min-width: 145px;
  height: 129px;
}
</style>
