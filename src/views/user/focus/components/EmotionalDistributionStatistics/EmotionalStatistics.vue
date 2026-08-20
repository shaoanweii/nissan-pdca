<template>
  <div :class="['emotionalItem', 'radius-8', 'pxy-24', 'flex-none']">
    <div class="font-16 lh-24 color-09121f fw-600 mb-24">{{ title }}</div>

    <FEcharts
      :options="echartOptions2"
      :empty="!itemData?.distributionZhu?.length"
      :isShowXAxisTooltip="true"
      linkageType="default"
      width="100%"
      height="168px"
      @handleClick="handleClickBar"
    ></FEcharts>

    <div class="radius-8 bg-white w-full mt-24 pxy-24 border-radius4400 table-wrapper">
      <a-grid
        :cols="22"
        class="pt-6 pb-7 mb-6 bgc-def"
        :class="{ 'pr-10': tableData?.length > 10 }"
      >
        <a-grid-item :span="2" class="text-align-center">
          <span class="color-09121f font-14 lh-20"></span>
        </a-grid-item>
        <a-grid-item :span="6" class="">
          <span class="color-26292e font-14 lh-20">观点名称</span>
        </a-grid-item>
        <a-grid-item :span="4" class="text-align-center">
          <span class="color-26292e font-14 lh-20">观点数</span>
        </a-grid-item>
        <a-grid-item :span="5" class="text-align-right">
          <span class="color-26292e font-14 lh-20 pr-16">环比</span>
        </a-grid-item>
        <a-grid-item :span="5" class="text-align-right">
          <span class="color-26292e font-14 lh-20 pr-23">同比</span>
        </a-grid-item>
      </a-grid>

      <div class="table-body">
        <template v-if="tableData?.length">
          <a-grid
            v-for="(item, index) of tableData"
            :key="index"
            :class="[index % 2 === 0 ? 'bgc-f9f9f9' : '']"
            :cols="22"
            class="py-8 lh-24"
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
                <span class="color-26292e font-14">{{ item.tagName }}</span>
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { focusEmotionColor, rankColorMap, severityLevelColor } from '@/constant'
import { getEmotionDetail } from '@/service/focus'
import useComQueryStore from '@/stores/modules/comQuery'
import useDrillDownStore from '@/stores/modules/drillDown'
import useFocusStore from '@/stores/modules/focus'
import {
  findValueByArr,
  formatNumber,
  formatNumberByMaxValue2Unit,
  handleStrBySliceNum
} from '@/utils'
import { defTooltip, toolTipPosition } from '@/utils/echartsConfig'
import { Message } from '@arco-design/web-vue'
import to from 'await-to-js'

interface Props {
  title: string
  itemData: Record<any, any>
  permissionCode?: string // 下钻权限code
}
const { title, itemData, permissionCode } = defineProps<Props>()

const comQueryStore = useComQueryStore()
const focusStore = useFocusStore()
const drillDownStore = useDrillDownStore()

const tableData = ref<Record<any, any>[]>([])
const labelTypeLevelList = ref()

watchEffect(() => {
  tableData.value = itemData.distributionDetail
})

const tableParams = computed(() => {
  const tagMap: Record<Common.TagType, any> = {
    SERVICE: { sentimentList: itemData.emotionName ? [itemData.emotionName] : undefined },
    PROD: { sentimentList: itemData.emotionName ? [itemData.emotionName] : undefined },
    QY: { faultLevelList: itemData.emotionName ? [itemData.emotionName] : undefined }
  }
  return tagMap[focusStore.tagType]
})

const getTableData = async (params?: any) => {
  labelTypeLevelList.value = params
  // itemData.emotionName
  const [errs, data] = await to(
    getEmotionDetail({
      ...comQueryStore.requiredForm,
      ...comQueryStore.formByFocus,
      tagType: focusStore.tagType,
      // topicList: topic ? [topic] : undefined
      ...params,
      ...tableParams.value
    })
  )
  if (errs) {
    Message.error(errs.message)
  }
  if (data) {
    tableData.value = data.result
  }
}

const handleClickBar = (params: any) => {
  let _param: any
  if (params.data?.level?.toString() === '1') {
    _param = { labelTypeLevelFirstList: params.name ? [params?.name] : undefined }
  } else if (params.data?.level?.toString() === '2') {
    _param = { labelTypeLevelSecondList: params.name ? [params?.name] : undefined }
  } else if (params.data?.level?.toString() === '3') {
    _param = { labelTypeLevelThreeList: params.name ? [params?.name] : undefined }
  }
  getTableData(_param)
}

const handleClickDD = async (item: any) => {
  drillDownStore.setFocusVisible(true, {
    ...item,
    emotionName: itemData.emotionName,
    labelTypeLevelList: labelTypeLevelList.value
  })
}

const colorMap = computed(() => {
  const tagMap: Record<Common.TagType, any> = {
    SERVICE: focusEmotionColor,
    PROD: focusEmotionColor,
    QY: severityLevelColor
  }
  return tagMap[focusStore.tagType]
})

const echartOptions2 = computed(() => {
  const _eData = (itemData?.distributionZhu || [])?.map((el: any) => ({
    ...el,
    name: el.tagName,
    value: el.tagC
  }))
  const nameData = (itemData?.distributionZhu || [])?.map((el: any) => el.tagName)

  const maxValue = findValueByArr(_eData)

  return {
    title: {
      show: false
    },
    dataZoom: [
      {
        show: _eData?.length > 7,
        type: 'slider',
        height: 20,
        bottom: 8,
        showDetail: false,
        showDataShadow: false
      }
    ],
    grid: {
      left: 40,
      top: 20,
      right: 20,
      bottom: 50
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
      axisTick: {
        show: false
      },
      axisLine: {
        show: true
      },
      data: nameData,
      // 触发事件
      triggerEvent: true,
      axisLabel: {
        // interval: 0,
        // rotate: 40
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
        show: true
      },
      axisLabel: {
        formatter: (value: any) => {
          // return formatNumber(value)
          return formatNumberByMaxValue2Unit(value, maxValue)
        }
      }
    },
    series: [
      {
        type: 'bar',
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
          color: colorMap.value[itemData.emotionName]
        }
      }
    ]
  }
})
</script>

<style lang="scss" scoped>
.emotionalItem {
  width: 503px;
  & + .emotionalItem {
    margin-left: 21px;
  }

  .table-wrapper {
    height: 487px;

    .table-body {
      height: 400px;
      overflow: auto;
    }
  }
}
</style>
