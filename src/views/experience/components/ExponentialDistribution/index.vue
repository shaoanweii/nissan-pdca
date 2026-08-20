<template>
  <div>
    <!-- 用户旅途 -->
    <CognitiveProcess
      ref="cognitiveProcessRef"
      class="mt-24"
      @userJourneyChange="userJourneyChange"
    ></CognitiveProcess>
    <!-- 一二级 -->
    <LabelGroup
      ref="labelGroupRef"
      class="mt-24"
      @tagChange="handleTagChange"
      @tagChange2="handleTagChange2"
    ></LabelGroup>
    <FCard
      titleIcon="bookmark-3-line"
      :toolTipContent="userStore.verbal?.testingClassifyIndexRanking"
      title="分类指数排行"
      height="auto"
      :isMore="false"
      class="mt-20"
      style="border: none; padding: 0"
    >
      <!-- 四级 -->
      <div class="mt-20" style="position: relative">
        <FEcharts
          :options="echartOptions"
          width="100%"
          height="604px"
          @handleClick="handleEchartsClick"
        ></FEcharts>
        <div class="text-align-right font-12" style="position: absolute; bottom: -8px; right: 45px">
          观点数
        </div>
      </div>
    </FCard>
  </div>
</template>

<script lang="ts" setup>
import { getIndexedPerformance } from '@/service/experienceTest'
import CognitiveProcess from './components/CognitiveProcess.vue'
import LabelGroup from './components/LabelGroup.vue'
import useComQueryStore from '@/stores/modules/comQuery'
import to from 'await-to-js'
import { Message } from '@arco-design/web-vue'
import useDrillDownStore from '@/stores/modules/drillDown'
import { defTooltip, toolTipByTag, toolTipPosition } from '@/utils/echartsConfig'
import useUserStore from '@/stores/modules/user'
import { emitionColorStrMap1 } from '@/constant'
import { formatToTwoDecimal, isDecimal } from '@/utils'
import { hasDrillDownPermission } from '@/utils/permission'
import { permissionDict } from '@/constant/permissionDict'

const comQuery = useComQueryStore()
const userStore = useUserStore()

const cognitiveProcessRef = ref()
const labelGroupRef = ref()
const query = async () => {
  nextTick(() => {
    cognitiveProcessRef.value?.init()
    labelGroupRef.value?.init()
    getFourTag()
  })
}

const curJourney = ref<Record<any, any>>({})
const curFirstTagName = ref()

/**
 * @description: 用户旅途change
 * @return {*}
 */
const userJourneyChange = async (item: any) => {
  curJourney.value = item
  curFirstTagName.value = null
  labelGroupRef.value?.init(item?.code)
  getFourTag()
}

/**
 * @description: 一级change
 * @return {*}
 */
const handleTagChange = async (item: any) => {
  curFirstTagName.value = item?.tagFirstName
  getFourTag({ labelTypeLevelFirstList: item?.tagFirstName ? [item?.tagFirstName] : undefined })
}
/**
 * @description: 二级change
 * @return {*}
 */
const handleTagChange2 = async (result: any) => {
  const tagFirstName = result[0]?.tagFirstName
  const tagName = result[1]?.tagName
  const params = {
    labelTypeLevelFirstList: tagFirstName ? [tagFirstName] : undefined,
    labelTypeLevelSecondList: tagName ? [tagName] : undefined
  }
  getFourTag(params)
}

const fourTagData = ref<Record<any, any>>()
/**
 * @description: 获取四级
 * @return {*}
 */
const getFourTag = async (labelTypeLevelList?: any) => {
  const [errs, data] = await to(
    getIndexedPerformance({
      ...comQuery.requiredForm,
      ...comQuery.formByTesting,
      userJourneyCode: curJourney.value?.code,
      ...labelTypeLevelList
      // labelTypeLevelFirstList: tagFirstName ? [tagFirstName] : undefined
    })
  )
  if (errs) {
    Message.error(errs.message)
  }
  if (data) {
    fourTagData.value = data.result?.experienceIndex || []
  }
}

/**
 * @description: 点击图表触发下钻
 * @param {*} val
 * @return {*}
 */
const handleEchartsClick = (val: any) => {
  //没有权限不可点击
  if (!hasDrillDownPermission(permissionDict.classificationIndexRanking)) return

  if (val.componentType !== 'series') {
    return
  }
  // console.log('handleEchartsClick', val)
  useDrillDownStore().setIndexVisible(true, {
    ...val,
    userJourneyCode: curJourney.value?.code || undefined,
    labelTypeLevelFirstList: curFirstTagName.value ? [curFirstTagName.value] : undefined
  })
}

// 获取阈值数组
const thresholdNumber = computed(() => {
  // const numList = [0]
  const numList = []
  if (userStore.exponentialThreshold?.[0]?.startThresholdValue) {
    numList.push(userStore.exponentialThreshold[0]?.startThresholdValue)
  }

  userStore.exponentialThreshold.forEach(item => {
    numList.push(+item.endThresholdValue)
  })

  return numList
})

