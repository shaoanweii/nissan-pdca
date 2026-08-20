<template>
  <a-row>
    <a-col flex="563px">
      <!-- 问题类型 -->
      <div class="flex-align-center mb-33">
        <!-- <SvgIcon name="global-line-1" width="24px" height="24px"></SvgIcon> -->
        <div class="font-16 color-09121f mx-8">问题类型</div>
        <!-- <a-tooltip :content="userStore.verbal?.warningProblemTypes">
          <SvgIcon name="information-line" width="16px" height="16px"></SvgIcon>
        </a-tooltip> -->
      </div>

      <QuestionType :data="complainingUserData?.complaintsClassify"></QuestionType>

      <!-- 等级分布 -->
      <div class="flex-align-center mt-63">
        <!-- <SvgIcon name="donut-chart-fill" width="24px" height="24px"></SvgIcon> -->
        <div class="font-16 color-09121f mx-8">等级分布</div>
        <!-- <a-tooltip :content="userStore.verbal?.warningLevelDistribution">
          <SvgIcon name="information-line" width="16px" height="16px"></SvgIcon>
        </a-tooltip> -->
      </div>

      <div class="mt-40 mb-20 flex-justify-center">
        <FEcharts :options="echartOptions" width="200px" height="200px"></FEcharts>

        <a-timeline class="custom-timeline mt-35 ml-30">
          <template
            v-for="(item, index) of complainingUserData?.levelDistribution?.riskDetail"
            :key="index"
          >
            <a-timeline-item :dot-color="riskColorStrMap[item.riskLevelS]">
              <div class="flex-align-center">
                <div class="color-000 font-14">{{ item?.riskLevelS }}问题</div>
                <div class="line-dashed-d9d9d9-1"></div>
                <div class="color-26292E font-14">{{ item.riskC }}</div>
              </div>
            </a-timeline-item>
          </template>

          <!-- <a-timeline-item dot-color="#DD3E3E">
            <div class="flex-align-center">
              <div class="color-000 font-14">一级问题</div>
              <div class="line-dashed-d9d9d9-1"></div>
              <div class="color-26292E font-14">12</div>
            </div>
          </a-timeline-item>
          <a-timeline-item dot-color="#FF7B2F">
            <div class="flex-align-center">
              <div class="color-000 font-14">二级问题</div>
              <div class="line-dashed-d9d9d9-1"></div>
              <div class="color-26292E font-14">12</div>
            </div>
          </a-timeline-item>
          <a-timeline-item dot-color="#E9C732">
            <div class="flex-align-center">
              <div class="color-000 font-14">三级问题</div>
              <div class="line-dashed-d9d9d9-1"></div>
              <div class="color-26292E font-14">12</div>
            </div>
          </a-timeline-item> -->
        </a-timeline>
      </div>
    </a-col>
    <!-- 用户问题列表 -->
    <a-col flex="auto" style="width: 0">
      <a-grid
        :cols="34"
        class="pt-6 pb-7 bgc-def lh-51 mb-6"
        :class="[complainingDetailData?.length > 10 ? 'pr-10' : '']"
        style="border-radius: 4px 4px 0 0"
      >
        <a-grid-item :span="2" class="text-align-center">
          <span class="color-26292e font-14"></span>
        </a-grid-item>
        <a-grid-item :span="3" class="text-align-center">
          <span class="color-26292e font-14">等级</span>
        </a-grid-item>
        <a-grid-item :span="3" class="text-align-center">
          <span class="color-26292e font-14">用户名</span>
        </a-grid-item>
        <a-grid-item :span="3" class="text-align-center">
          <span class="color-26292e font-14">体验指数</span>
        </a-grid-item>
        <a-grid-item :span="3" class="text-align-center" :style="{ minWidth: px2rem('70px') }">
          <span class="color-26292e font-14">负面观点数</span>
        </a-grid-item>
        <a-grid-item :span="3" class="text-align-center">
          <span class="color-26292e font-14">投诉数</span>
        </a-grid-item>
        <a-grid-item :span="4" class="text-align-center">
          <span class="color-26292e font-14">涉及车系</span>
        </a-grid-item>

        <a-grid-item ref="focusRef" :span="13" class="">
          <span class="color-26292e font-14">聚焦问题</span>
        </a-grid-item>
      </a-grid>
      <!-- overflow: auto -->
      <div class="table-body">
        <template v-if="complainingDetailData?.length">
          <!-- v-for="(item, index) of complainingDetailData" -->
          <a-grid
            v-for="(item, index) of complainingDetailData"
            :key="index"
            :cols="34"
            class="py-10 lh-20 color-26292e font-14 point"
            :class="[index % 2 === 0 ? 'bgc-f9f9f9' : '']"
            v-drillDownPerm="props.permissionCode"
            @click="handleClickDD(item)"
          >
            <a-grid-item :span="2" class="text-align-center flex-xy-center">
              <span class="">{{ index + 1 }}</span>
            </a-grid-item>
            <a-grid-item :span="3" class="flex-xy-center">
              <span :class="[riskLevelMap[item.riskLevelS]]">{{ item.riskLevelS }}</span>
            </a-grid-item>
            <a-grid-item :span="3" class="flex-xy-center">
              <div class="ellipsis-single-line">
                {{ item.risk }}
              </div>
            </a-grid-item>
            <a-grid-item :span="3" class="flex-xy-center">
              <!-- <span class="color-dd3e3e">{{ item.riskNsrC }}</span> -->
              <div class="ellipsis-single-line color-dd3e3e">
                {{ item.riskNsrC }}
              </div>
            </a-grid-item>

            <a-grid-item :span="3" class="flex-xy-center">
              <span class="">{{ item.negativeC }}</span>
            </a-grid-item>
            <a-grid-item :span="3" class="flex-xy-center">
              <span class="">{{ item.complainC }}</span>
            </a-grid-item>
            <a-grid-item :span="4" class="flex-xy-center">
              <!-- <span class="">{{ item.carSeriesName }}</span> -->
              <div class="ellipsis-single-line">
                {{ item.carSeriesName }}
              </div>
            </a-grid-item>
            <a-grid-item :span="13" class="flex-align-center flex-wrap">
              <div
                v-for="(subItem, index) of item.newFocusList"
                :key="index"
                class="py-6 px-9 radius-2 bgc-def font-14 lh-16 color-6e7b91 ml-item-6"
              >
                {{ subItem.focusName }} ({{ subItem.focusC }})
              </div>
              <!--  v-if="item.focusList?.length > 2" -->
              <div
                v-if="item.newIsMore"
                class="py-6 px-9 radius-2 bgc-def font-14 lh-16 color-6e7b91 ml-item-6"
              >
                ...
              </div>
            </a-grid-item>
          </a-grid>
          <!-- <a-list
            :style="{ width: `100%` }"
            :bordered="false"
            :split="false"
            class="virtualList-wrapper"
            :virtualListProps="{
              height: 513
            }"
            :data="complainingDetailData"
          >
            <template #item="{ item, index }">
              <a-list-item :key="index"> </a-list-item>
            </template>
          </a-list> -->
        </template>
        <template v-else>
          <FEmpty />
        </template>
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import QuestionType from './components/QuestionType.vue'
import to from 'await-to-js'
import { complaintsDetail, getComplainingUser } from '@/service/riskWarning'
import useComQueryStore from '@/stores/modules/comQuery'
import { Message } from '@arco-design/web-vue'
import { defTooltip, toolTipPosition } from '@/utils/echartsConfig'
import { riskColorStrMap, riskLevelMap } from '@/constant'
import useDrillDownStore from '@/stores/modules/drillDown'
import { px2rem, value2rem } from '@/utils/rem'

