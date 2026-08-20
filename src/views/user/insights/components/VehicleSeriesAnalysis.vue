<template>
  <div class="vehicle-series-analysis mt-18 pt-40">
    <div class="flex-direction-column align-center">
      <!-- <SvgIcon name="car-xuan-yi" width="174px" height="84px"></SvgIcon> -->
      <a-tooltip content-class="tooltipContent" arrow-class="tooltipArrow">
        <template #content>
          <div
            v-html="
              toolTipByTag(
                {
                  icon: false,
                  name: carItem?.carSeriesName,
                  nsrC: carItem?.billC,
                  nsrR: carItem?.carSeriesNsrRp,
                  nsrY: carItem?.carSeriesNsrYp
                },
                {
                  t1Label: '同时提及次数'
                }
              )
            "
          ></div>
        </template>
        <img
          :src="carItem?.carSeriesImage"
          alt=""
          class="point"
          style="width: 174px; height: 84px"
        />
      </a-tooltip>

      <a-tooltip content-class="tooltipContent" arrow-class="tooltipArrow">
        <template #content>
          <div
            v-html="
              toolTipByTag(
                {
                  icon: false,
                  name: carItem?.carSeriesName,
                  nsrC: carItem?.billC,
                  nsrR: carItem?.carSeriesNsrRp,
                  nsrY: carItem?.carSeriesNsrYp
                },
                {
                  t1Label: '同时提及次数'
                }
              )
            "
          ></div>
        </template>
        <div class="point">
          <div class="font-14 lh-24 color-09121f text-align-center">
            {{ carItem?.carSeriesName }}
          </div>
          <div>
            <span class="fw-600 font-15 lh-17 color-000 mr-4">{{ carItem?.billC }}</span>
            <RatioRY :value="carItem?.carSeriesNsrRp"></RatioRY>
          </div>
        </div>
      </a-tooltip>

      <div class="flex-align-center mt-47 mb-16">
        <div class="line-solid-dde3ee-1"></div>
        <div class="font-16 lh-24 color-000 mx-10">同时提及车系TOP10</div>
        <div class="line-solid-dde3ee-1"></div>
      </div>

      <FEcharts
        :empty="carItem?.mentionCarSeries?.length === 0"
        :linkageType="'treemap'"
        :options="echartOptions"
        width="334px"
        height="281px"
        @handleClick="handleClickTreeMap"
      ></FEcharts>

      <div class="flex-align-center mt-41">
        <div class="line-solid-dde3ee-1"></div>
        <div class="font-16 lh-24 color-000 mx-10">同时提及内容TOP10</div>
        <div class="line-solid-dde3ee-1"></div>
      </div>

      <div
        class="flex flex-wrap justify-center mt-18"
        :style="{
          width: px2rem('334px'),
          maxHeight: px2rem('180px'),
          overflowY: contentData?.length ? 'auto' : 'hidden'
        }"
      >
        <template v-if="contentData?.length">
          <template v-for="(item, index) of contentData" :key="index">
            <div
              class="bgc-def radius-2 py-5 px-24 flex-inline ml-item-6 mb-8 point"
              :style="{ height: px2rem('28px') }"
              v-drillDownPerm="permissionCode"
              @click="handleClickDD(item)"
            >
              {{ item.tagName }}&nbsp;({{ item.tagNsrC }})
            </div>
          </template>
        </template>
        <template v-else>
          <FEmpty />
        </template>
      </div>
      <!-- 214 -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { treemapColors } from '@/constant'
import { getLinkedCarSeriesMentionedAnalysis } from '@/service/insights'
import useComQueryStore from '@/stores/modules/comQuery'
import useDrillDownStore from '@/stores/modules/drillDown'
import { toolTipByTreemap, toolTipPosition } from '@/utils/echartsConfig'
import { Message } from '@arco-design/web-vue'
import to from 'await-to-js'
import { toolTipByTag } from '@/utils/echartsConfig'
import { px2rem } from '@/utils/rem'

interface Props {
  carItem: Record<any, any>
  permissionCode?: string // 下钻权限code
}

const { carItem, permissionCode } = defineProps<Props>()
const comQueryStore = useComQueryStore()
const drillDownStore = useDrillDownStore()
const contentData = ref<Record<any, any>[]>([])

