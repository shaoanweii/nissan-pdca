<template>
  <div>
    <div id="liquidFill" ref="liquidFill" style="height: 350px; width: 300px"></div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import 'echarts-liquidfill/src/liquidFill.js'
import shape from './Shape.jpg'

const liquidFill = ref<HTMLElement | null>(null)
const chart = ref<echarts.ECharts | null>(null)
const liquid = ['#287BC8', '#287BC8', '#DDE3EE']

const init = () => {
  chart.value = markRaw(echarts.init(liquidFill.value))

  let data: any = [0.35, 0.35, 0.35]
  let option = {
    series: [
      {
        type: 'liquidFill',
        z: 10,
        // name: '全国就业率', // 系列名称，用于tooltip的显示，legend 的图例筛选
        radius: '66%', // 水球图的半径
        // animationDuration: 300, // 水波初始动画所需要的时间
        animationDurationUpdate: 350, // 水波更新数据动画所需要的时间
        center: ['50%', '40%'], // 水球图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标
        // 水填充图的形状 circle 默认圆形  rect 圆角矩形  triangle 三角形
        // diamond 菱形  pin 水滴状 arrow 箭头状  还可以是svg的path
        shape: 'circle',
        phase: 0, // 波的相位弧度 不设置  默认自动
        direction: 'right', // 波浪移动的速度  两个参数  left 从右往左 right 从左往右
        outline: {
          show: true,
          borderDistance: 0, // 边框线与图表的距离 数字
          itemStyle: {
            opacity: 0, // 边框的透明度   默认为 1
            borderWidth: 2, // 边框的宽度
            shadowBlur: 1, // 边框的阴影范围 一旦设置了内外都有阴影
            shadowColor: '#fff', // 边框的阴影颜色,
            borderColor: liquid[0] // 边框颜色
          }
        },
        // color:
        // 图形样式
        itemStyle: {
          // color: "#9F041B", // 水球显示的背景颜色
          opacity: 0.5, // 波浪的透明度
          shadowBlur: 10 // 波浪的阴影范围
        },
        backgroundStyle: {
          color: 'transparent', // 水球未到的背景颜色
          opacity: 1
        },
        // 图形的高亮样式
        // emphasis: {
        //   itemStyle: {
        //     opacity: 0.8, // 鼠标经过波浪颜色的透明度
        //   },
        // },
        // 图形上的文本标签
        label: {
          fontSize: 24,
          fontWeight: 400,
          color: '#000',
          // position: 'insideTop',
          position: ['50%', '136%'],
          formatter: (pms: any) => {
            return '{title|数据加载中...}' + '\n' + (pms.data * 100).toFixed(0) + '%'
          },
          rich: {
            title: {
              color: '#999',
              fontSize: 18,
              padding: [0, 0, 20, 0]
            }
          }
        },
        color: [
          {
            type: 'linear',
            x: 0,
            y: 1,
            x2: 0,
            y2: 0,
            colorStops: [
              {
                offset: 1,
                color: liquid[1] // 100% 处的颜色
              },
              {
                offset: 0.8,
                color: liquid[1] // 0% 处的颜色F5515F 900c1f
              },
              {
                offset: 0,
                color: liquid[0] // 0% 处的颜色F5515F 900c1f
              }
            ],
            global: false // 缺省为 false
          }
        ],
        data // 系列中的数据内容数组
      }
    ],
    graphic: [
      {
        type: 'image',
        scaleX: 0.66,
        scaleY: 0.66,
        top: '20',
        left: '30',
        z: 1,
        style: {
          image: shape
        }
      }
    ]
  }
  chart.value.setOption(option, {
    notMerge: true
  })

  function fakeCount() {
    data = data.map((item: any) => {
      if (item < 0.95) {
        return (item * 100 + 10) / 100
      }
    })
    option.series[0].data = data
    chart.value?.setOption(option)
    // console.info(data, option.series[0].data)
    if (option.series[0].data[0] === 0.95) clearInterval(timer)
  }
  const timer = setInterval(fakeCount, 350)
}
onMounted(() => {
  init()
  window.addEventListener('resize', handleResize)
})

const handleResize = () => {
  if (chart.value) {
    chart.value?.resize()
  }
}

onUnmounted(() => {
  if (chart) {
    chart.value?.dispose()
  }
  chart.value = null
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped></style>