// 区域分割线
const markLineData = computed(() => {
  return thresholdNumber.value.map((el: number) => ({
    yAxis: el,
    emphasis: {
      disabled: true
    },
    lineStyle: { color: '#D0CDCB', type: 'dashed' }
  }))
})

const markAreaData = computed(() => {
  const codeMap: Record<number, string> = {
    1: 'rgba(255,129,0,0.05)',
    2: 'rgba(40,123,200,0.05)',
    3: 'rgba(5,164,179,0.05)',
    4: 'rgba(90,194,93,0.05)'
    // 4: 'rgba(255,129,0,0.05)',
    // 3: 'rgba(40,123,200,0.05)',
    // 2: 'rgba(5,164,179,0.05)',
    // 1: 'rgba(90,194,93,0.05)'
  }
  return userStore.exponentialThreshold?.map((el: any) => {
    return [
      {
        yAxis: +el.startThresholdValue,
        itemStyle: {
          color: codeMap[el.code]
        },
        silent: true
      },
      {
        yAxis: +el.endThresholdValue,
        itemStyle: {
          color: codeMap[el.code]
        },
        silent: true
      }
    ]
  })
})

const echartOptions = computed(() => {
  const _data = fourTagData.value?.map((el: any) => {
    return [
      el.nsrC,
      formatToTwoDecimal(el.tagNsrC),
      el.tagName,
      el.tagNsrR,
      el.tagNsrY,
      el.tagNsrG,
      el.labelType,
      el.opinionC,
      el.opinionRP,
      el.opinionYP
    ]
  })

  return {
    tooltip: {
      trigger: 'item',
      position: (point: any, params: any, dom: any, rect: any, size: any) => {
        return toolTipPosition(point, params, dom, rect, size)
      },
      formatter: (params: any) => {
        if (params.componentType !== 'series') {
          return ''
        }
        // return toolTipByTag({
        //   name: params?.data?.[2],
        //   nsrC: params?.data?.[1],
        //   nsrG: params?.data?.[5],
        //   nsrR: params?.data?.[3],
        //   nsrY: params?.data?.[4]
        // })
        return defTooltip('line-2', [
          {
            axisValue: params?.data?.[2],
            name: '体验指数',
            value: params?.data?.[1],
            g: params?.data?.[5],
            data: {
              rp: params?.data?.[3],
              yp: params?.data?.[4]
            }
          },
          {
            axisValue: params?.data?.[2],
            name: '观点数',
            value: params?.data?.[7],
            data: {
              rp: params?.data?.[8],
              yp: params?.data?.[9]
            }
          }
        ])
      },
      padding: 0,
      borderWidth: 0,
      borderColor: 'rgba(0, 0, 0, 0)'
    },
    xAxis: {
      // name: '观点数',
      splitLine: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        formatter: (value: any) => {
          if (isDecimal(value)) {
            return ''
          }
          return value
        }
      }
      // scale: true
    },
    yAxis: {
      type: 'value',

      name: '体验指数',
      // interval: 1,
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      },
      min: function (value: any) {
        if (value.min === 0) {
          return value.min
        }
        if (value.min === 100) {
          return 90
        }
        // if (value.min === -100) {
        //   return -90
        // }
        let minValue
        if (value.min > 0) {
          minValue = Math.ceil(value.min)
        } else {
          minValue = Math.floor(value.min)
        }
        if (minValue < -100) {
          return -100
        }
        return minValue
      },
      max: function (value: any) {
        const maxValue = Math.ceil(value.max)
        if (maxValue > 100) {
          return 100
        }
        if (maxValue === -100) {
          return -90
        }
        return maxValue
      }
    },
    grid: {
      left: 40,
      top: 30,
      right: 50,
      bottom: 30
    },
    series: [
      {
        symbolSize: 20,
        data: _data,
        type: 'scatter',
        // symbolOffset: ['-50%', '50%'],
        symbolOffset: (val: any) => {
          if (val[1]?.toString() === '100.00') {
            return ['-50%', '50%']
          }
          if (val[1]?.toString() === '-100.00') {
            return ['-50%', '-50%']
          }
        },
        label: {
          show: true,
          position: 'right',
          formatter: function (params: any) {
            return `{b|${params.data[2]}} {a|${params.data[1]}}`
          },
          rich: {
            a: {
              color: 'inherit'
            }
          }
        },
        itemStyle: {
          color: (params: any) => {
            // const cls = ['#27C29F', '#29B9C2', '#2C9BDE', '#FF7B2F']
            return emitionColorStrMap1[params?.data?.[5]]
          }
        },

        markArea: {
          data: markAreaData.value
        },
        markLine: {
          symbol: ['none', 'none'],
          data: markLineData.value,
          label: {
            show: false,
            position: 'start',
            color: '#000'
          }
        }
      }
    ]
  }
})

defineExpose({ query })
</script>

<style lang="scss" scoped></style>