const comQueryStore = useComQueryStore()
const complainingUserData = ref()
const complainingDetailData = ref()
const drillDownStore = useDrillDownStore()

// 接收下钻权限code
interface Props {
  permissionCode?: string
}
const props = defineProps<Props>()

const focusRef = ref()
// const focusList = [
//   {
//     focusName: '方方向盘方向盘向盘方向盘抖动1',
//     focusC: '1'
//   },
//   {
//     focusName: '抖动2',
//     focusC: '1'
//   },
//   {
//     focusName: '抖动3',
//     focusC: '1'
//   },
//   {
//     focusName: '方向盘抖动4',
//     focusC: '1'
//   }
// ]

const init = async () => {
  const [errs, data] = await to(
    getComplainingUser({ ...comQueryStore.requiredForm, ...comQueryStore.formByWarning })
  )
  if (errs) {
    Message.error(errs.message)
  }
  if (data) {
    complainingUserData.value = data.result
  }

  const [errs1, data1] = await to(
    complaintsDetail({ ...comQueryStore.requiredForm, ...comQueryStore.formByWarning })
  )
  if (errs1) {
    Message.error(errs1.message)
  }
  if (data1) {
    complainingDetailData.value = data1.result

    nextTick(() => {
      complainingDetailData.value?.forEach((item: any) => {
        // const result = handleFocusColumn(focusList)
        const result = handleFocusColumn(item.focusList)
        item.newFocusList = result.list
        item.newIsMore = result.isMore
      })
    })
  }
}

