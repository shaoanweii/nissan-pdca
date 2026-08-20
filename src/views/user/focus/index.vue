<template>
  <div class="page-container">
    <div class="content-header">
      <div class="flex-justify-between align-center">
        <div class="title flex-align-center">
          <span>用户聚焦关注</span>
          <FSwitchGroup
            v-model="focusStore.tagType"
            class="ml-24"
            :group="tagTypeGroup"
            @change="tagTypeChange"
          />
        </div>
        <ComQuery
          controller="userFocusedAttention"
          :displayFields="['time', 'region', 'carSeries', 'channel', 'tagLabel', 'query', 'reset']"
          @change="handleQuery"
        ></ComQuery>
      </div>
      <div class="ch-subtitle mt-7">
        <!-- {{ titleDescription.focus }} -->
        {{ subTitle }}
      </div>
    </div>
    <div class="container">
      <template v-if="isPage">
        <a-grid :cols="3" :colGap="20" class="mt-24">
          <a-grid-item :span="1">
            <FCard
              titleIcon="customer-service-line"
              :toolTipContent="classificationProportion"
              :title="classificationProportionTitle"
              height="538px"
            >
              <div class="flex-xy-center h-full">
                <FEcharts
                  ref="chart1Ref"
                  :options="echartOptions"
                  :empty="!(pieDate?.focusDistribution?.length !== 0)"
                  linkageType="default"
                  width="100%"
                  height="269px"
                  @handleClick="handleClickPie"
                ></FEcharts>
              </div>
            </FCard>
          </a-grid-item>
          <a-grid-item :span="2">
            <FCard
              titleIcon="group-line-1"
              :toolTipContent="focusTop"
              :title="focusTopTitle"
              height="538px"
            >
              <ServiceTop
                ref="serviceTopRef"
                :permission-code="drillDownPermissionCode"
              ></ServiceTop>
            </FCard>
          </a-grid-item>
        </a-grid>

        <FCard
          titleIcon="vip-crown-line"
          :toolTipContent="emotionDistributionStatistics"
          :title="distributionTitle"
          height="990px"
          class="mt-20"
        >
          <EmotionalDistributionStatistics
            ref="emotionalDistributionsRef"
            :permission-code="drillDownPermissionCode"
          />
        </FCard>
      </template>
    </div>

    <focusDD v-model="drillDown.focusVisible"></focusDD>
  </div>
</template>
<script lang="ts" setup>
import ServiceTop from './components/ServiceTop.vue'
import EmotionalDistributionStatistics from './components/EmotionalDistributionStatistics/index.vue'
import focusDD from './components/DrillDown/index.vue'
import useDrillDownStore from '@/stores/modules/drillDown'
import { getClassificationProportion } from '@/service/focus'
import to from 'await-to-js'
import useComQueryStore from '@/stores/modules/comQuery'
import { Message } from '@arco-design/web-vue'
import useFocusStore from '@/stores/modules/focus'
import { defTooltip, toolTipPosition } from '@/utils/echartsConfig'
import { defColorList } from '@/constant'
import useUserStore from '@/stores/modules/user'
import { debounce } from 'lodash-es'
import eventBus from '@/utils/eventBus'
import { usePageLoading } from '@/hooks/usePageLoading'
import { permissionDict } from '@/constant/permissionDict'

const drillDown = useDrillDownStore()
const comQueryStore = useComQueryStore()
const focusStore = useFocusStore()
const userStore = useUserStore()

const isPage = ref(false)
const serviceTopRef = ref()
const emotionalDistributionsRef = ref()

// const currentTagType = ref('SERVICE')

const tagTypeGroup = computed(() => {
  return userStore.appTags?.map((el: any) => ({ label: el.value, value: el.key }))
})

const classificationProportion = computed(() => {
  const map: Record<Common.TagType, any> = {
    PROD: userStore.verbal?.focusProdClassificationProportion,
    SERVICE: userStore.verbal?.focusServiceClassificationProportion,
    QY: userStore.verbal?.focusQYClassificationProportion
  }
  return map[focusStore.tagType]
})

const classificationProportionTitle = computed(() => {
  const map: Record<Common.TagType, any> = {
    PROD: '产品分类占比',
    SERVICE: '服务分类占比',
    QY: '品质分类占比'
  }
  return map[focusStore.tagType]
})

const subTitle = computed(() => {
  const map: Record<Common.TagType, any> = {
    PROD: userStore.verbal?.focusProdSubTitle,
    SERVICE: userStore.verbal?.focusServiceSubTitle,
    QY: userStore.verbal?.focusQYSubTitle
  }
  return map[focusStore.tagType]
})

