<template>
  <div class="pxy-24">
    <!-- <div class="fw-600 font-16 lh-24 color-666 mb-6">趋势变化</div> -->

    <FCard :isTitleIcon="false" :isToolTip="false" title="" height="569px" class="mt-24">
      <template #titleIcon>
        <div class="flex">
          <div class="flex-none" :style="{ width: px2rem('262px') }">
            <div class="color-333 font-16 lh-24 fw-600">预警次数</div>
          </div>
          <div class="flex-1 ml-45">
            <div class="color-333 font-16 lh-24 fw-600">风险值趋势变化</div>
          </div>
        </div>
      </template>
      <div class="flex h-full">
        <div class="flex-none" :style="{ width: px2rem('280px') }">
          <div class="border-def radius-8 overflow-hidden w-full mt-14" v-if="riskNum?.length">
            <a-row class="">
              <template v-for="(item, index) in riskNum" :key="index">
                <a-col flex="1">
                  <div
                    :class="[riskLevelBgMap[item.riskLevelS]]"
                    class="py-4 font-12 lh-28 color-fff text-align-center"
                  >
                    {{ item.riskLevelS }}
                  </div>
                  <div
                    :class="{ 'border-left-def': index !== 0 }"
                    class="font-16 lh-28 color-666 text-align-center py-4"
                  >
                    {{ item.riskC }}
                  </div>
                </a-col>
              </template>
            </a-row>
          </div>

          <div class="color-333 font-16 lh-24 fw-600 mt-24 mb-14">预警记录</div>
          <a-grid :cols="12" class="pt-6 pb-7 bgc-def" style="border-radius: 4px 4px 0 0">
            <a-grid-item :span="1" class="text-align-center">
              <span class="color-26292e font-14 lh-20"></span>
            </a-grid-item>
            <a-grid-item :span="4" class="text-align-center">
              <span class="color-26292e font-14 lh-20">预警时间</span>
            </a-grid-item>
            <a-grid-item :span="3" class="text-align-center">
              <span class="color-26292e font-14 lh-20">风险值</span>
            </a-grid-item>
            <a-grid-item :span="3" class="text-align-center">
              <span class="color-26292e font-14 lh-20">风险等级</span>
            </a-grid-item>
          </a-grid>
          <div :style="{ height: px2rem('301px'), overflowY: 'auto' }">
            <a-grid
              v-for="(item, index) of riskRecord"
              :key="index"
              :class="{ 'bgc-f9f9f9': index % 2 === 0 }"
              :cols="12"
              class="py-14"
            >
              <a-grid-item :span="1" style="position: relative">
                <div class="line-wrapper ml-20">
                  <div class="line-1" v-if="index !== 0"></div>
                  <div class="line-2" v-if="index !== riskRecord?.length - 1"></div>
                  <div class="circle-1" :class="{ tap: index === 0 }"></div>
                </div>
              </a-grid-item>
              <a-grid-item :span="4" class="text-align-center">
                <span class="color-26292e font-14 lh-20">{{ item?.date }}</span>
              </a-grid-item>
              <a-grid-item :span="3" class="text-align-center">
                <span class="color-26292e font-14 lh-20">{{ item?.riskC }}</span>
              </a-grid-item>
              <a-grid-item :span="3" class="text-align-center">
                <div class="flex-inline" :class="[riskLevelMap[item.riskLevelS]]">
                  {{ item.riskLevelS }}
                </div>
              </a-grid-item>
            </a-grid>
          </div>
        </div>
        <div class="flex-1 h-full ml-45">
          <FEcharts :options="echartOptions" width="670px" height="100%"></FEcharts>
        </div>
      </div>
    </FCard>

    <!-- 品质风险不展示 情感及意图走势 -->
    <FCard
      v-if="isShowEmotionalIntention"
      :isTitleIcon="false"
      :isToolTip="false"
      title="情感及意图走势"
      height="489px"
      class="mt-24"
    >
      <FEcharts :options="echartOptions2" width="100%" height="100%"></FEcharts>
    </FCard>

    <FCard :isTitleIcon="false" :isToolTip="false" title="高频观点" height="520px" class="mt-24">
      <FEcharts :options="echartOptions3" width="100%" height="100%"></FEcharts>
    </FCard>
  </div>
</template>

