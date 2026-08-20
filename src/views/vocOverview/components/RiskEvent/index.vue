<template>
  <div class="risk-wrapper">
    <div class="flex-direction-column align-center mt-20">
      <FEcharts
        :options="echartOptions"
        :empty="!data?.list?.length"
        width="200px"
        height="200px"
        @handleClick="handleClickLink"
      ></FEcharts>
      <div class="font-16 fw-600 lh-24 color-09121f mt-10">
        {{ data?.title || curConfig.title }}
      </div>
    </div>

    <div class="mt-35" style="width: 100%; overflow: auto">
      <!--  :style="{ 'min-width': isUserRisk ? '300px' : '300px' }" -->
      <div>
        <a-grid
          :cols="type === 4 ? 24 : 20"
          class="pt-6 pb-7 bgc-def lh-20 mb-6"
          style="border-radius: 4px 4px 0 0"
        >
          <a-grid-item :span="2" class="text-align-center">
            <span class="color-26292e font-14"></span>
          </a-grid-item>
          <a-grid-item :span="4" class="">
            <span class="color-26292e font-14">等级</span>
          </a-grid-item>
          <a-grid-item v-if="type === 4" :span="4" class="">
            <span class="color-26292e font-14">用户名</span>
          </a-grid-item>
          <a-grid-item v-if="type === 4" :span="8" class="">
            <span class="color-26292e font-14">聚焦问题</span>
          </a-grid-item>
          <a-grid-item v-else :span="8" class="">
            <span class="color-26292e font-14">风险问题</span>
          </a-grid-item>
          <a-grid-item :span="6" class="text-align-center">
            <span class="color-26292e font-14">负面观点数</span>
          </a-grid-item>
        </a-grid>

        <div class="table-body">
          <template v-if="riskDetailList?.length">
            <template v-for="(item, index) of riskDetailList" :key="index">
              <a-grid
                :cols="isUserRisk ? 24 : 20"
                class="py-14 lh-20"
                :class="[index % 2 === 0 ? 'bgc-f9f9f9' : '']"
              >
                <a-grid-item :span="2" class="text-align-center flex-xy-center">
                  <span class="color-26292e font-14">{{ index + 1 }}</span>
                </a-grid-item>
                <a-grid-item :span="4" class="flex-align-center">
                  <span :class="riskLevelMap[item.riskLevelS]">{{ item.riskLevelS }}</span>
                </a-grid-item>
                <a-grid-item
                  v-if="isUserRisk"
                  :span="4"
                  class="ellipsis-single-line point pr-10"
                  v-drillDownPerm="permissionCode"
                  @click="handleClickDD(item)"
                >
                  <span class="color-26292e font-14">{{ item.risk }}</span>
                </a-grid-item>
                <a-grid-item v-if="isUserRisk" :span="8" class="flex-align-center">
                  <div class="flex-1 ellipsis-single-line">
                    <a-tooltip :content="item.focusName">
                      <span class="color-26292e font-14">{{ item.focusName }}</span>
                    </a-tooltip>
                  </div>
                </a-grid-item>
                <a-grid-item
                  v-else
                  :span="8"
                  class="flex-align-center point"
                  v-drillDownPerm="permissionCode"
                  @click="handleClickDD(item)"
                >
                  <div class="flex-1 ellipsis-single-line">
                    <a-tooltip :content="item.risk">
                      <span class="color-26292e font-14">{{ item.risk }}</span>
                    </a-tooltip>
                  </div>
                </a-grid-item>
                <a-grid-item :span="6" class="flex-xy-center">
                  <span class="font-14 color-26292e">{{ item.negativeC }}</span>
                </a-grid-item>
              </a-grid>
            </template>
          </template>
          <template v-else>
            <FEmpty />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defTooltip, toolTipPosition } from '@/utils/echartsConfig'
import { carFill, customerService2Fill, maintenanceLine2, groupFill } from './dataURI'
import { riskLevelMap } from '@/constant'
import useDrillDownStore from '@/stores/modules/drillDown'
import { useRouter } from 'vue-router'
import useComQueryStore from '@/stores/modules/comQuery'
import { value2rem } from '@/utils/rem'

