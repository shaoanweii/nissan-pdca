<template>
  <a-grid :cols="2" :col-gap="20" class="mt-14">
    <a-grid-item :span="1">
      <div class="w-full h-full">
        <FEcharts
          :options="echartOptions1"
          :empty="!trendZhu?.length"
          linkageType="default"
          width="100%"
          height="454px"
          @handleClick="(params: any) => handleClickDDByBar(params)"
        ></FEcharts>
      </div>
    </a-grid-item>
    <a-grid-item :span="1">
      <div class="top-table w-full h-full">
        <a-grid
          :cols="24"
          class="bgc-def lh-32 mb-6 border-radius4400"
          :class="{ 'pr-10': tableData?.length > 10 }"
        >
          <a-grid-item :span="2" class="text-align-center">
            <span class="color-26292e font-14"></span>
          </a-grid-item>
          <a-grid-item :span="10" class="">
            <span class="color-26292e font-14">观点名称</span>
          </a-grid-item>

          <a-grid-item :span="4" class="text-align-center">
            <span class="color-26292e font-14">观点数</span>
          </a-grid-item>
          <a-grid-item :span="4" class="text-align-right">
            <span class="color-26292e font-14 lh-20 pr-18">环比</span>
          </a-grid-item>
          <a-grid-item :span="4" class="text-align-right">
            <span class="color-26292e font-14 lh-20 pr-23">同比</span>
          </a-grid-item>
        </a-grid>

        <div class="table-body">
          <template v-if="tableData?.length">
            <a-grid
              v-for="(item, index) of tableData"
              :key="index"
              :cols="24"
              class="lh-20 pt-7 pb-8"
              :class="[index % 2 === 0 ? 'bgc-f9f9f9' : '']"
            >
              <!-- riskLevelBgMap -->
              <a-grid-item :span="2" class="text-align-center flex-xy-center">
                <span
                  class="color-26292e font-14"
                  :class="[rankColorMap[index + 1] ? rankColorMap[index + 1] : '']"
                  >{{ index + 1 }}</span
                >
              </a-grid-item>
              <a-grid-item
                :span="10"
                class="flex-align-center point"
                v-drillDownPerm="permissionCode"
                @click="handleClickDD(item)"
              >
                <div
                  v-if="tagType === 'PROD' && item?.tagFirstLevelName"
                  class="prod-tag flex-none"
                >
                  {{ item?.tagFirstLevelName }}
                </div>
                <div
                  v-if="tagType === 'SERVICE' && item?.tagFirstLevelName"
                  class="service-tag flex-none"
                >
                  {{ item?.tagFirstLevelName }}
                </div>
                <div class="ml-8 ellipsis-single-line">
                  <a-tooltip :content="item?.tagName">
                    <span> {{ item?.tagName }}</span>
                  </a-tooltip>
                </div>
              </a-grid-item>

              <a-grid-item :span="4" class="text-align-center">
                <span>{{ item?.tagC }}</span>
              </a-grid-item>
              <a-grid-item :span="4" class="text-align-right color-dd3e3e">
                <RatioRY :value="item?.tagRp"></RatioRY>
              </a-grid-item>
              <a-grid-item :span="4" class="text-align-right color-009949 pr-5">
                <RatioRY :value="item?.tagYp"></RatioRY>
              </a-grid-item>
            </a-grid>
          </template>
          <template v-else>
            <FEmpty />
          </template>
        </div>
      </div>
    </a-grid-item>
  </a-grid>
</template>

<script lang="ts" setup>
import { findFavorableTopList, findFavorableTopZhu } from '@/service/praise'
import useComQueryStore from '@/stores/modules/comQuery'
import useDrillDownStore from '@/stores/modules/drillDown'
import { findValueByArr, formatNumber, formatNumberByMaxValue2Unit, isDecimal } from '@/utils'
import { toolTipByStatistics, toolTipPosition } from '@/utils/echartsConfig'
import { Message } from '@arco-design/web-vue'
import to from 'await-to-js'
import { rankColorMap } from '@/constant'
import { cloneDeep } from 'lodash-es'