<script lang="ts" setup>
import {
  getEmotionIntentionTrends,
  getHighFrequencyWord,
  getTrendList
} from '@/service/vocOverview'
import useComQueryStore from '@/stores/modules/comQuery'
import { defTooltip, toolTipPosition } from '@/utils/echartsConfig'
import to from 'await-to-js'
import { riskLevelBgMap, riskLevelMap } from '@/constant'
import useDrillDownStore from '@/stores/modules/drillDown'
import { Message } from '@arco-design/web-vue'
import {
  warningGetEmotionIntentionTrends,
  warningGetHighFrequencyWord,
  warningGetTrendList
} from '@/service/riskWarning'
import { formatNumber } from '@/utils'
import { value2rem, px2rem } from '@/utils/rem'

interface Props {
  mapKey: 'vocViewInRisk' | 'warning'
  dateParams: Record<any, any> | undefined
}

const { mapKey = 'vocViewInRisk', dateParams } = defineProps<Props>()

const comQueryStore = useComQueryStore()

const riskNum = ref<Record<any, any>[]>([])
const riskRecord = ref<Record<any, any>[]>([])
const riskTrend = ref<Record<any, any>[]>([])
const hotWord = ref<Record<any, any>[]>([])

const emotionIntentionTrends = ref([])
const drillDownStore = useDrillDownStore()

const isShowEmotionalIntention = computed(() => {
  const map: Record<any, any> = {
    vocViewInRisk: drillDownStore.riskInitData.labelType !== 'QY',
    warning: drillDownStore.riskWarningInitData.labelType !== 'QY'
  }
  return map[mapKey]
})

const getEmotionIntentionTrendsByMapKey = computed(() => {
  const map: Record<any, any> = {
    vocViewInRisk: getEmotionIntentionTrends,
    warning: warningGetEmotionIntentionTrends
  }
  return map[mapKey]
})

const getHighFrequencyWordByMapKey = computed(() => {
  const map: Record<any, any> = {
    vocViewInRisk: getHighFrequencyWord,
    warning: warningGetHighFrequencyWord
  }
  return map[mapKey]
})

const getTrendListByMapKey = computed(() => {
  const map: Record<any, any> = {
    vocViewInRisk: getTrendList,
    warning: warningGetTrendList
  }
  return map[mapKey]
})

const storeDataByMapKey = computed(() => {
  const map: Record<any, any> = {
    vocViewInRisk: drillDownStore.riskInitData,
    warning: drillDownStore.riskWarningInitData
  }
  return map[mapKey]
})

const baseFormMap = computed(() => {
  const map: Record<string, any> = {
    vocViewInRisk: { ...comQueryStore.requiredForm, ...comQueryStore.formByVocView },
    warning: { ...comQueryStore.requiredForm, ...comQueryStore.formByWarning }
  }
  return map[mapKey]
})

const form = computed(() => {
  return {
    ...baseFormMap.value,
    riskId: storeDataByMapKey.value.riskId,
    riskLevel: storeDataByMapKey.value.riskLevelS,
    tagLabelList: drillDownStore.riskWarningInitData.tagLabelList || undefined
  }
})

const init = async () => {
  const [errs, data] = await to(
    getEmotionIntentionTrendsByMapKey.value({ ...form.value, ...dateParams })
  )
  if (errs) {
    Message.error(errs.message)
  }
  if (data) {
    emotionIntentionTrends.value = (data as any)?.result
  }
  const [errs1, data1] = await to(
    getHighFrequencyWordByMapKey.value({ ...form.value, ...dateParams })
  )
  if (errs1) {
    Message.error(errs1.message)
  }
  if (data1) {
    hotWord.value = (data1 as any)?.result
  }
  const [tdrErr, trendDataResult] = await to(getTrendListByMapKey.value(form.value))
  if (tdrErr) {
    Message.error(tdrErr.message)
  }
  if (trendDataResult) {
    riskNum.value = (trendDataResult as any)?.result?.riskNum
    riskRecord.value = (trendDataResult as any)?.result?.riskRecord
    riskTrend.value = (trendDataResult as any)?.result?.riskTrend
  }
}

init()

