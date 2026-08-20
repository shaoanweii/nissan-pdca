<template>
  <div class="question-type">
    <template v-for="(item, index) of data" :key="index">
      <a-tooltip content-class="tooltipContent" arrow-class="tooltipArrow">
        <template #content>
          <div
            v-html="
              toolTipByStatistics({
                icon: true,
                color: tagTypeBgColorStrs[item.labelType],
                name: `${item.title}`,
                nsrC: item.nsrSumC,
                p: item.nsrP,
                nsrR: item.nsrRp,
                nsrY: item.nsrYp
              })
            "
          ></div>
        </template>
        <div
          v-if="item.nsrP"
          class="text-align-center font-16 qt-item"
          :style="{ width: `${item.nsrP}%`, minWidth: '20%' }"
        >
          <div :class="tagTypeBgColors[item.labelType]" class="lh-28 py-4 color-fff qti-num">
            {{ item.nsrP }}%
          </div>
          <div class="color-000-07 lh-28 mt-4">{{ item.title }}</div>
        </div>
      </a-tooltip>
    </template>

    <!-- <div class="text-align-center font-16 qt-item" style="width: 18.21%">
      <div class="bg-55aee5 lh-28 py-4 color-fff qti-num">18.21%</div>
      <div class="color-000-07 lh-28 mt-4">产品类</div>
    </div>
    <div class="text-align-center font-16 qt-item" style="width: 51.69%">
      <div class="bg-25c1c8 lh-28 py-4 color-fff qti-num">51.69%</div>
      <div class="color-000-07 lh-28 mt-4">服务类</div>
    </div>
    <div class="text-align-center font-16 qt-item" style="width: 30.1%">
      <div class="bg-79d089 lh-28 py-4 color-fff qti-num">30.10%</div>
      <div class="color-000-07 lh-28 mt-4">品质类</div>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { tagTypeBgColors, tagTypeBgColorStrs } from '@/constant'
import { toolTipByStatistics } from '@/utils/echartsConfig'

interface Props {
  data: Record<any, any>[] | undefined
}
const { data } = defineProps<Props>()
</script>

<style lang="scss" scoped>
.question-type {
  border: 8px;
  overflow: hidden;
  margin: 0 102px 0 26px;
  display: flex;
  .qt-item {
    & + .qt-item {
      margin-left: 2px;
    }
    &:first-child {
      .qti-num {
        border-radius: 8px 0 0 8px;
      }
    }
    &:last-child {
      .qti-num {
        border-radius: 0 8px 8px 0;
      }
    }
  }
}
</style>
