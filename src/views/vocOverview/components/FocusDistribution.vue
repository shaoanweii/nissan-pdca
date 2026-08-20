<template>
  <div class="product-distribution" ref="productDistributionRef">
    <FEcharts
      ref="chart1Ref"
      :options="echartOptions"
      linkageType="default"
      :empty="Boolean(!data?.focusDistribution || data?.focusDistribution.length === 0)"
      width="100%"
      height="269px"
      @handleClick="handleClick"
    ></FEcharts>

    <!-- @handleClick="handleClickZhu" -->
    <FEcharts
      :options="echartOptions2"
      :empty="Boolean(!data?.tagDistribution || data?.tagDistribution.length === 0)"
      :isShowXAxisTooltip="true"
      width="100%"
      height="244px"
      style="
        background: linear-gradient(180deg, #ffffff 0%, #f1f5ff 100%);
        border-radius: 4px 4px 4px 4px;
      "
    ></FEcharts>
  </div>
</template>

<script lang="ts" setup>
import { defColorList } from '@/constant'
import { defTooltip, toolTipPosition } from '@/utils/echartsConfig'
import {
  getProductFocusAttention,
  getQualityFocusAttention,
  getServiceFocusAttention,
  getServiceFocusAttentionLinkage,
  getQualityFocusAttentionLinkage,
  getProductFocusAttentionLinkage
} from '@/service/vocOverview'
import to from 'await-to-js'
import useComQueryStore from '@/stores/modules/comQuery'
import { debounce } from 'lodash-es'
import {
  findValueByArr,
  formatNumber,
  formatNumberByMaxValue2Unit,
  handleStrBySliceNum
} from '@/utils'
import { value2rem } from '@/utils/rem'

interface Props {
  // data: Record<any, any> | undefined
  distributionType: 'PRODUCT' | 'SERVICE' | 'QUALITY'
}
// data = {},
const { distributionType } = defineProps<Props>()

const comQueryStore = useComQueryStore()
const data = ref<Record<any, any>>({})

const queryApiMap = {
  PRODUCT: getProductFocusAttention,
  SERVICE: getServiceFocusAttention,
  QUALITY: getQualityFocusAttention
}

const detailApiMap = {
  PRODUCT: getProductFocusAttentionLinkage,
  SERVICE: getServiceFocusAttentionLinkage,
  QUALITY: getQualityFocusAttentionLinkage
}

// const tagTypeMap = {
//   PRODUCT: 'PROD',
//   SERVICE: 'SERVICE',
//   QUALITY: 'QY'
// }
// const router = useRouter()
// const focusStore = useFocusStore()
// const handleClickZhu = (params: any) => {
//   // 首页跳转用户聚焦关注需要携带一二级tagCode
//   if (params?.data?.firstCode && params?.data?.secondCode) {
//     comQueryStore.setTagLabelList([[params?.data?.firstCode, params?.data?.secondCode]])
//   }

//   focusStore.setTagType(tagTypeMap[distributionType] as Common.TagType)
//   router.push({ name: 'userfFocus' })
// }

const queryApi = computed(() => {
  return queryApiMap[distributionType]
})

const detailApi = computed(() => {
  return detailApiMap[distributionType]
})

const chart1Ref = ref()

const handleClick = debounce((params: any) => {
  const num = params?.data?.tagC ? params?.data?.tagC : data.value?.tagSumC

  chart1Ref.value?.customSetOption({ graphic: generateGraphic(num) })

  getDetail(params)
}, 300)

const getDetail = async (params: any) => {
  const [, _data] = await to(
    detailApi.value({
      ...comQueryStore.requiredForm,
      ...comQueryStore.formByVocView,
      labelTypeLevelFirstList: params.name ? [params.name] : undefined
    })
  )
  if (_data?.result) {
    data.value.tagDistribution = _data?.result?.map((el: any) => ({ ...el, ccolor: params.color }))
  }
}

const init = async (intention?: string) => {
  const [, _data] = await to(
    queryApi.value({ ...comQueryStore.requiredForm, ...comQueryStore.formByVocView, intention })
  )
  if (_data?.result) {
    data.value = _data?.result
  }
}

// init()

const generateGraphic = (num: number) => {
  return [
    {
      type: 'text',
      left: 'center',
      top: '42%',
      style: {
        // text: data.value?.tagSumC,
        text: num,
        textAlign: 'center',
        fill: 'rgba(0,0,0,0.9)',
        fontSize: value2rem(24),
        fontWeight: 600,
        lineHeight: value2rem(28)
      }
    },
    {
      type: 'text',
      left: 'center',
      top: '51%',
      style: {
        text: data.value?.title,
        textAlign: 'center',
        fill: '#09121F',
        fontSize: value2rem(16),
        lineHeight: value2rem(24)
      }
    }
  ]
}

const echartOptions = computed(() => {
  // focusDistribution tagDistribution
  const _eData = (data.value?.focusDistribution || [])?.map((el: any) => ({
    ...el,
    name: el.tagName,
    value: el.tagC
  }))
  return {
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
    graphic: generateGraphic(data.value?.tagSumC),
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['45%', '70%'],
        data: _eData,
        // [
        //   { value: 1048, name: '产品体验' },
        //   { value: 950, name: '智能化体验' }
        // ],
        color: defColorList,
        itemStyle: {
          borderWidth: 1,
          borderColor: '#fff'
        },
        label: {
          padding: [-20, -40],
          formatter: (params: any) => {
            return `{a|${params.data.name}} \n {b|${params.percent}%}`
          },
          fontSize: 12,
          lineHeight: 20,
          rich: {
            a: {
              color: 'rgba(0, 0, 0, 0.7)'
            },
            b: {
              color: 'inherit'
            }
          }
        },

        labelLine: {
          // length: 30,
          length2: 40
        },
        labelLayout: {
          // align: 'left',
          verticalAlign: 'bottom'
          // dy: -10
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            // shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowColor: 'white',
            borderColor: 'inherit'
          }
        }
      }
    ]
  }
})