const focusColumnWidth = computed(() => {
  return focusRef.value?.domRef?.offsetWidth
})

/**
 * @description: 计算字符宽度
 * @param {*} arr
 * @return {*}
 */
const handleFocusColumn = (arr: any) => {
  const moreWidth = 30
  const totalWidth = focusColumnWidth.value - moreWidth
  const padding = 18
  const marginLeft = 6
  const itemStrWidth = 12
  let strTotal = 0
  const resultList = []
  let isMore = false
  for (let index = 0; index < arr.length; index++) {
    const item = arr[index]
    const str = `${item.focusName} (${item.focusC})`?.replace(/\s/g, '')
    let itemStrTotal = 0
    if (index > 0) {
      itemStrTotal = str.length * itemStrWidth + marginLeft + padding
    } else {
      itemStrTotal = str.length * itemStrWidth + padding
    }
    // 当该行字符宽度大于总宽度，结束循环
    if (strTotal + itemStrTotal > totalWidth) {
      isMore = true
      break
    } else {
      strTotal += itemStrTotal
      resultList.push(item)
    }
  }
  return {
    list: resultList,
    isMore
  }
}

const handleClickDD = (record: any) => {
  drillDownStore.setRiskWarningVisible(true, { ...record, riskType: 'user' })
}

const echartOptions = computed(() => {
  const data = complainingUserData.value
  const _eData = (data?.levelDistribution?.riskDetail || [])?.map((el: any) => ({
    ...el,
    name: el.riskLevelS,
    value: el.riskC
  }))
  return {
    tooltip: {
      show: true,
      trigger: 'item',
      position: (point: any, params: any, dom: any, rect: any, size: any) => {
        return toolTipPosition(point, params, dom, rect, size)
      },
      formatter: (params: any) => {
        return defTooltip(
          'pie-1',
          {
            color: params.color,
            name: params.name,
            value: params.value,
            percent: params.data.riskP,
            data: {
              nsrRp: params.data.riskRp,
              nsrYp: params.data.riskYp
            }
          },
          { t1Label: '用户数' }
        )
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
          text: data?.levelDistribution?.nsrSumC,
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
          // text: data?.levelDistribution?.title,
          text: '预警用户',
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

defineExpose({ init })
</script>

<style lang="scss" scoped>
.table-body {
  height: 513px;
  overflow: auto;
}
</style>
