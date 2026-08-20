<template>
  <!-- <a-grid v-if="false" :cols="7" :col-gap="22" style="height: 210px; overflow: auto">
    <a-grid-item
      v-for="(item, index) of tagList"
      :key="index"
      :span="1"
      class="radius-4 bg-ddf2fc-04"
    >
      <div class="radius-4 bg-1da6ed-015 py-12 text-align-center">
        <div class="font-16 lh-19 color-131b2a" @click="handleTagChange">
          {{ item?.tagFirstName }}
        </div>
        <div
          class="mt-8 pxy-4 font-12 bg-fff-065 radius-4 flex-inline align-center"
          :class="[emitionColorMap[item.tagFirstNsrG]]"
        >
          <SvgIcon :name="emitionMap[item.tagFirstNsrG]" width="16px" height="16px"></SvgIcon>
          <span class="ml-4">{{ item.tagFirstNsrC }}</span>
          <span class="ml-4">表现良好</span>
        </div>
      </div>
      <div class="mt-22 px-26">
        <a-row class="lh-24" v-for="(subItem, subIndex) of item.subordinateTag" :key="subIndex">
          <a-col flex="15px" class="font-14 color-dd3e3e" :class="[rankColorMap[subIndex + 1]]">
            {{ subIndex + 1 }}
          </a-col>
          <a-col flex="auto" class="ml-8 font-12 color-26292e">{{ subItem?.tagName }}</a-col>
          <a-col flex="40px" class="font-12" :class="[emitionColorMap[item.tagFirstNsrG]]">
            {{ subItem?.tagNsrC }}
          </a-col>
        </a-row>
      </div>
    </a-grid-item>
  </a-grid> -->

  <div class="flex" style="overflow-x: auto">
    <!-- bg-ddf2fc-04 -->
    <div
      v-for="(item, index) of tagList"
      :key="index"
      class="radius-4 flex-none ml-item-22"
      :class="[
        item.tagFirstNsrG ? emitionBgColorMap[item.tagFirstNsrG] : 'bg-bfc9dd-01',
        item.disabled ? 'opacity-03' : ''
      ]"
      style="min-width: 203px"
    >
      <!-- bg-1da6ed-015 -->
      <div
        class="radius-4 py-12 text-align-center"
        :class="[item.tagFirstNsrG ? emitionBgColorOp02Map[item.tagFirstNsrG] : 'bg-bfc9dd-02']"
        @click="handleTagChange(item, index)"
      >
        <a-tooltip content-class="tooltipContent" arrow-class="tooltipArrow">
          <template #content>
            <div
              v-html="
                toolTipByTag({
                  name: item?.tagFirstName,
                  nsrC: item?.tagFirstNsrC,
                  nsrG: item?.tagFirstNsrG,
                  nsrR: item?.tagFirstNsrR,
                  nsrY: item?.tagFirstNsrY
                })
              "
            ></div>
          </template>
          <div class="font-16 lh-19 color-131b2a point">
            {{ item?.tagFirstName }}
          </div>
        </a-tooltip>

        <div
          class="mt-8 pxy-4 font-12 bg-fff-065 radius-4 flex-inline align-center"
          :class="[emitionColorMap[item.tagFirstNsrG]]"
        >
          <SvgIcon
            v-if="item.tagFirstNsrG"
            :name="emitionMap[item.tagFirstNsrG]"
            width="16px"
            height="16px"
          ></SvgIcon>
          <span class="ml-4">{{ formatToTwoDecimal(item.tagFirstNsrC) || '-' }}</span>
          <span class="ml-4">{{ item.tagFirstNsrCText }}</span>
        </div>
      </div>
      <div class="py-22 px-26" style="height: 132px">
        <div style="height: 100%; overflow-y: auto">
          <template v-for="(subItem, subIndex) of item.subordinateTag" :key="subIndex">
            <a-tooltip content-class="tooltipContent" arrow-class="tooltipArrow">
              <template #content>
                <div
                  v-html="
                    toolTipByTag({
                      name: subItem?.tagName,
                      nsrC: subItem?.tagNsrC,
                      nsrG: subItem.tagNsrG,
                      nsrR: subItem.tagNsrR,
                      nsrY: subItem.tagNsrY
                    })
                  "
                ></div>
              </template>
              <a-row
                class="lh-24 point"
                :class="[subItem.disabled ? 'opacity-03' : '']"
                @click="handleTagChange2(item, index, subItem, subIndex)"
              >
                <a-col flex="15px" class="font-14" :class="[rankColorMap[subIndex + 1]]">
                  {{ subIndex + 1 }}
                </a-col>
                <!-- ellipsis-single-line -->
                <a-col flex="auto" class="ml-8 font-12 color-26292e">{{
                  handleStrBySliceNum(subItem?.tagName, 4)
                }}</a-col>
                <a-col
                  flex="40px"
                  class="font-12 text-align-right"
                  :class="[emitionColorMap[subItem.tagNsrG]]"
                >
                  {{ formatToTwoDecimal(subItem?.tagNsrC) || '-' }}
                </a-col>
              </a-row>
            </a-tooltip>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getLinkedIndexedDistribution } from '@/service/experienceTest'
