<template>
  <div class="w-full radius-8 flex-align-center mt-36" style="overflow: hidden">
    <template v-for="(item, index) of listData" :key="index">
      <a-tooltip content-class="tooltipContent" arrow-class="tooltipArrow">
        <template #content>
          <div
            v-html="
              toolTipByStatistics({
                icon: true,
                color: colorMap[item.emotionName],
                name: `${item.emotionName}${item.emotionP ? `(${item.emotionP}%)` : '-'}`,
                nsrC: item.emotionC || '-',
                p: item.emotionP,
                nsrR: item.emotionRp || '-',
                nsrY: item.emotionYp || '-'
              })
            "
          ></div>
        </template>
        <div
          class="text-align-center color-fff font-16 lh-28 fw-600 ml-item-6 py-10 ellipsis-single-line"
          :class="[lineBg[item.emotionName]]"
          :style="{ width: `${item.widthP}%` }"
          v-if="item.widthP"
        >
          {{ item.emotionName }}{{ item.emotionP ? `(${item.emotionP}%)` : '-' }}
        </div>
      </a-tooltip>
    </template>
  </div>

  <div class="mt-41 flex emotionalStatistics-wrapper">
    <!-- listData?.filter(el => el.emotionP)?.length -->
    <template v-for="(item, index) of listData" :key="index">
      <!-- v-if="item.emotionP" -->
      <EmotionalStatistics
        :item-data="item"
        :title="`${item.emotionName}${titleStr}`"
        :class="[tableBg[item.emotionName]]"
        :permission-code="props.permissionCode"
      ></EmotionalStatistics>
    </template>
  </div>
</template>

<script lang="ts" setup>
import to from 'await-to-js'
import EmotionalStatistics from './EmotionalStatistics.vue'
import { getEmotionDistribution } from '@/service/focus'
import useComQueryStore from '@/stores/modules/comQuery'
import useFocusStore from '@/stores/modules/focus'
import { Message } from '@arco-design/web-vue'
import {
  focusEmotionBgColor,
  focusEmotionBg10Color,
  severityLevelBgColor,
  severityLevelBg10Color,
  focusEmotionColor,
  severityLevelColor
} from '@/constant'
import { toolTipByStatistics } from '@/utils/echartsConfig'

interface Props {
  permissionCode?: string // 下钻权限code
}

const props = defineProps<Props>()

const comQueryStore = useComQueryStore()
const focusStore = useFocusStore()

const titleStr = computed(() => {
  const strMap: Record<Common.TagType, any> = {
    SERVICE: '分类统计',
    PROD: '分类统计',
    QY: '严重性分类统计'
  }
  return strMap[focusStore.tagType]
})

const colorMap = computed(() => {
  const tagMap: Record<Common.TagType, any> = {
    SERVICE: focusEmotionColor,
    PROD: focusEmotionColor,
    QY: severityLevelColor
  }
  return tagMap[focusStore.tagType]
})

const lineBg = computed(() => {
  const tagMap: Record<Common.TagType, any> = {
    SERVICE: focusEmotionBgColor,
    PROD: focusEmotionBgColor,
    QY: severityLevelBgColor
  }
  return tagMap[focusStore.tagType]
})

const tableBg = computed(() => {
  const tagMap: Record<Common.TagType, any> = {
    SERVICE: focusEmotionBg10Color,
    PROD: focusEmotionBg10Color,
    QY: severityLevelBg10Color
  }
  return tagMap[focusStore.tagType]
})

function handleListData(arr: any) {
  const allNull = arr.every(
    (item: any) => item.emotionP === null || item.emotionP === undefined || item.emotionP === ''
  )
  if (allNull) {
    const defaultValue = 100 / arr.length
    return arr.map((el: any) => ({ ...el, widthP: defaultValue.toFixed(2) }))
  } else {
    return arr.map((el: any) => ({ ...el, widthP: el.emotionP }))
  }
  return arr
}

const listData = ref<Record<any, any>[]>([])
const init = async () => {
  const [errs, data] = await to(
    getEmotionDistribution({
      ...comQueryStore.requiredForm,
      ...comQueryStore.formByFocus,
      tagType: focusStore.tagType
    })
  )
  if (errs) {
    Message.error(errs.message)
  }
  if (data) {
    // listData.value = data.result
    listData.value = handleListData(data.result)
  }
}

defineExpose({ init })
</script>

<style lang="scss" scoped>
.emotionalStatistics-wrapper {
  height: 790px;
  overflow-x: auto;
}
</style>
