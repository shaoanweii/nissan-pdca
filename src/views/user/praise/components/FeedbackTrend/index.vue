<template>
  <a-row>
    <a-col flex="346px" class="mt-24">
      <!-- px2rem('346px') -->
      <div
        :style="{ width: '100%', minWidth: px2rem('346px'), height: px2rem('270px') }"
        class="bg-c8e2fa-01 radius-11 shadow-6656563f pt-34 px-26 position-relative point"
        :class="[active === 1 ? emitionBorder3Map[4] : 'border-3-transparent']"
        @click="indexTypeChange(1)"
      >
        <div class="flex-align-center py-8 mt-20">
          <EmotionStatus nsrg="4"></EmotionStatus>
          <div class="ml-28">
            <div class="flex-align-center">
              <span class="font-24 fw-600 lh-28" :class="[emitionColorMap[4], 'color-000-08']">{{
                presentationData?.globalFeedbackC
              }}</span>
              <RatioRY
                :value="presentationData?.globalFeedbackRp"
                :placeholderIcon="false"
                class="ml-12"
              ></RatioRY>
            </div>
            <!-- <div class="color-4b5468 font-20 lh-31 mt-7">综合体验指数</div> -->
            <div class="color-4b5468 font-20 lh-31 mt-7">
              {{ presentationData?.globalFeedbackTitle }}
            </div>
          </div>
        </div>

        <img
          src="@/assets/imgs/wave.png"
          class="position-absolute"
          :style="{ top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }"
          alt=""
        />
        <!-- <SvgIcon
          name="wave"
          width="100%"
          height="100%"
          class="position-absolute"
          :style="{ top: 0, left: 0, minWidth: px2rem('346px') }"
        ></SvgIcon> -->
      </div>
    </a-col>
    <a-col flex="145px" class="mt-24 ml-18 point" @click="indexTypeChange(2)">
      <!-- 产品体验 -->
      <!-- px2rem('145px') -->
      <div
        :style="{ width: '100%', minWidth: px2rem('145px'), height: px2rem('129px') }"
        class="bg-c8e2fa-01 radius-11 shadow-6656563f pt-27"
        :class="[active === 2 ? emitionBorder3Map[3] : 'border-3-transparent']"
      >
        <div class="flex-align-center direction-column">
          <div class="font-24 fw-600 lh-30" :class="[emitionColorMap[4], 'color-000-08']">
            {{ presentationData?.prodFeedbackC }}
          </div>
          <div class="lh-24 color-27c29f">
            <RatioRY :value="presentationData?.prodFeedbackRp" :placeholderIcon="false"></RatioRY>
          </div>
          <div class="color-131b2a font-16 lh-19 mt-10">
            {{ presentationData?.prodFeedbackTitle }}
          </div>
        </div>
      </div>
      <!-- 服务体验 -->
      <!-- px2rem('145px') -->
      <div
        :style="{ width: '100%', minWidth: px2rem('145px'), height: px2rem('129px') }"
        class="bg-c8e2fa-01 radius-11 shadow-6656563f pt-27 mt-12"
        :class="[active === 2 ? emitionBorder3Map[1] : 'border-3-transparent']"
      >
        <div class="flex-align-center direction-column">
          <div class="font-24 fw-600 lh-30" :class="[emitionColorMap[4], 'color-000-08']">
            {{ presentationData?.serviceFeedbackC }}
          </div>
          <div class="lh-24 color-27c29f">
            <RatioRY
              :value="presentationData?.serviceFeedbackRp"
              :placeholderIcon="false"
            ></RatioRY>
          </div>
          <div class="color-131b2a font-16 lh-19 mt-10">
            {{ presentationData?.serviceFeedbackTitle }}
          </div>
        </div>
      </div>
    </a-col>

    <a-col flex="auto" class="ml-20" style="width: 0">
      <FEcharts :options="echartOptions" width="100%" height="294px"></FEcharts>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import EmotionStatus from './EmotionStatus.vue'
import { emitionColorMap, emitionBorder3Map } from '@/constant'
import to from 'await-to-js'
import useComQueryStore from '@/stores/modules/comQuery'
import { Message } from '@arco-design/web-vue'
import { debounce } from 'lodash-es'
import { defTooltip } from '@/utils/echartsConfig'
import { findValueByArr, formatNumber, formatNumberByMaxValue2Unit, isDecimal } from '@/utils'
import {
  findFavorableFeedbackTrend,
  findFavorableFeedbackTrendDefaultLine,
  findFavorableFeedbackTrendLine
} from '@/service/praise'
import { px2rem, value2rem } from '@/utils/rem'

const active = ref(1)
const comQuery = useComQueryStore()

const indexTypeChange = debounce((type: 1 | 2) => {
  active.value = type
  if (type === 1) {
    getDefaultLineData()
  } else if (type === 2) {
    getLineData()
  }
}, 300)

const presentationData = ref<Record<any, any>>({})
const performanceData = ref<Record<any, any>[]>([])

