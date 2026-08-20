<template>
  <FEmpty v-if="empty" :style="{ width: px2rem(width), height: px2rem(height) }" />
  <div
    v-else
    class="chartDom"
    ref="chartDom"
    :style="{ width: px2rem(width), height: px2rem(height) }"
  ></div>
  <!-- <div class="chartDom" ref="chartDom" :style="{ width: width, height: height }"></div> -->
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { cloneDeep } from 'lodash-es'
import { px2rem } from '@/utils/rem'

interface Props {
  width: string
  height: string
  options: any
  empty?: boolean
  linkageType?: 'default' | 'treemap'
  isShowXAxisTooltip?: boolean
}
const {
  width = '100%',
  height = '300px',
  options,
  empty,
  linkageType,
  isShowXAxisTooltip = false
} = defineProps<Props>()
const emits = defineEmits(['handleClick', 'handleDataZoom'])

const chartDom = ref<HTMLElement | null>(null)
const chart = ref<echarts.ECharts | null>(null)

const currentIndex = ref(-1)

const linkageByDefault = (params: any) => {
  const curOption: any = chart.value?.getOption()
  let pieSeries = cloneDeep(curOption?.series?.[0])

  if (params.dataIndex === currentIndex.value) {
    currentIndex.value = -1
    pieSeries.data.forEach((item: any) => {
      item.itemStyle = {
        opacity: 1
      }
    })
    // 更新图表配置以应用新的样式
    chart.value?.setOption({ series: [pieSeries] })
    return false
  } else {
    currentIndex.value = params.dataIndex
    pieSeries.data.forEach((item: any, index: any) => {
      if (index === currentIndex.value) {
        item.itemStyle = {
          opacity: 1
        }
      } else {
        item.itemStyle = {
          opacity: 0.3
        }
      }
    })
    // 更新图表配置以应用新的样式
    chart.value?.setOption({ series: [pieSeries] })
    return true
  }
}

const treemapCurrent = ref(null)
const linkageByTreemap = (params: any) => {
  const curOption: any = chart.value?.getOption()
  let pieSeries = cloneDeep(curOption?.series?.[0])

  if (params.name === treemapCurrent.value) {
    treemapCurrent.value = null
    pieSeries.data.forEach((item: any) => {
      item.itemStyle = {
        opacity: 1
      }
    })
    // 更新图表配置以应用新的样式
    chart.value?.setOption({ series: [pieSeries] })
    return false
  } else {
    treemapCurrent.value = params.name
    pieSeries.data.forEach((item: any) => {
      if (item.carSeriesName === treemapCurrent.value) {
        item.itemStyle = {
          opacity: 1
        }
      } else {
        item.itemStyle = {
          opacity: 0.3
        }
      }
    })
    // 更新图表配置以应用新的样式
    chart.value?.setOption({ series: [pieSeries] })
    return true
  }
}

/**
 * @description: xAxis文本悬浮显示
 * @param {*} chart
 * @return {*}
 */
const extension = (chart: any) => {
  // 注意这里，是以X轴显示内容过长为例，如果是y轴的话，需要把params.componentType == 'xAxis'改为yAxis
  // 判断是否创建过div框,如果创建过就不再创建了
  // 该div用来盛放文本显示内容的，方便对其悬浮位置进行处理
  var elementDiv: any = document.getElementById('extension')
  if (!elementDiv) {
    var div = document.createElement('div')
    div.setAttribute('id', 'extension')
    div.style.display = 'block'
    document.querySelector('html')?.appendChild(div)
  }
  chart?.on('mouseover', function (params: any) {
    if (params.componentType == 'xAxis') {
      if (params.value?.length <= 5) {
        return
      }
      var elementDiv: any = document.querySelector('#extension')
      //设置悬浮文本的位置以及样式
      var elementStyle =
        'position: absolute;z-index: 99999;color: #fff;font-size: 12px;padding: 5px;display: inline;border-radius: 4px;background-color: #303133;box-shadow: rgba(0, 0, 0, 0.3) 2px 2px 8px'
      elementDiv.style.cssText = elementStyle
      elementDiv.innerHTML = params.value
      document.querySelector('html')!.onmousemove = function (event) {
        var elementDiv: any = document.querySelector('#extension')
        var xx = event.pageX - 10
        var yy = event.pageY + 15
        elementDiv.style.top = yy + 'px'
        elementDiv.style.left = xx + 'px'
      }
    }
  })
  chart?.on('mouseout', function (params: any) {
    //注意这里，我是以X轴显示内容过长为例，如果是y轴的话，需要改为yAxis
    if (params.componentType == 'xAxis') {
      var elementDiv: any = document.querySelector('#extension')

      elementDiv.style.cssText = 'display:none'
    }
  })
}

const initChart = () => {
  if (!chartDom.value) return
  chart.value = markRaw(echarts.init(chartDom.value))
  chart.value.setOption(options, {
    notMerge: true
  })

  if (isShowXAxisTooltip) {
    extension(chart.value)
  }

  chart.value?.on('click', (params: any) => {
    let _params = params
    if (linkageType === 'default') {
      const flag = linkageByDefault(params)
      _params = flag ? params : {}
    } else if (linkageType === 'treemap') {
      const flag = linkageByTreemap(params)
      _params = flag ? params : {}
    }
    emits('handleClick', _params)
  })
  chart.value?.on('dataZoom', (params: any) => emits('handleDataZoom', params))

  return chart.value
}

watchEffect(() => {
  // 图表为空时需重置
  if (empty) {
    chart.value = null
  }
  if (!empty && !chart.value) {
    chart.value = initChart()!
  }
})

onMounted(() => {
  chart.value = initChart()!
  window.addEventListener('resize', handleResize)
})

const handleResize = () => {
  if (chart.value) {
    chart.value?.resize()
  }
}

onBeforeUnmount(() => {
  currentIndex.value = -1
})

onUnmounted(() => {
  if (chart) {
    chart.value?.dispose()
  }
  window.removeEventListener('resize', handleResize)
})

watch(
  () => options,
  newOptions => {
    if (chart.value) {
      chart.value.setOption(newOptions, {
        notMerge: true
      })
    }
  },
  { deep: true }
)

const customSetOption = (options: any) => {
  chart.value?.setOption(options)
}

defineExpose({ customSetOption })
</script>

<style lang="scss" scoped></style>
