<template>
  <div>
    <div class="mt-40 flex-justify-center">
      <FEcharts :options="echartOptions" width="200px" height="200px"></FEcharts>

      <a-timeline class="custom-timeline mt-35 ml-30">
        <!-- riskColorStrMap -->
        <a-timeline-item
          v-for="(item, index) of data?.list"
          :key="index"
          :dot-color="riskColorStrMap[item.levelName]"
        >
          <div class="flex-align-center">
            <div class="color-000 font-14">{{ item.levelName }}问题</div>
            <div class="line-dashed-d9d9d9-1"></div>
            <div class="color-26292E font-14">{{ item.nsrC }}</div>
          </div>
        </a-timeline-item>
      </a-timeline>
    </div>

    <div class="mt-40">
      <a-grid :cols="24" class="pt-6 pb-7 bgc-def lh-51 mb-6 border-radius4400">
        <a-grid-item :span="2" class="text-align-center">
          <span class="color-26292e font-14"></span>
        </a-grid-item>
        <a-grid-item :span="4" class="">
          <span class="color-26292e font-14">等级</span>
        </a-grid-item>

        <a-grid-item :span="8" class="">
          <span class="color-26292e font-14">风险问题</span>
        </a-grid-item>
        <a-grid-item :span="6" class="text-align-center">
          <span class="color-26292e font-14">负面观点数</span>
        </a-grid-item>
        <a-grid-item :span="4" class="text-align-center">
          <span class="color-26292e font-14">用户数</span>
        </a-grid-item>
      </a-grid>
      <!-- overflow: auto -->
      <div :style="{ height: px2rem('513px') }">
        <template v-if="tableData?.length">
          <a-list
            :style="{ width: `100%` }"
            :bordered="false"
            :split="false"
            class="virtualList-wrapper"
            :virtualListProps="{
              height: virtualHeight
            }"
            :data="tableData"
          >
            <template #item="{ item, index }">
              <a-list-item :key="index">
                <a-grid
                  :key="item"
                  :cols="24"
                  class="py-14 lh-20"
                  :class="[index % 2 === 0 ? 'bgc-f9f9f9' : '']"
                >
                  <!-- riskLevelBgMap -->
                  <a-grid-item :span="2" class="text-align-center flex-xy-center">
                    <span class="color-26292e font-14">{{ index + 1 }}</span>
                  </a-grid-item>
                  <a-grid-item :span="4" class="flex-align-center">
                    <!-- <span class="risk-level-1">一级</span> -->
                    <span :class="riskLevelMap[item.riskLevelS]">{{ item.riskLevelS }}</span>
                  </a-grid-item>

                  <a-grid-item
                    :span="8"
                    class="flex-align-center point"
                    v-drillDownPerm="permissionCode"
                    @click="handleClickDD(item)"
                  >
                    <a-tooltip :content="item?.risk">
                      <span class="color-26292e font-14 ellipsis-single-line">{{ item.risk }}</span>
                    </a-tooltip>
                  </a-grid-item>
                  <a-grid-item :span="6" class="flex-xy-center">
                    <span class="font-14 color-26292e">{{ item.negativeC }}</span>
                  </a-grid-item>
                  <a-grid-item :span="4" class="flex-xy-center">
                    <span class="font-14 color-26292e">{{ item.userC }}</span>
                  </a-grid-item>
                </a-grid>
              </a-list-item>
              <!-- v-for="(item, index) of tableData" -->
            </template>
          </a-list>
        </template>
        <template v-else>
          <FEmpty />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defTooltip, toolTipPosition } from '@/utils/echartsConfig'
import { riskColorStrMap, riskLevelMap } from '@/constant'
import useDrillDownStore from '@/stores/modules/drillDown'
import { px2rem, value2rem } from '@/utils/rem'

interface Props {
  data: Record<any, any>
  tagLabel: any[] | undefined
  permissionCode?: string // 下钻权限code
}
const { data, tagLabel, permissionCode } = defineProps<Props>()

const tableData = ref<Record<any, any>[]>([])
const drillDownStore = useDrillDownStore()
const virtualHeight = ref(value2rem(513))
watchEffect(() => {
  tableData.value = data.list?.[0]?.riskDetail || []
})

const handleVirtualHeight = () => {
  virtualHeight.value = value2rem(513)
}

onBeforeMount(() => {
  window.addEventListener('resize', handleVirtualHeight)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleVirtualHeight)
})

const handleClickDD = (record: any) => {
  drillDownStore.setRiskWarningVisible(true, { ...record, tagLabelList: tagLabel })
}

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
        top: '34%',
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
        top: '50%',
        style: {
          // text: data?.title,
          text: '预警次数',
          textAlign: 'center',
          // fill: '#000000',
          fill: '#666',
          fontSize: value2rem(16),
          lineHeight: value2rem(24)
        }
      }
    ],
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['65%', '90%'],
        data: _eData,
        color: ['#DD3E3E', '#FF7B2F', '#E9C732'],
        itemStyle: {
          borderWidth: 2,
          borderColor: '#fff'
        },
        emphasis: {
          scale: false
        },
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
</script>

<style lang="scss" scoped></style>