// 风险值趋势变化
const echartOptions = computed(() => {
  const transitionData = riskTrend.value?.reduce(
    (acc: any, cur: any) => {
      acc.date.push(cur.date)
      // 观点数
      acc.s1Data.push({
        date: cur.date,
        name: cur.title,
        value: cur.riskC,
        riskLevelS: cur.riskLevelS,
        rp: cur.riskRp
        // g: cur.riskC
      })
      return acc
    },
    {
      date: [],
      s1Data: []
    }
  )
  return {
    dataZoom: [
      {
        show: transitionData?.date?.length > 7,
        type: 'slider',
        height: 20,
        bottom: 8,
        showDetail: false,
        showDataShadow: false
      }
    ],
    tooltip: {
      show: true,
      trigger: 'axis',
      position: (point: any, params: any, dom: any, rect: any, size: any) => {
        return toolTipPosition(point, params, dom, rect, size)
      },
      formatter: (params: any) => {
        return defTooltip('line-1', params)
      },
      padding: 0,
      borderWidth: 0,
      borderColor: 'rgba(0, 0, 0, 0)'
    },
    grid: {
      left: 0,
      top: 30,
      right: 10,
      bottom: 30,
      containLabel: true
    },
    legend: {
      show: false,
      right: 10,
      icon: 'circle',
      itemHeight: 8,
      itemWidth: 8
    },
    xAxis: {
      type: 'category',
      axisTick: {
        show: false,
        lineStyle: {
          type: 'dashed'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'solid'
        }
      },
      data: transitionData?.date || []
    },
    yAxis: {
      type: 'value',
      axisTick: {
        show: false,
        lineStyle: {
          type: 'dashed'
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
        name: '风险值',
        color: '#CB1A62',
        // data: [1820, 1932, 1901, 1934, 11290, 11330, 11320],
        data: transitionData?.s1Data || [],
        type: 'line',
        smooth: true,
        symbol: 'none'
      }
    ]
  }
})

// 情感意图
const echartOptions2 = computed(() => {
  // 负面  投诉 抱怨
  const transitionData = emotionIntentionTrends.value?.reduce(
    (acc: any, cur: any) => {
      acc.date.push(cur.date)
      // 负面
      acc.s1Data.push({
        date: cur.date,
        name: '负面',
        value: cur.negativeC,
        rp: cur.negativeR,
        yp: cur.negativeY
      })

      // 投诉
      acc.s2Data.push({
        date: cur.date,
        name: '投诉',
        value: cur.complaintC,
        rp: cur.complaintR,
        yp: cur.complaintY
      })

      // 抱怨
      acc.s3Data.push({
        date: cur.date,
        name: '抱怨',
        value: cur.complainC,
        rp: cur.complainR,
        yp: cur.complainY
      })
      return acc
    },
    {
      date: [],
      s1Data: [],
      s2Data: [],
      s3Data: []
    }
  )
  return {
    dataZoom: [
      {
        show: transitionData?.date?.length > 7,
        type: 'slider',
        height: 20,
        bottom: 8,
        showDetail: false,
        showDataShadow: false
      }
    ],
    tooltip: {
      show: true,
      trigger: 'axis',
      position: (point: any, params: any, dom: any, rect: any, size: any) => {
        return toolTipPosition(point, params, dom, rect, size)
      },
      formatter: (params: any) => {
        return defTooltip('line', params)
      },
      padding: 0,
      borderWidth: 0,
      borderColor: 'rgba(0, 0, 0, 0)'
    },
    grid: {
      left: 50,
      top: 30,
      right: 10,
      bottom: 30,
      containLabel: true
    },
    legend: {
      show: true,
      right: 10,
      icon: 'circle',
      itemHeight: 8,
      itemWidth: 8
    },
    xAxis: {
      type: 'category',
      axisTick: {
        show: false,
        lineStyle: {
          type: 'dashed'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'solid'
        }
      },
      data: transitionData?.date || []
    },
    yAxis: {
      type: 'value',
      axisTick: {
        show: false,
        lineStyle: {
          type: 'dashed'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed'
        }
      },
      axisLabel: {
        formatter: (value: any) => {
          return formatNumber(value)
        }
      }
    },
    series: [
      {
        name: '负面',
        color: '#CB1A62',
        // data: [1820, 1932, 1901, 1934, 11290, 11330, 11320],
        data: transitionData?.s1Data || [],
        type: 'line',
        smooth: true,
        symbol: 'none'
      },
      {
        name: '投诉',
        color: '#DC6F00',
        // data: [820, 932, 901, 934, 1290, 1330, 1320],
        data: transitionData?.s2Data || [],
        type: 'line',
        smooth: true,
        symbol: 'none'
      },
      {
        name: '抱怨',
        color: '#DAAD00',
        // data: [2820, 2932, 2901, 2934, 21290, 21330, 21320],
        data: transitionData?.s3Data || [],
        type: 'line',
        smooth: true,
        symbol: 'none'
      }
    ]
  }
})

let pon = [
  [0, 0, 12],
  [4, -15, 12],
  [1, 35, 12],
  [-20, -30, 12],
  [-0, -54, 12],

  [-75, -50, 8],
  [-75, -97, 8],
  [20, -82, 8],
  [-73, 20, 8],
  [-70, 77, 8],

  [43, -40, 8],
  [-45, 40, 10],
  [-25, 60, 8],
  [-10, 85, 8],
  [-43, -83, 8],

  [-65, -20, 8],
  [75, -50, 8],
  [75, -87, 8],
  [70, -102, 8],
  [73, 20, 8]

  // [-75, -50, 8],
  // [-75, -97, 8],
  // [20, -82, 8],
  // [-73, 20, 8],
  // [-70, 77, 8],
]

// 高频热词
const echartOptions3 = computed(() => {
  // 取数据的前20条 与pon坐标点合并坐标及数据
  const _data = hotWord.value.slice(0, 20).map((item, index) => {
    return [...pon[index], item]
  })
  return {
    backgroundColor: 'transparent',
    grid: {
      top: '5%',
      left: '8%',
      // right: "7%",
      bottom: '5%',
      containLabel: true
    },
    xAxis: [
      {
        show: false,
        type: 'value',
        min: -100,
        max: 100
      }
    ],
    yAxis: [
      {
        min: -100,
        max: 100,
        show: false
      }
    ],
    tooltip: {},
    series: [
      {
        zlevel: 2,
        // name: "负面热词",
        type: 'scatter',
        symbol: 'circle',
        symbolSize: 0,
        tooltip: {
          show: false,
          formatter: function (param: any) {
            // console.log(param);
            const { marker, value } = param
            return (
              value[3]['emotionType'] +
              '</br>' +
              marker +
              value[3]['tagName'] +
              '：' +
              value[3]['tagC']
            )
          }
        },
        label: {
          show: true,
          color: '#595959',
          // distance: 15,
          formatter: function (param: any) {
            return `{bg|${param.value[3]['tagName']}}{valueCss|${param.value[3]['tagC']}}`
          },
          rich: {
            bg: {
              padding: [6, 0, 6, 12],
              backgroundColor: '#fff',
              borderRadius: [12, 0, 0, 12],
              color: '#000'
            },
            valueCss: {
              padding: [6, 12],
              backgroundColor: '#fff',
              borderRadius: [0, 12, 12, 0],
              color: '#6E7B91'
            }
          }
        },
        emphasis: {
          label: {
            formatter: function (param: any) {
              return `{bg|${param.value[3]['tagName']}}{valueCss|${param.value[3]['tagC']}}`
            },
            rich: {
              bg: {
                padding: [6, 0, 6, 12],
                backgroundColor: '#000',
                borderRadius: [16, 0, 0, 16],
                color: '#fff',
                borderWidth: 0,
                fontSize: 20
              },
              valueCss: {
                padding: [6, 12],
                backgroundColor: '#000',
                borderRadius: [0, 16, 16, 0],
                borderWidth: 0,
                color: '#fff',
                fontSize: 20
              }
            }
          }
        },
        // [
        //   [
        //     0,
        //     0,
        //     12,
        //     {
        //       keyword: '隔音效果一般',
        //       emotionType: '负面',
        //       statistic: '9',
        //       positive: null,
        //       negative: '9',
        //       neutral: null,
        //       soaringRate: '0',
        //       weight: -1
        //     }
        //   ]
        // ]
        data: _data.map((item: any, index: any) => {
          return {
            value: item,
            label: {
              position: item[0] > 0 ? 'right' : 'left',
              rich: {
                bg: {
                  fontSize: index < 5 ? 16 : 14
                },
                valueCss: {
                  fontSize: index < 5 ? 16 : 14
                }
              }
            }
          }
        })
      },

      {
        // name: "中心原点",
        zlevel: 0,
        type: 'effectScatter',
        symbol: 'circle',
        rippleEffect: {
          scale: 13,
          number: 3,
          period: 100000
        },
        symbolSize: 100,
        emphasis: {
          // disabled: true,
          scale: false,
          focus: false,
          itemStyle: {
            opacity: 0
          }
        },
        itemStyle: {
          color: '#EDF0F6'
        },
        tooltip: {
          show: false
        },
        data: [0, 0]
      }
    ]
  }
})
</script>

<style lang="scss" scoped></style>