interface Props {
  mapKey?: any
  tagType: string
  tagLabelList: any
  permissionCode?: string
}
const { tagType, tagLabelList, permissionCode } = defineProps<Props>()

const trendZhu = ref()

const drillDown = useDrillDownStore()
const comQuery = useComQueryStore()
const curTag = ref()
const curTagLabelList = ref()
const labelTypeLevelList = ref()

const tableData = ref<any>([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}])
const getZhuData = async () => {
  const [errs, data] = await to(
    findFavorableTopZhu({
      ...comQuery.requiredForm,
      ...comQuery.formByPraise,
      labelTypeList: tagType ? [tagType] : undefined,
      // tagLabelList: curTagLabelList.value
      tagLabelList: tagLabelList
    })
  )
  if (errs) {
    Message.error(errs.message)
  }

  if (data) {
    trendZhu.value = data.result
  }
}

const getTableData = async () => {
  let _param: any
  if (curTag.value?.data?.level?.toString() === '1') {
    _param = {
      labelTypeLevelFirstList: curTag.value.name ? [curTag.value?.name] : undefined,
      tagLabelList: undefined
    }
  } else if (curTag.value?.data?.level?.toString() === '2') {
    _param = {
      labelTypeLevelSecondList: curTag.value.name ? [curTag.value?.name] : undefined,
      tagLabelList: undefined
    }
  } else if (curTag.value?.data?.level?.toString() === '3') {
    _param = {
      labelTypeLevelThreeList: curTag.value.name ? [curTag.value?.name] : undefined,
      tagLabelList: undefined
    }
  } else {
    _param = {
      // tagLabelList: curTagLabelList.value
      tagLabelList: tagLabelList
    }
  }

  labelTypeLevelList.value = cloneDeep(_param)

  delete labelTypeLevelList.value.tagLabelList

  const [errs, data] = await to(
    findFavorableTopList({
      ...comQuery.requiredForm,
      ...comQuery.formByPraise,
      labelTypeList: tagType ? [tagType] : undefined,
      // tagLabelList: curTagLabelList.value,
      tagLabelList: tagLabelList,
      ..._param
    })
  )
  if (errs) {
    Message.error(errs.message)
  }

  if (data) {
    tableData.value = data.result
  }
}

const query = async (tagLabelList?: any[]) => {
  curTag.value = undefined
  // curTagLabelList.value = tagLabelList?.length ? tagLabelList : undefined
  getZhuData()
  getTableData()
}

const handleClickDDByBar = (params: any) => {
  curTag.value = params
  getTableData()
}

const handleClickDD = (record: any) => {
  let _labelTypeLevelList: any = labelTypeLevelList.value

  if (Object.keys(labelTypeLevelList.value)?.length > 0) {
    _labelTypeLevelList = labelTypeLevelList.value
  } else {
    _labelTypeLevelList = {
      labelTypeLevelFirstList: [record.tagFirstLevelName]
    }
  }

  drillDown.setPraiseVisible(true, {
    ddTitle: `${record.tagFirstLevelName ? record.tagFirstLevelName + '#' : ''}${record.tagName}`,
    viewType: tagType === 'PROD' ? 3 : 4,
    tagType,
    ...record,
    labelTypeList: tagType ? [tagType] : undefined,
    labelTypeLevelList: _labelTypeLevelList,
    tagLabelList
  })
}