interface Props {
  type: number
  data: Record<any, any> | undefined
  permissionCode?: string // 下钻权限code
}
const { type = 1, data, permissionCode } = defineProps<Props>()

const drillDownStore = useDrillDownStore()

const config = ref<Record<any, any>>({
  1: {
    title: '产品风险',
    icon: carFill
  },
  2: {
    title: '服务风险',
    icon: customerService2Fill
  },
  3: {
    title: '品质风险',
    icon: maintenanceLine2
  },
  4: {
    title: '投诉用户',
    icon: groupFill
  }
})

const isUserRisk = computed(() => type === 4)

const riskDetailList = computed(() => {
  if (data?.list?.[0] && data?.list[0].riskDetail) {
    return data?.list[0].riskDetail
  }
  return []
})

const curConfig = computed(() => config.value[type])

const echartOptions = computed(() => {
  const _eData = (data?.list || [])?.map((el: any) => ({
    ...el,
    name: el.levelName,
    value: el.nsrC
  }))
  return {
    tooltip: {
      show: true,
      trigger: 'item',
      position: (point: any, params: any, dom: any, rect: any, size: any) => {
        return toolTipPosition(point, params, dom, rect, size)
      },
      formatter: (params: any) => {
        return defTooltip('pie-1', params)
      },
      padding: 0,
      borderWidth: 0,
      borderColor: 'rgba(0, 0, 0, 0)'
    },
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: '29%',
        style: {
          text: data?.sumc,
          textAlign: 'center',
          fill: '#272830',
          fontSize: value2rem(29),
          fontWeight: 600,
          lineHeight: value2rem(34)
        }
      },
      {
        type: 'text',
        left: 'center',
        top: '45%',
        style: {
          text: type === 4 ? '预警用户' : '预警次数',
          textAlign: 'center',
          // fill: '#000000',
          fill: '#666',
          fontSize: value2rem(16),
          lineHeight: value2rem(24)
        }
      },
      {
        type: 'image',
        left: '44%',
        top: '58%',
        width: value2rem(24),
        height: value2rem(24),
        style: {
          image: curConfig.value.icon
        }
      }
    ],
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['65%', '90%'],
        data: _eData,
        // [
        //   { value: 1048, name: '产品体验' },
        //   { value: 950, name: '智能化体验' },
        //   { value: 850, name: '智能化体验11' }
        // ],
        color: ['#DD3E3E', '#FF7B2F', '#E9C732'],
        itemStyle: {
          borderWidth: 2,
          // borderColor: '#fff'
          borderColor: '#fff'
          // borderColor: 'rgba(0, 0, 0, 0)'
        },
        emphasis: {
          scale: false
        },
        // emphasis: {
        //   itemStyle: {
        //     shadowBlur: 10,
        //     shadowOffsetX: 0,
        //     shadowColor: 'rgba(0, 0, 0, 0.5)',
        //     color: 'inherit',
        //     borderWidth: 2,
        //     // borderColor: '#000'
        //     borderColor: 'inherit'
        //   }
        // },
        label: {
          show: false
        }
      },
      {
        name: '背景圆环',
        z: -1,
        backgroundColor: '#F0F3FA',
        type: 'pie',
        cursor: 'default',
        radius: ['58%', '97%'],
        legendHoverLink: false,
        silent: true, //不响应和触发鼠标事件
        labelLine: {
          show: false
        },
        data: [
          {
            value: 0,

            itemStyle: {
              color: '#E9EDF4'
            }
          }
        ]
      }
    ]
  }
})

const handleClickDD = (item: any) => {
  drillDownStore.setRiskVisible(true, { ...item, riskType: isUserRisk.value ? 'user' : 'event' })
}

const router = useRouter()
const handleClickLink = (params: any) => {
  console.log('params', params)
  // 首页跳转风险预警播报 需要携带点击饼图的级别  S A D
  if (params?.data?.levelCode) {
    useComQueryStore().setRiskLevelList([params?.data?.levelCode])
  }
  // useComQueryStore().setRiskLevelList(['S'])
  router.push({ name: 'riskWarning' })
}
</script>

<style lang="scss" scoped>
.table-body {
  height: 270px;
  overflow: auto;
}
</style>
