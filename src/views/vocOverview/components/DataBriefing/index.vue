<template>
  <a-grid :cols="3" :col-gap="20">
    <a-grid-item :span="1" class="base-card flex-align-center">
      <div class="ml-20 point ei-wrapper" @click="linkToExperience(1)">
        <a-tooltip content-class="tooltipContent" arrow-class="tooltipArrow">
          <template #content>
            <GaugeTooltip :data="data"></GaugeTooltip>
          </template>
          <div>
            <FEcharts :options="echartOptions2" :width="'256px'" :height="'121px'"></FEcharts>
            <div
              class="eo-wrapper"
              style="position: absolute; top: 58%; left: 50%; transform: translate(-50%, -50%)"
            >
              <div
                class="font-24 color-000 fw-900 text-align-center mt-10"
                :class="[data?.eiNsrG ? emitionColorMap[data?.eiNsrG] : '']"
              >
                {{ formatToTwoDecimal(data?.eiNsrC) || '-' }}
              </div>
              <!-- eiNsrG -->
              <div
                class="font-12 color-000 text-align-center"
                :class="[data?.eiNsrG ? emitionColorMap[data?.eiNsrG] : '']"
              >
                {{ emitionStrMap[data?.eiNsrG] }}
              </div>
              <!-- <div class="text-align-center">
                <span class="font-12 color-999">环比: </span>
                <RatioRY :value="data?.eiNsrRp" :placeholderIcon="false"></RatioRY>
              </div> -->
            </div>
          </div>
        </a-tooltip>

        <div class="eiTitle flex lh-24">
          <div class="color-999 font-10">
            {{ startThresholdValue }}
          </div>
          <!-- <div style="flex: 1" class="text-align-center color-09121f font-14">综合体验指数</div> -->
          <div style="flex: 1" class="eit-content text-align-center color-09121f font-14">
            <div class="eitc-info">{{ data.eiTitle }}</div>
          </div>
          <div class="color-999 font-10">
            {{ endThresholdValue }}
          </div>
        </div>
      </div>

      <div class="ml-10 point" @click="linkToExperience(2)">
        <!-- style="border-left: 2px solid #27c29f" -->
        <div :class="[emitionBorderLftMap[data?.prodNsrG]]" class="pl-12">
          <!-- <div class="color-333 font-14">产品体验指数</div> -->
          <div class="color-333 font-14">{{ data.prodTitle }}</div>

          <div class="mt-5">
            <span class="color-000 font-15 fw-600"> {{ data.prodNsr || '-' }}</span>
            <!-- 'color-009949' : 'color-d92d3c' -->
            <span class="font-12 color-999 ml-8">环比: </span>
            <RatioRY :value="data?.prodNsrRp" class="ml-2"></RatioRY>
          </div>
        </div>
        <!-- style="border-left: 2px solid #ff7b2f" -->
        <div :class="[emitionBorderLftMap[data?.servNsrG]]" class="pl-12 mt-10">
          <!-- <div class="color-333 font-14">服务体验指数</div> -->
          <div class="color-333 font-14">{{ data.servTitle }}</div>

          <div class="mt-5">
            <span class="color-000 font-15 fw-600">{{ data.servNsr || '-' }}</span>
            <!-- 'color-009949' : 'color-d92d3c' -->
            <span class="font-12 color-999 ml-8">环比: </span>
            <RatioRY :value="data?.servNsrRp" class="ml-2"></RatioRY>
          </div>
        </div>
      </div>
    </a-grid-item>
    <a-grid-item :span="2">
      <a-grid :cols="3" :col-gap="20">
        <a-grid-item :span="1" class="base-card">
          <DisplayItem
            class="point"
            icon="group-line-2"
            v-drillDownPerm="permissionDict.usersNum"
            :label="data.userTitle"
            :toolTipContent="userStore.verbal?.viewUserNumber"
            :num="data.userNsrC"
            :ratio="data.userNsrRp"
            @click="handleClick(4)"
          ></DisplayItem>
        </a-grid-item>
        <a-grid-item :span="1" class="base-card">
          <DisplayItem
            class="point"
            icon="file-copy-2-line-1"
            v-drillDownPerm="permissionDict.orderNum"
            :label="data.serverOrderTitle"
            :num="data.serverOrderNsrC"
            :ratio="data.serverOrderNsrRp"
            :toolTipContent="userStore.verbal?.viewBillNumber"
            @click="handleClick(3)"
          ></DisplayItem>
        </a-grid-item>
        <a-grid-item :span="1" class="base-card">
          <DisplayItem
            class="point"
            icon="voiceprint-line-1"
            v-drillDownPerm="permissionDict.opinionNum"
            :label="data.positiveTitle"
            :num="data.positiveNsrC"
            :ratio="data.positiveNsrRp"
            :toolTipContent="userStore.verbal?.viewTopicNumber"
            @click="handleClick(2)"
          ></DisplayItem>
        </a-grid-item>
      </a-grid>
    </a-grid-item>
  </a-grid>