const emotionDistributionStatistics = computed(() => {
  const map: Record<Common.TagType, any> = {
    PROD: userStore.verbal?.focusProdEmotionDistributionStatistics,
    SERVICE: userStore.verbal?.focusServiceEmotionDistributionStatistics,
    QY: userStore.verbal?.focusQYEmotionDistributionStatistics
  }
  return map[focusStore.tagType]
})

const focusTop = computed(() => {
  const map: Record<Common.TagType, any> = {
    PROD: userStore.verbal?.focusProdFocusTop,
    SERVICE: userStore.verbal?.focusServiceFocusTop,
    QY: userStore.verbal?.focusQYFocusTop
  }
  return map[focusStore.tagType]
})
const focusTopTitle = computed(() => {
  const map: Record<Common.TagType, any> = {
    PROD: '产品观点TOP',
    SERVICE: '服务观点TOP',
    QY: '品质观点TOP'
  }
  return map[focusStore.tagType]
})

const distributionTitle = computed(() => {
  const map: Record<Common.TagType, any> = {
    PROD: '情感分布统计',
    SERVICE: '情感分布统计',
    QY: '严重性等级分布'
  }
  return map[focusStore.tagType]
})

// 添加下钻权限控制
const drillDownPermissionCode = computed(() => {
  const map = {
    PROD: permissionDict.prodOpinionTop,
    SERVICE: permissionDict.servicesOpinionTop,
    QY: permissionDict.qualityOpinionTop
  }
  return map[focusStore.tagType]
})

const { loadStart, loadDone } = usePageLoading()
const init = async () => {
  nextTick(async () => {
    isPage.value = true
    loadStart()
    await getPieData()
    await serviceTopRef.value?.init()
    await emotionalDistributionsRef.value?.init()
    loadDone()
  })
}

const handleQuery = async () => {
  init()
}
const flagTagTyppe = ref()
const tagTypeChange = debounce((val: Common.FSwitchGroupItem<Common.TagType>) => {
  if (val.value === flagTagTyppe.value) return
  comQueryStore.setTagLabelList([])
  flagTagTyppe.value = val.value

  focusStore.setTagType(val.value)
  eventBus.emit('tagTypeChange', val)
  init()
}, 300)

const pieDate = ref()

const getPieData = async () => {
  const [errs, data] = await to(
    getClassificationProportion({
      ...comQueryStore.requiredForm,
      ...comQueryStore.formByFocus,
      tagType: focusStore.tagType
    })
  )
  if (errs) {
    Message.error(errs.message)
  }
  if (data) {
    pieDate.value = data.result
  }
  return data
}

const chart1Ref = ref()
// 级联top20以及折线图
const handleClickPie = (params: any) => {
  const num = params?.value ? params?.value : pieDate.value?.tagSumC
  chart1Ref.value?.customSetOption({ graphic: generateGraphic(num) })

  let _param: any
  if (params.data?.level?.toString() === '1') {
    _param = { labelTypeLevelFirstList: params.name ? [params?.name] : undefined }
  } else if (params.data?.level?.toString() === '2') {
    _param = { labelTypeLevelSecondList: params.name ? [params?.name] : undefined }
  } else if (params.data?.level?.toString() === '3') {
    _param = { labelTypeLevelThreeList: params.name ? [params?.name] : undefined }
  }

  serviceTopRef.value?.init(_param)
}

const generateGraphic = (num: number) => {
  return [
    {
      type: 'text',
      left: 'center',
      top: '42%',
      style: {
        // text: pieDate.value?.tagSumC,
        text: num,
        textAlign: 'center',
        fill: 'rgba(0,0,0,0.9)',
        fontSize: 24,
        fontWeight: 600,
        lineHeight: 28
      }
    },
    {
      type: 'text',
      left: 'center',
      top: '51%',
      style: {
        text: pieDate.value?.title,
        textAlign: 'center',
        fill: '#09121F',
        fontSize: 16,
        lineHeight: 24
      }
    }
  ]
}

const echartOptions = computed(() => {
  // focusDistribution tagDistribution
  const _eData = (pieDate.value?.focusDistribution || [])?.map((el: any) => ({
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
    graphic: generateGraphic(pieDate.value?.tagSumC),
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['45%', '70%'],
        data: _eData,
        // [
        //   { value: 1048, name: '产品体验' },
        //   { value: 950, name: '智能化体验' }
        // ],
        color: defColorList,
        itemStyle: {
          borderWidth: 1,
          borderColor: '#fff'
        },
        label: {
          padding: [-20, -40],
          formatter: (params: any) => {
            return `{a|${params.data.name}} \n {b|${params.percent}%}`
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
          length2: 40
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

eventBus.on('brandChange', () => {
  handleQuery()
})

onBeforeUnmount(() => {
  focusStore.setTagType('PROD')
  eventBus.off('brandChange')
})
</script>
<style lang="scss" scoped></style>