watchEffect(() => {
  contentData.value = carItem.mentionContent
})

const mentionCarSeries = ref()

const handleClickTreeMap = (params: any) => {
  mentionCarSeries.value = params.name
  linkage(params.name)
}

const linkage = async (carSeries: string) => {
  const [errs, data] = await to(
    getLinkedCarSeriesMentionedAnalysis({
      ...comQueryStore.requiredForm,
      ...comQueryStore.formByInsights,
      carSeriesList: carItem.carSeriesName ? [carItem.carSeriesName] : undefined,
      mentionCarSeries: carSeries
    })
  )
  if (errs) {
    Message.error(errs.message)
  }
  if (data) {
    contentData.value = data.result || []

    if (contentData.value?.length) {
      contentData.value = contentData.value.map((el: any) => ({
        ...el,
        linked: !!mentionCarSeries.value
      }))
    }
  }
}

// 下钻
const handleClickDD = async (item: any) => {
  drillDownStore.setInsightVisible(true, {
    ...item,
    level: 4,
    mentionCarSeries: item.linked ? mentionCarSeries.value : undefined,
    carSeries: item.linked ? undefined : carItem.carSeriesName,
    carSeriesList: carItem.carSeriesName ? [carItem.carSeriesName] : undefined,
    viewType: 2,
    reportType: 1
  })
}

const echartOptions = computed(() => {
  const _data = carItem?.mentionCarSeries?.map((el: any) => ({
    ...el,
    name: el.carSeriesName || '',
    value: el.carSeriesNsrC || ''
  }))
  return {
    tooltip: {
      trigger: 'item',
      position: (point: any, params: any, dom: any, rect: any, size: any) => {
        return toolTipPosition(point, params, dom, rect, size)
      },
      formatter: (params: any) => {
        return toolTipByTreemap({
          name: params.name,
          color: params.color,
          value: params.value,
          cp: params.data?.carSeriesNsrCp,
          rp: params.data?.carSeriesNsrRp
        })
      },
      padding: 0,
      borderWidth: 0,
      borderColor: 'rgba(0, 0, 0, 0)'
    },
    grid: {
      containLabel: true
    },
    color: treemapColors,
    series: [
      {
        type: 'treemap',
        left: '0%',
        right: '0%',
        top: '0%',
        bottom: '0%',
        roam: false,
        data: _data,
        breadcrumb: {
          show: false
        },
        nodeClick: 'false',
        itemStyle: {
          borderRadius: 4,
          gapWidth: 2,
          color: treemapColors
        },
        label: {
          show: true,
          padding: [0, 0, 0, 16],
          overflow: 'truncate',
          formatter: (params: any) => {
            let data = params.data
            return `{a|${data.value}/}{b|${data.carSeriesNsrCp}%}\n{c|${data.name}}`
          },
          rich: {
            a: {
              fontSize: 18,
              color: '#000'
            },
            b: {
              fontSize: 12,
              color: '#000',
              verticalAlign: 'bottom'
            },
            c: {
              fontSize: 14,
              padding: [7, 0, 0, 0],
              color: '#666'
            }
          }
        },
        emphasis: {
          disabled: true
        },
        labelLayout(params: any) {
          if (params.rect.height < 64) {
            return {
              x: params.rect.x,
              y: params.rect.y + params.rect.height * 0.15,
              align: 'left'
            }
          } else {
            return {
              x: params.rect.x,
              y: params.rect.y + params.rect.height * 0.3,
              align: 'left'
            }
          }
        }
      }
    ]
  }
})
</script>

<style lang="scss" scoped>
.vehicle-series-analysis {
  width: 400px;
  height: 840px;
  /* background: linear-gradient(178deg, #dbe9f4 0%, rgba(255, 255, 255, 0) 87%, #f8fcff 100%); */
  /* vehicleSeriesAnalysisbg */
  /* background: linear-gradient(178deg, #dbe9f4 0%, rgba(255, 255, 255, 1) 25%, #f8fcff 100%); */
  background-image: url('@/assets/bg/vehicleSeriesAnalysisbg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no - repeat;
  border-radius: 8px 8px 8px 8px;

  & + .vehicle-series-analysis {
    margin-left: 24px;
  }
}
</style>
