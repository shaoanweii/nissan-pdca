<template>
  <a-row class="h-full">
    <a-col flex="1" class="h-full pt-30">
      <FEcharts
        :options="echartOptions"
        :empty="!(pieData?.length !== 0)"
        linkageType="default"
        width="100%"
        height="90%"
        @handleClick="handleClickPie"
      ></FEcharts>
    </a-col>
    <a-col flex="1" class="pt-30">
      <a-grid
        :cols="22"
        class="pt-6 pb-7 mb-6 bgc-def border-radius4400"
        :class="{ 'pr-10': tableData?.length > 8 }"
      >
        <a-grid-item :span="2" class="text-align-center">
          <span class="color-09121f font-14 lh-20"></span>
        </a-grid-item>
        <a-grid-item :span="6" class="">
          <span class="color-26292e font-14 lh-20">期待分类</span>
        </a-grid-item>
        <a-grid-item :span="4" class="text-align-center">
          <span class="color-26292e font-14 lh-20">观点数</span>
        </a-grid-item>
        <a-grid-item :span="5" class="text-align-right">
          <span class="color-26292e font-14 lh-20 pr-18">环比</span>
        </a-grid-item>
        <a-grid-item :span="5" class="text-align-right">
          <span class="color-26292e font-14 lh-20 pr-23">同比</span>
        </a-grid-item>
      </a-grid>

      <!-- bgc-f9f9f9 -->
      <div class="table-body">
        <template v-if="tableData?.length">
          <a-grid
            v-for="(item, index) of tableData"
            :key="index"
            :class="[index % 2 === 0 ? 'bgc-f9f9f9' : '']"
            :cols="22"
            class="py-10 lh-24"
          >
            <a-grid-item :span="2" class="text-align-center flex-xy-center">
              <span class="font-14" :class="[rankColorMap[index + 1]]">{{ index + 1 }}</span>
            </a-grid-item>
            <a-grid-item
              :span="6"
              class="ellipsis-single-line point"
              v-drillDownPerm="permissionCode"
              @click="handleClickDD(item)"
            >
              <a-tooltip :content="item?.tagName">
                <span class="color-26292e font-14">{{ item?.tagName }}</span>
              </a-tooltip>
            </a-grid-item>
            <a-grid-item :span="4" class="text-align-center">
              <span class="color-26292e font-14">{{ item.tagC }}</span>
            </a-grid-item>
            <a-grid-item :span="5" class="flex-align-center justify-end color-dd3e3e">
              <RatioRY :value="item?.tagRp"></RatioRY>
            </a-grid-item>
            <a-grid-item :span="5" class="flex-align-center justify-end color-009949 pr-5">
              <RatioRY :value="item?.tagYp"></RatioRY>
            </a-grid-item>
          </a-grid>
        </template>
        <template v-else>
          <FEmpty />
        </template>
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { defColorList, rankColorMap } from '@/constant'
import {
  getExpectationDistributionBing,
  getExpectationDistributionDetails
} from '@/service/insights'
import useComQueryStore from '@/stores/modules/comQuery'
import useDrillDownStore from '@/stores/modules/drillDown'
import useInsightsStore from '@/stores/modules/insights'
import { defTooltip, toolTipPosition } from '@/utils/echartsConfig'
import { Message } from '@arco-design/web-vue'
import to from 'await-to-js'

interface Porps {
  tagType: Common.TagType
  permissionCode?: string // 下钻权限code
}

const { tagType, permissionCode } = defineProps<Porps>()

const drillDownStore = useDrillDownStore()
const comQueryStore = useComQueryStore()
const insightsStore = useInsightsStore()
const init = async () => {
  getPieData()
  getTableData()
}

const pieData = ref<any[]>([])
const tableData = ref<any[]>([])
const labelTypeLevelFirst = ref<any>()

/**
 * @description: 获取饼图数据
 * @return {*}
 */
const getPieData = async () => {
  const [errs, data] = await to(
    getExpectationDistributionBing({
      ...comQueryStore.requiredForm,
      ...comQueryStore.formByInsights,
      tagType
    })
  )

  if (errs) {
    Message.error(errs.message)
  }
  if (data) {
    pieData.value = data.result || []
  }
}

/**
 * @description: 根据tagType 获取order
 * @param {*} computed
 * @return {*}
 */
const order = computed(() => {
  const map: Record<string, string> = {
    PROD: insightsStore.prodOrder,
    SERVICE: insightsStore.serviceOrder
  }

  return map[tagType]
})

/**
 * @description: 查询table数据
 * @return {*}
 */
const getTableData = async () => {
  const [errs, data] = await to(
    getExpectationDistributionDetails({
      ...comQueryStore.requiredForm,
      ...comQueryStore.formByInsights,
      tagType,
      labelTypeLevelFirstList: labelTypeLevelFirst.value ? [labelTypeLevelFirst.value] : undefined,
      order: order.value
    })
  )

  if (errs) {
    Message.error(errs.message)
  }
  if (data) {
    tableData.value = data.result || []
  }
}

/**
 * @description: 点击饼图查询table
 * @param {*} params
 * @return {*}
 */
const handleClickPie = async (params: any) => {
  labelTypeLevelFirst.value = params.name
  getTableData()
}

// 下钻
const handleClickDD = async (item: any) => {
  drillDownStore.setInsightVisible(true, {
    ...item,
    level: 4,
    tagType,
    viewType: 1,
    labelTypeLevelFirstList: labelTypeLevelFirst.value ? [labelTypeLevelFirst.value] : undefined,
    reportType: 3
  })
}

const echartOptions = computed(() => {
  const _eData = (pieData.value || [])?.map((el: any) => ({
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
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: 83,
        data: _eData,
        color: defColorList,
        itemStyle: {
          borderWidth: 1,
          borderColor: '#fff'
        },
        label: {
          padding: [-20, -40],
          formatter: (params: any) => {
            return `{a|${params.data.name}} \n {b|${params.data.value}} \n {b|${params.percent}%}`
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
          length2: 50
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

defineExpose({ init, getTableData })
</script>

<style lang="scss" scoped>
.table-body {
  height: 400px;
  overflow: auto;
}
</style>