const echartOptions2 = computed(() => {
  const tempMap = new Map()

  data.value?.focusDistribution?.forEach((element: any, index: number) => {
    tempMap.set(element.secondCode, defColorList[index])
  })

  const _eData = (data.value?.tagDistribution || [])?.map((el: any) => {
    let ccolor = el.ccolor
    if (!ccolor) {
      ccolor = tempMap.get(el.firstCode)
    }

    return {
      ...el,
      name: el.tagName,
      value: el.tagC,
      ccolor
    }
  })
  const nameData = (data.value?.tagDistribution || [])?.map((el: any) => el.tagName)

  const maxValue = findValueByArr(_eData)
  return {
    title: {
      show: false
    },
    grid: {
      left: 40,
      top: 20,
      right: 20,
      bottom: 40
    },
    tooltip: {
      trigger: 'item',
      position: function (point: any, params: any, dom: any, rect: any, size: any) {
        return toolTipPosition(point, params, dom, rect, size)
      },
      formatter: (params: any) => {
        return defTooltip('bar', params)
      },
      padding: 0,
      borderWidth: 0,
      borderColor: 'rgba(0, 0, 0, 0)'
    },
    xAxis: {
      type: 'category',
      // 触发事件
      triggerEvent: true,
      axisLine: {
        show: true,
        lineStyle: {
          type: 'dashed'
        }
      },
      // data: ['外观', '智能座舱', '智能驾驶', '性能', '三电']
      data: nameData,
      axisLabel: {
        interval: 0,
        // rotate: 40
        formatter: (value: any) => {
          return handleStrBySliceNum(value, 5)
        }
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false
      },
      axisLabel: {
        formatter: (value: any) => {
          return formatNumberByMaxValue2Unit(value, maxValue)
          // return value
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    // color: defColorList,
    series: [
      {
        type: 'bar',
        // color: ['#55AEE5', '#19C9D4', '#2C9BDE', '#48D4DD', '#2C9BDE', '#94DA94', '#EDD758'],
        // data: [863, 541, 490, 356, 279],
        data: _eData,
        barWidth: 20,
        label: {
          show: true,
          position: 'top',
          fontSize: '12px',
          color: 'rgba(0,0,0,0.7)',
          lineHeight: 14,
          formatter: '{c}'
        },
        itemStyle: {
          color: function (params: any) {
            return params?.data?.ccolor
            // if (params.dataIndex >= defColorList.length) {
            //   const index = params.dataIndex - defColorList.length
            //   return defColorList[index]
            // }
            // return defColorList[params.dataIndex]
          }
        }
      }
    ]
  }
})

/**
 * @description: 根据意图查询
 * @param {*} intention
 * @return {*}
 */
const handleQuery = (intention?: string) => {
  let str = intention
  if (intention) {
    str = ['all', '全部意图'].includes(intention) ? undefined : intention
  }

  init(str)
}

defineExpose({ handleQuery })
</script>

<style lang="scss" scoped>
.product-distribution {
  /* padding: 0 16px; */
  width: 100%;
}
</style>
