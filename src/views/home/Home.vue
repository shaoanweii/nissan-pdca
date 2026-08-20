<template>
  <div class="page-container">
    <div class="content-header justify-between">
      <div class="title mr-24">VOC 总览</div>
      <ComQuery></ComQuery>
    </div>
    <div class="container">
      <a-button type="primary" @click="toggle">下钻</a-button>
      <a-button type="primary" @click="togglev1">下钻v1</a-button>

      <FDrawer v-model="visible"></FDrawer>
      <FDrawerv1 v-model="visiblev1"></FDrawerv1>

      <FSwitchGroup
        class="mt-16"
        :group="[
          { label: '指数', value: '1' },
          { label: '提及量', value: '2' }
        ]"
      />

      <FSwitchCard></FSwitchCard>

      <!-- <div class="home-wrapper">努力开发中...</div>
  <i class="ri-arrow-left-up-line" style="font-size: 18px"></i>
  <i class="ri-admin-line"></i> -->
      <a-grid :cols="3" :col-gap="20" class="mt-20">
        <a-grid-item>
          <FCard width="100%">
            <Table1></Table1>
          </FCard>
        </a-grid-item>
        <a-grid-item>
          <FCard width="100%">
            <FEcharts :options="echartOptions" width="calc(100% - 40px)" height="100%"></FEcharts>
          </FCard>
        </a-grid-item>
        <a-grid-item>
          <FCard width="100%">
            <FEcharts :options="echartOptions2" width="calc(100% - 40px)" height="100%"></FEcharts>
          </FCard>
        </a-grid-item>
      </a-grid>

      <a-grid :cols="3" :col-gap="20" class="mt-20">
        <a-grid-item>
          <FCard width="100%">
            <FEcharts :options="echartOptions3" width="100%" height="100%"></FEcharts>
          </FCard>
        </a-grid-item>
        <a-grid-item>
          <FCard width="100%"> </FCard>
        </a-grid-item>
        <a-grid-item>
          <FCard width="100%"> </FCard>
        </a-grid-item>
      </a-grid>
    </div>
  </div>
</template>
<script lang="ts" setup>
import FSwitchGroup from './Components/FSwitchGroup.vue'
import FSwitchCard from './Components/FSwitchCard.vue'
import Table1 from './Components/Table1.vue'
import { useBoolean } from '@/hooks/useBoolean'
import FDrawer from './Components/FDrawer/index.vue'
import FDrawerv1 from './Components/FDrawer/indexv1.vue'

const { value: visible, toggle } = useBoolean()
const { value: visiblev1, toggle: togglev1 } = useBoolean()

const echartOptions = ref({
  title: {
    show: false,
    text: '示例图表'
  },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      type: 'bar',
      data: [120, 200, 150, 80, 70, 110, 130]
    }
  ]
})

const echartOptions2 = ref({
  series: [
    {
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      center: ['50%', '75%'],
      radius: '90%',
      min: 0,
      max: 1,
      splitNumber: 8,
      axisLine: {
        lineStyle: {
          width: 6,
          color: [
            [0.25, '#FF6E76'],
            [0.5, '#FDDD60'],
            [0.75, '#58D9F9'],
            [1, '#7CFFB2']
          ]
        }
      },
      pointer: {
        // icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
        icon: "image://data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18' fill='rgba(255,123,47,1)'%3E%3Cpath d='M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z'%3E%3C/path%3E%3C/svg%3E",
        length: '24',
        width: 24,
        offsetCenter: [0, '-90%'],
        itemStyle: {
          color: 'auto'
        }
      },
      axisTick: {
        length: 15,
        distance: -35,
        lineStyle: {
          color: '#C4C4C4',
          width: 2
        }
      },
      splitLine: {
        length: 15,
        distance: -35,
        lineStyle: {
          color: '#C4C4C4',
          width: 2
        }
      },
      axisLabel: {
        show: false,
        color: '#464646',
        fontSize: 20,
        distance: -60,
        rotate: 'tangential',
        formatter: function (value: any) {
          if (value === 0.875) {
            return 'Grade A'
          } else if (value === 0.625) {
            return 'Grade B'
          } else if (value === 0.375) {
            return 'Grade C'
          } else if (value === 0.125) {
            return 'Grade D'
          }
          return ''
        }
      },
      title: {
        show: false,
        offsetCenter: [0, '-10%'],
        fontSize: 20
      },
      // detail: {
      //   fontSize: 30,
      //   offsetCenter: [0, '-35%'],
      //   valueAnimation: true,
      //   formatter: function (value: any) {
      //     return Math.round(value * 100) + ''
      //   },
      //   color: 'inherit'
      // },
      detail: {
        fontSize: 30,
        offsetCenter: [0, '-35%'],
        valueAnimation: true,
        formatter: function () {
          // value: any
          // return Math.round(value * 100) + '';
          return [
            '{a|这段文本采用样式a}',
            '{b|这段文本采用样式b}这段用默认样式{x|这段用样式x}'
          ].join('\n')
        },
        rich: {
          a: {
            color: 'red',
            lineHeight: 10
          },
          b: {
            backgroundColor: {
              image: 'xxx/xxx.jpg'
            },
            height: 40
          },
          x: {
            fontSize: 18,
            fontFamily: 'Microsoft YaHei',
            borderColor: '#449933',
            borderRadius: 4
          }
        },
        color: 'inherit'
      },
      data: [
        {
          value: 0.3,
          name: 'Grade Rating'
        }
      ]
    }
  ]
})

const echartOptions3 = ref({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    show: false,
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      // radius: '50%',
      radius: ['50%', '70%'],
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})
</script>
<style lang="scss" scoped></style>