import useComQueryStore from '@/stores/modules/comQuery'
import { Message } from '@arco-design/web-vue'
import to from 'await-to-js'
import {
  emitionMap,
  emitionColorMap,
  rankColorMap,
  emitionBgColorOp02Map,
  emitionBgColorMap
} from '@/constant'
import { toolTipByTag } from '@/utils/echartsConfig'
import { handleStrBySliceNum, formatToTwoDecimal } from '@/utils'

const emits = defineEmits(['tagChange', 'tagChange2'])
const comQuery = useComQueryStore()
const tagList = ref<Record<any, any>[]>([])
const disabledFlag = ref(-1)
const secondDisabledFlag = ref('-1')
// const disabledChange = (item: any, index: number) => {
//   if (disabledFlag.value === index && !item.disabled) {
//     tagList.value.forEach((el: any) => {
//       el.disabled = false
//     })
//     disabledFlag.value = -1
//     return undefined
//   }

//   tagList.value.forEach((el: any, i: number) => {
//     if (el.disabled) {
//       el.disabled = false
//     }
//     if (index !== i) {
//       el.disabled = true
//     }
//   })
//   disabledFlag.value = index
//   return item
// }

const disabledChange = (item: any, index: number) => {
  // 重置选择条件
  if (disabledFlag.value === index && !item.disabled) {
    tagList.value.forEach((el: any) => {
      el.disabled = false
    })
    disabledFlag.value = -1
    return undefined
  }

  tagList.value.forEach((el: any, i: number) => {
    if (el.disabled) {
      el.disabled = false
    }
    if (index !== i) {
      el.disabled = true
    }
  })
  disabledFlag.value = index
  return item
}

// 二级标签选择与反选逻辑
const secondDisabledChange = (firstItem: any, firstIndex: number, item: any, index: number) => {
  // 选择的二级非当前选中的一级时, 清除全部选中状态， 并选中当前一级
  if (disabledFlag.value !== firstIndex) {
    tagList.value.forEach((el: any, i: number) => {
      el.disabled = false
      if (firstIndex !== i) {
        el.disabled = true
      }
      el.subordinateTag.forEach((subEl: any) => {
        subEl.disabled = false
      })
    })
    // tagList.value.forEach((el: any, i: number) => {
    //   if (el.disabled) {
    //     el.disabled = false
    //   }
    //   if (firstIndex !== i) {
    //     el.disabled = true
    //   }
    // })
    disabledFlag.value = firstIndex
  }
  // 重置二级选中状态
  if (secondDisabledFlag.value === `${firstIndex}-${index}` && !item.disabled) {
    firstItem.subordinateTag?.forEach((el: any) => {
      el.disabled = false
    })
    secondDisabledFlag.value = '-1'
    // return undefined
    return [firstItem, undefined]
  }
  // 二级选中状态
  firstItem.subordinateTag?.forEach((el: any, i: number) => {
    if (el.disabled) {
      el.disabled = false
    }
    if (index !== i) {
      el.disabled = true
    }
  })
  secondDisabledFlag.value = `${firstIndex}-${index}`
  return [firstItem, item]
}
const handleTagChange = (item: any, index: number) => {
  const result = disabledChange(item, index)
  emits('tagChange', result)
}

const handleTagChange2 = (
  firstItem: any,
  firstIndex: number,
  secondItem: any,
  secondIndex: number
) => {
  const result = secondDisabledChange(firstItem, firstIndex, secondItem, secondIndex)

  emits('tagChange2', result)
}

/**
 * @description: 获取一二级
 * @return {*}
 */
const init = async (userJourneyCode?: string) => {
  const [errs, data] = await to(
    getLinkedIndexedDistribution({
      ...comQuery.requiredForm,
      ...comQuery.formByTesting,
      userJourneyCode
    })
  )
  if (errs) {
    Message.error(errs.message)
  }
  if (data) {
    tagList.value = data.result?.indexedPerformance || []
  }
}

defineExpose({ init })
</script>

<style lang="scss" scoped></style>
