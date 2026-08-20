<template>
  <a-grid :cols="10" :col-gap="6" class="h-full pt-12">
    <a-grid-item :span="4">
      <div style="width: 100%; height: 100%" ref="chartWrapperRef">
        <FEcharts
          v-if="isShowEcharts"
          :options="echartOptions"
          width="100%"
          height="100%"
        ></FEcharts>
      </div>
    </a-grid-item>
    <a-grid-item :span="6" style="width: 100%; overflow: auto">
      <!-- style="min-width: 254px" -->
      <div>
        <a-grid
          :cols="16"
          class="pt-6 pb-7 mb-6 bgc-def border-radius4400"
          :class="{ 'pr-10': data?.length > 6 }"
        >
          <!-- @click="linkToExperience" -->
          <a-grid-item :span="4" class="text-align-left pl-5 point">
            <span class="color-09121f font-14 lh-20">区域</span>
          </a-grid-item>
          <a-grid-item :span="4" class="">
            <span class="color-26292e font-14 lh-20">体验指数</span>
          </a-grid-item>
          <a-grid-item :span="4" class="text-align-right">
            <span class="color-26292e font-14 lh-20 pr-18">环比</span>
          </a-grid-item>
          <a-grid-item :span="4" class="text-align-right">
            <span class="color-26292e font-14 lh-20 pr-23">同比</span>
          </a-grid-item>
        </a-grid>
        <div class="table-body">
          <template v-if="data?.length">
            <template v-for="(item, index) of data" :key="index">
              <a-grid :cols="16" class="py-10 lh-24" :class="{ 'bgc-f9f9f9': index % 2 === 0 }">
                <a-grid-item :span="4" class="text-align-left pl-5 point" @click="handleLink(item)">
                  <a-tooltip :content="item.area">
                    <span class="color-09121f font-14">{{
                      handleStrBySliceNum(item.area, 3)
                    }}</span>
                  </a-tooltip>
                </a-grid-item>
                <a-grid-item :span="4" class="flex-align-center">
                  <!-- <SvgIcon
                  v-if="emitionMap[item.nsrG]"
                  :name="emitionMap[item.nsrG]"
                  width="16px"
                  height="16px"
                ></SvgIcon>
                <span class="color-009949 font-14 ml-7">{{ item.nsrC }}</span> -->
                  <ExperienceIndex :emitionType="item.nsrG" :num="item.nsrC"></ExperienceIndex>
                </a-grid-item>
                <a-grid-item :span="4" class="flex-x-end-y-center color-dd3e3e">
                  <RatioRY :value="item.nsrRp"></RatioRY>
                </a-grid-item>
                <a-grid-item :span="4" class="flex-x-end-y-center color-009949 pr-5">
                  <RatioRY :value="item.nsrYp"></RatioRY>
                </a-grid-item>
              </a-grid>
            </template>
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
import * as echarts from 'echarts'
import china from '@/utils/china.json'
import useComQueryStore from '@/stores/modules/comQuery'
import { defTooltip } from '@/utils/echartsConfig'
import { handleStrBySliceNum } from '@/utils'
import { useRouter } from 'vue-router'

interface Props {
  data: Record<any, any>[]
  mapData: Record<any, any>[] | undefined
}

const { data, mapData } = defineProps<Props>()

echarts.registerMap('china', china as any)

const isShowEcharts = ref(false)

onMounted(() => {
  nextTick(() => {
    isShowEcharts.value = true
  })
})

const router = useRouter()
const handleLink = (record: any) => {
  useComQueryStore().setAreaIds(record?.provinceCodes || [])
  router.push({
    name: 'experience'
  })
}

// const linkToExperience = () => {
//   useComQueryStore().linkToExperience()
// }

const echartOptions = computed(() => {
  // let maxValue = 100
  // if (mapData?.length) {
  //   maxValue = Math.max(...mapData?.map((el: any) => el.nsrC))
  // }

  const _data = mapData?.map((el: any) => ({
    ...el,
    nsrC: el.nsrC ? Number(el.nsrC) : el.nsrC
  }))

  return {
    tooltip: {
      show: true,
      padding: 0,
      borderWidth: 0,
      borderColor: 'rgba(0, 0, 0, 0)',
      formatter: (params: any) => {
        return defTooltip('map', params)
      }
    },
    visualMap: {
      type: 'continuous',
      min: -100,
      // max: maxValue,
      max: 100,
      left: 'left',
      // bottom: 30,
      text: ['', '体验指数'],
      calculable: true,
      align: 'right',
      orient: 'horizontal',
      // itemWidth: 10,
      itemHeight: 84,
      inRange: {
        color: ['#C4E8FE', '#2B4664']
      },
      show: true
    },
    geo: {
      map: 'china',
      roam: false,
      scaleLimit: {
        min: 1,
        max: 2
      },
      zoom: 1.3,
      top: 80,
      bootom: 80,
      label: {
        show: false
      },
      itemStyle: {
        borderColor: '#fff',
        areaColor: '#d6dfea'
      },
      emphasis: {
        label: {
          show: false
        },
        itemStyle: {
          areaColor: '#00B0F0',
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          borderWidth: 0
        }
      },
      select: {
        label: {
          show: false
        },
        itemStyle: {
          areaColor: '#00B0F0',
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          borderWidth: 0
        }
      }
    },
    dataset: {
      dimensions: ['areaCode', 'nsrC'],
      source: _data
    },
    series: [
      {
        name: '体验指数',
        type: 'map',
        geoIndex: 0
      }
    ]
  }
})
</script>

<style lang="scss" scoped>
.table-body {
  height: 279px;
  overflow: auto;
}
</style>