</template>

<script lang="ts" setup>
import useDrillDownStore from '@/stores/modules/drillDown'
import DisplayItem from './components/DisplayItem.vue'
import { emitionBorderLftMap, emitionColorStrMap, emitionColorMap, emitionStrMap } from '@/constant'
import useComQueryStore from '@/stores/modules/comQuery'
import { useUserStoreWithOut } from '@/stores/modules/user'
import { formatToTwoDecimal } from '@/utils/index'
import { cloneDeep } from 'lodash-es'
import GaugeTooltip from './components/GaugeTooltip.vue'
import { px2rem, value2rem } from '@/utils/rem'
import { permissionDict } from '@/constant/permissionDict'

interface Props {
  data: Record<any, any>
}

const { data } = defineProps<Props>()
const userStore = useUserStoreWithOut()
const _Threshold = computed(() => {
  const list = cloneDeep(userStore.exponentialThreshold)
  return list?.sort((a, b) => a.code - b.code)
})

const startThresholdValue: any = computed(() => {
  if (_Threshold.value?.[0]?.startThresholdValue) {
    return Number(_Threshold.value?.[0]?.startThresholdValue).toFixed(0)
  } else {
    return -100
  }
})

const endThresholdValue: any = computed(() => {
  if (_Threshold.value?.[_Threshold.value?.length - 1]?.endThresholdValue) {
    return Number(_Threshold.value?.[_Threshold.value?.length - 1]?.endThresholdValue).toFixed(0)
  } else {
    return 100
  }
})

/**
 * @description: 线性映射 将数值从 -100 至 100 转换为 0 至 100 的方法
 * @param {*} value
 * @return {*}
 */
function convertValue(value: any) {
  return (
    ((value - startThresholdValue.value) * (endThresholdValue.value - 0)) /
      (endThresholdValue.value - startThresholdValue.value) +
    0
  )
}

