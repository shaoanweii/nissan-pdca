<template>
  <div class="w-full h-full">
    <FEcharts
      :options="echartOptions"
      :empty="!(pieData?.length !== 0)"
      width="100%"
      height="100%"
      @handleClick="handleClickPie"
    ></FEcharts>
  </div>
</template>

<script lang="ts" setup>
import { defColorList } from '@/constant'
import { findCarSeriesProportion, findRegionProportion } from '@/service/praise'
import useComQueryStore from '@/stores/modules/comQuery'
import useDrillDownStore from '@/stores/modules/drillDown'
import { defTooltip, toolTipPosition } from '@/utils/echartsConfig'
import { Message } from '@arco-design/web-vue'
import to from 'await-to-js'
import { hasDrillDownPermission } from '@/utils/permission'

interface Props {
  chartType: 'CAR_SERIES' | 'AREA'
  permissionCode?: string
}
const { chartType, permissionCode } = defineProps<Props>()

const comQuery = useComQueryStore()
const pieData = ref<any[]>([])
const drillDown = useDrillDownStore()

const api = computed(() => {
  const apiMap: Record<string, any> = {
    CAR_SERIES: findCarSeriesProportion,
    AREA: findRegionProportion
  }

  return apiMap[chartType]
})

const params = computed(() => {
  const map: Record<any, any> = {
    CAR_SERIES: { labelTypeList: ['PROD'] },
    AREA: { labelTypeList: ['SERVICE'] }
  }
  return map[chartType]
})

const query = async () => {
  const [errs, data] = await to(
    api.value({ ...comQuery.requiredForm, ...comQuery.formByPraise, ...params.value })
  )

  if (errs) {
    Message.error(errs.message)
  }
  if (data) {
    pieData.value = (data as any)?.result
  }
}

/**
 * @description: 点击饼图下钻
 * @param {*} params
 * @return {*}
 */
const handleClickPie = async (params: any) => {
  // 检查是否有下钻权限
  if (permissionCode && !hasDrillDownPermission(permissionCode)) return

  console.log('params', params)
  const viewType = chartType === 'AREA' ? 1 : 2
  const labelType = chartType === 'AREA' ? 'SERVICE' : 'PROD'
  drillDown.setPraiseVisible(true, { ddTitle: params.name, ...params, viewType, labelType })
}

const label = {
  show: true,
  padding: [-18, -55],
  formatter: (params: any) => {
    // return `{a|${params.data.name}} \n {b|${params.data.value}} \n {b|${params.percent}%}`
    return `{a|${params.data.name}} \n {b|${params.data.value}} {c|(${params.data.tagP}%)}`
    // return `{a|${params.data.name}} \n {b|${params.data.tagP}%}`
  },
  fontSize: 12,
  lineHeight: 18,
  rich: {
    a: {
      color: 'rgba(0, 0, 0, 0.7)'
    },
    b: {
      color: 'inherit'
    },
    c: {
      marginLeft: 10,
      color: 'inherit'
    }
  }
}

const labelLine = {
  show: true,
  // length: 5,
  length2: 50
}

const emphasis = {
  label: {
    show: true
  },
  labelLine: {
    show: true
  },
  itemStyle: {
    shadowBlur: 10,
    shadowOffsetX: 0,
    // shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowColor: 'white',
    borderColor: 'inherit'
  }
}

const echartOptions = computed(() => {
  const _eData = (pieData.value || [])
    ?.sort((a: any, b: any) => b.tagC - a.tagC)
    ?.map((el: any, index: number) => {
      if (index < 10) {
        el.label = label
        el.labelLine = labelLine
        el.emphasis = emphasis
      }
      return {
        ...el,
        name: el.tagName,
        value: el.tagC
      }
    })

  return {
    tooltip: {
      trigger: 'item',
      position: (point: any, params: any, dom: any, rect: any, size: any) => {
        return toolTipPosition(point, params, dom, rect, size)
      },
      formatter: (params: any) => {
        return defTooltip('pie', {
          ...params,
          percent: params.data.tagP
        })
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
          show: false
        },

        labelLine: {
          show: false
        },
        labelLayout: {
          verticalAlign: 'bottom'
        }
        // emphasis: emphasis
      }
    ]
  }
})

defineExpose({ query })
</script>

<style lang="scss" scoped></style>