const getLineData = async () => {
  const [errs, data] = await to(
    findFavorableFeedbackTrendLine({
      ...comQuery.requiredForm,
      ...comQuery.formByPraise,
      labelTypeList: ['PROD', 'SERVICE']
    })
  )
  if (errs) {
    Message.error(errs.message)
  }

  if (data) {
    performanceData.value = data.result
  }
}
const getDefaultLineData = async () => {
  const [errs, data] = await to(
    findFavorableFeedbackTrendDefaultLine({
      ...comQuery.requiredForm,
      ...comQuery.formByPraise,
      labelTypeList: ['PROD', 'SERVICE']
    })
  )
  if (errs) {
    Message.error(errs.message)
  }

  if (data) {
    performanceData.value = data.result
  }
}

/**
 * @description: 获取整体 + 产品 + 服务趋势
 * @return {*}
 */
const getFeedbackTrend = async () => {
  const [errs, data] = await to(
    findFavorableFeedbackTrend({ ...comQuery.requiredForm, ...comQuery.formByPraise })
  )
  if (errs) {
    Message.error(errs.message)
  }
  if (data) {
    presentationData.value = data.result
  }
}

const query = async () => {
  getFeedbackTrend()
  // getDefaultLineData()
  indexTypeChange(active.value as any)
}

const transitionEchartsData = () => {
  if (active.value === 1) {
    return performanceData.value?.reduce(
      (acc, cur) => {
        const item = {
          name: '整体好评反馈',
          value: cur.topicC || 0,
          // g: cur.topicG,
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
  } else if (active.value === 2) {
    return performanceData.value?.reduce(
      (acc, cur) => {
        const item = {
          name: cur.date,
          value: cur.topicC || 0,
          // g: cur.tagNsrG,
          ...cur
        }
        acc.axisX.push(cur.date)
        // SERVICE PROD tagName
        if (cur.labelType === 'PROD') {
          item.name = '产品好评反馈'
          acc.l1Data.push(item)
        }
        if (cur.labelType === 'SERVICE') {
          item.name = '服务好评反馈'
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

const echartOptions = computed(() => {
  const data = transitionEchartsData()
  // 综合指数
  const comprehensiveSeries = [
    {
      name: 'prodData',
      type: 'line',
      // itemStyle: {
      //   color: '#2C9BDE'
      // },
      // data: [220, 182, 191, 234, 290, 330, 310],
      data: data?.l1Data?.map((el: any) => {
        return {
          ...el,
          name: el.name,
          value: el.value,
          // g: el.tagTopNsrG,
          rp: el.topicRp,
          yp: el.topicYp
          // symbol: `image://${emitionBase64InBgWhiteMap[el.g]}`,
          // symbolSize: 20,
          // label: {
          //   show: true,
          //   offset: [20, 10],
          //   color: emitionColorStrMap1[el.g]
          // }
        }
      }),
      areaStyle: areaStyle('#2c9bde')
    }
  ]
  // 产品与服务指数
  const prodAndServiceSeries = [
    {
      name: '产品好评反馈',
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
          // g: el.tagNsrG,
          rp: el.topicRp,
          yp: el.topicYp
          // symbol: `image://${emitionBase64InBgWhiteMap[el.g]}`,
          // symbolSize: 20,
          // label: {
          //   show: true,
          //   offset: [20, 10],
          //   color: emitionColorStrMap1[el.g]
          // }
        }
      }),

      areaStyle: areaStyle('#29b9c2')
    },
    {
      name: '服务好评反馈',
      type: 'line',
      itemStyle: {
        color: '#ff7b2f'
      },
      // data: [220, 182, 191, 234, 290, 330, 310],
      data: data?.l2Data?.map((el: any) => {
        return {
          name: el.name,
          value: el.value,
          // g: el.tagNsrG,
          rp: el.topicRp,
          yp: el.topicYp
          // symbol: `image://${emitionBase64InBgWhiteMap[el.g]}`,
          // symbolSize: 20,
          // label: {
          //   show: true,
          //   offset: [20, 10],
          //   color: emitionColorStrMap1[el.g]
          // }
        }
      }),
      areaStyle: areaStyle('#ff7b2f')
    }
  ]

  const axisX = [...new Set(data?.axisX)]

  const seriesMap: any = {
    1: comprehensiveSeries,
    2: prodAndServiceSeries
  }

  const l1MaxValue = findValueByArr(data?.l1Data)
  const l1l2MaxValue =
    data?.l1Data?.length &&
    data?.l2Data?.length &&
    findValueByArr([...data?.l1Data, ...data?.l2Data])

  const maxMap: any = {
    1: l1MaxValue,
    2: l1l2MaxValue
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
        return defTooltip('line-2', handleParams, { t2Label: '观点数' })
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
      // min: function (value: any) {
      //   if (value.min === 0) {
      //     return value.min
      //   }
      //   const minValue = Math.floor(value.min)
      //   if (minValue < -100) {
      //     return -100
      //   }
      //   return minValue
      // },
      // max: function (value: any) {
      //   const maxValue = Math.ceil(value.max)
      //   if (maxValue > 100) {
      //     return 100
      //   }
      //   return maxValue
      // },
      axisLabel: {
        formatter: (value: any) => {
          // if (isDecimal(value)) {
          //   return ''
          // }
          // return formatNumber(value)
          return formatNumberByMaxValue2Unit(value, maxMap[active.value])
        }
      }
    },
    series: seriesMap[active.value]
  }
})

defineExpose({
  query
})
</script>

<style lang="scss" scoped></style>