const echartOptions2 = computed(() => {
  let colors = _Threshold.value?.map((el: any, index: number) => {
    return [convertValue(el.endThresholdValue) / 100, emitionColorStrMap[index]]
  })
  if (colors?.length === 0) {
    colors = [[]]
  }

  let coverColors: any = [
    [convertValue(data.eiNsrC || 1) / 100, 'rgba(0, 0, 0, 0)'],
    [1, 'rgba(0, 0, 0, 0)']
  ]
  if (data.eiNsrC) {
    coverColors = [
      [convertValue(data.eiNsrC || 1) / 100, 'rgba(0, 0, 0, 0)'],
      [1, '#D5EBF8']
    ]
  }
  // 体验指数为空仪表盘置灰
  if (data.eiNsrC === null || data.eiNsrC === undefined) {
    coverColors = [[1, '#D5EBF8']]
  }

  return {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        center: ['50%', '80%'],
        radius: '145%',
        min: convertValue(startThresholdValue.value),
        max: convertValue(endThresholdValue.value),
        axisLine: {
          lineStyle: {
            width: 22,
            color: [[1, '#F0F3FA']]
          }
        },
        pointer: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        title: {
          show: false
        },
        detail: {
          show: false
        },
        data: [
          {
            value: 0.3,
            // value: convertValue(data.eiNsrC),
            name: 'bg'
          }
        ]
      },
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        center: ['50%', '80%'],
        radius: '135%',
        min: 0,
        max: 100,
        splitNumber: 8,
        zIndex: 5,
        axisLine: {
          lineStyle: {
            width: 10,
            color: colors
            // [
            //   [0.3, '#ff7b2f'],
            //   [0.6, '#2C9BDE'],
            //   [0.8, '#29B9C2'],
            //   [1, '#27C29F']
            // ]
          }
        },
        // pointer: {
        //   // show: data.eiNsrC === null || data.eiNsrC === undefined ? false : true,
        //   show: false,
        //   icon: 'image://data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICAgICAgICAgIDxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjgiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIiAvPgogICAgICAgIDwvc3ZnPg==',
        //   length: '12',
        //   width: value2rem(12),
        //   offsetCenter: [0, '-87%'],
        //   itemStyle: {
        //     color: 'auto'
        //   }
        // },
        pointer: {
          show: data.eiNsrC === null || data.eiNsrC === undefined ? false : true,
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '20%',
          width: 12,
          offsetCenter: [0, '-64%'],
          itemStyle: {
            color: 'auto'
          }
        },
        axisTick: {
          show: true,
          splitNumber: 2,
          length: 5,
          distance: -8,
          lineStyle: {
            color: '#fff'
          }
        },

        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        title: {
          show: false
        },
        detail: {
          show: false
        },
        data: [
          {
            // value: data.eiNsrC,
            value: convertValue(data.eiNsrC),
            name: 'Grade Rating'
          }
        ]
      },
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        center: ['50%', '80%'],
        radius: '135%',
        min: 0,
        max: 100,
        splitNumber: 8,
        zIndex: 5,
        axisLine: {
          lineStyle: {
            width: 10,
            color: coverColors
          }
        },
        pointer: {
          show: false
        },
        axisTick: {
          show: true,
          splitNumber: 2,
          length: 5,
          distance: -8,
          lineStyle: {
            color: '#fff'
          }
        },

        splitLine: {
          show: false
        },
        // axisLabel: {
        //   show: false
        // },
        axisLabel: {
          show: false,
          color: '#464646',
          fontSize: 10,
          distance: -40,
          // rotate: 'tangential',
          rotate: 0,
          formatter: function (value: any) {
            console.log('value', value)

            if (value / 100 === 0.875) {
              return '优秀'
            } else if (value / 100 === 0.625) {
              return '良好'
            } else if (value / 100 === 0.375) {
              return '有待提升'
            } else if (value / 100 === 0.125) {
              return '亟需改善'
            }
            return ''
          }
        },
        title: {
          show: false
        },
        detail: {
          show: false
        },
        data: [
          {
            value: convertValue(data.eiNsrC),
            name: 'cover Rating'
          }
        ]
      }
    ]
  }
})

const handleClick = (type: 1 | 2 | 3 | 4) => {
  useDrillDownStore().setVisible(true, { activeTab: type })
}

const linkToExperience = (indexType: 1 | 2) => {
  useComQueryStore().linkToExperience({ indexType })
}
</script>

<style lang="scss" scoped>
.ei-wrapper {
  position: relative;
  width: 256px;
  height: 121px;

  .eiTitle {
    width: 170px;
    position: absolute;
    /* bottom: 4%; */
    bottom: 2%;
    left: 16%;

    .eit-content {
      position: relative;
      width: 100%;
      /* .eitc-info {
        position: absolute;
        left: 0;
        right: 0;
        top: -6px;
        text-align: center;
      } */
    }
  }

  .eo-wrapper {
    width: 101px;
    height: 54px;
    box-shadow: 0px -1px 5px 0px rgba(0, 0, 0, 0.05);
    border-radius: 101px 101px 0 0;
    /* background-color: red; */
  }
}
</style>