const echartOptions1 = computed(() => {
  const _data = trendZhu.value?.map((el: any) => ({
    ...el,
    name: el.tagName,
    value: el.tagC
  }))

  const yAxisData = _data?.map((el: any) => el.name)

  const maxValue = findValueByArr(_data)
  return {
    dataZoom: [
      {
        // 设置滚动条的隐藏或显示
        show: true,
        // 设置类型
        type: 'slider',
        // 是否显示detail，即拖拽时候显示详细数值信息
        showDetail: false,
        // 数据窗口范围的起始数值
        startValue: 100,
        // 数据窗口范围的结束数值（一页显示多少条数据）
        endValue: 90,
        // 控制哪个轴，如果是number表示控制一个轴，
        // 如果是Array表示控制多个轴。此处控制第二根轴
        yAxisIndex: [0, 1],
        // empty：当前数据窗口外的数据，被设置为空。
        // 即不会影响其他轴的数据范围
        filterMode: 'empty',
        // 滚动条高度
        width: 3,
        // 滚动条显示位置
        height: '80%',
        // 距离右边
        right: 3,
        // 控制手柄的尺寸
        handleSize: 0,
        // 是否锁定选择区域（或叫做数据窗口）的大小
        zoomLoxk: true,
        // 组件离容器上侧的距离
        // 如果top的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐
        top: 'middle'
      },
      {
        // 没有下面这块的话，只能拖动滚动条，
        // 鼠标滚轮在区域内不能控制外部滚动条
        type: 'inside',
        // 控制哪个轴，如果是number表示控制一个轴，
        // 如果是Array表示控制多个轴。此处控制第二根轴
        yAxisIndex: [0, 1],
        // 滚轮是否触发缩放
        zoomOnMouseWheel: false,
        // 鼠标移动能否触发平移
        moveOnMouseMove: true,
        // 鼠标滚轮能否触发平移
        moveOnMouseWheel: true
      }
    ],
    tooltip: {
      show: true,
      trigger: 'axis',
      position: (point: any, params: any, dom: any, rect: any, size: any) => {
        return toolTipPosition(point, params, dom, rect, size)
      },
      formatter: (params: any) => {
        return toolTipByStatistics({
          icon: true,
          p: params[0]?.data?.tagP,
          color: params[0]?.color,
          name: params[0]?.data?.tagName,
          nsrC: params[0]?.data?.tagC,
          nsrR: params[0]?.data?.tagRp,
          nsrY: params[0]?.data?.tagYp
          // nsrG: params[0]?.data?.nsrG
        })
      },
      padding: 0,
      borderWidth: 0,
      borderColor: 'rgba(0, 0, 0, 0)'
    },
    grid: {
      left: 0,
      top: 20,
      right: 30,
      bottom: 40,
      containLabel: true
    },
    xAxis: {
      type: 'value',
      show: true,
      axisLabel: {
        formatter: (value: any) => {
          // if (isDecimal(value)) {
          //   return ''
          // }
          // return formatNumber(value)
          return formatNumberByMaxValue2Unit(value, maxValue)
        }
      }
    },
    yAxis: {
      type: 'category',
      axisTick: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#DDE3EE'
        }
      },
      axisLabel: {
        color: '#333' // 设置y轴文字颜色
      },
      data: yAxisData
    },
    series: [
      {
        data: _data,
        type: 'bar',
        color: '#2c9bde',
        barWidth: 20,
        label: {
          show: true,
          position: 'right',
          fontSize: '12px',
          color: 'rgba(0,0,0,0.7)',
          lineHeight: 14,
          formatter: '{c}'
        }
      }
    ]
  }
})

defineExpose({ query })
</script>

<style lang="scss" scoped>
.top-table {
  .prod-tag {
    width: 85px;
    height: 24px;
    border-radius: 4px;
    border: 1px solid #2c9bde;
    line-height: 24px;
    font-size: 14px;
    color: #2c9bde;
    text-align: center;
  }
  .service-tag {
    width: 85px;
    height: 24px;
    border-radius: 4px;
    border: 1px solid #19c9d4;
    line-height: 24px;
    font-size: 14px;
    color: #19c9d4;
    text-align: center;
  }
}
.table-body {
  height: 402px;
  overflow: auto;
}
</style>
