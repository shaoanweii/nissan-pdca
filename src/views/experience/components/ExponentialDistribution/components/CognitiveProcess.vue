<template>
  <a-row v-if="userJourney?.length" class="userJourney-wrapper" :align="`center`">
    <template v-for="(item, index) of userJourney" :key="index">
      <!-- opacity-03 bg-c8e2fa -->
      <a-col
        flex="1"
        class="radius-4 h-full pt-16 text-align-center"
        :class="[emitionBgColorOp02Map[item.nsrG], item.disabled ? 'opacity-03' : '']"
        @click="handleClick(item, index)"
      >
        <a-tooltip content-class="tooltipContent" arrow-class="tooltipArrow">
          <template #content>
            <div v-html="toolTipByTag(item)"></div>
          </template>
          <SvgIcon :name="userJourneyIconMap[item.code]" width="76px" height="76px"></SvgIcon>
        </a-tooltip>

        <div class="mt-4 font-16 lh-19 color-131b2a">
          <a-tooltip content-class="tooltipContent" arrow-class="tooltipArrow">
            <template #content>
              <div v-html="toolTipByTag(item)"></div>
            </template>
            <span class="point">{{ item.name }}</span>
          </a-tooltip>
        </div>
        <!-- color-2bb8c2 -->
        <div
          class="mt-11 pxy-4 font-12 bg-fff-065 radius-4 flex-inline align-center"
          :class="[emitionColorMap[item.nsrG]]"
        >
          <SvgIcon :name="emitionMap[item.nsrG]" width="16px" height="16px"></SvgIcon>
          <span class="ml-4">{{ formatToTwoDecimal(item.nsrC) || '-' }}</span>
          <!-- <span class="ml-4">{{ item.nsrCText }}</span> -->
          <span class="ml-4">{{ thresholdStrMap[item.nsrG] }}</span>
        </div>
      </a-col>
      <a-col flex="20px" v-if="index !== userJourney?.length - 1">
        <SvgIcon name="arrow-right" width="14px" height="62px" class="ml-5 mr-1"></SvgIcon>
      </a-col>
    </template>
  </a-row>
</template>

<script lang="ts" setup>
import { toolTipByTag } from '@/utils/echartsConfig'
import { emitionMap, emitionColorMap, emitionBgColorOp02Map } from '@/constant'
import { getIndexedDistribution } from '@/service/experienceTest'
import to from 'await-to-js'
import useComQueryStore from '@/stores/modules/comQuery'
import { Message } from '@arco-design/web-vue'
import { debounce } from 'lodash-es'
import { formatToTwoDecimal } from '@/utils'
import useUserStore from '@/stores/modules/user'

const emits = defineEmits(['userJourneyChange'])
const comQuery = useComQueryStore()
const userStore = useUserStore()

const userJourneyIconMap: Record<any, any> = {
  know: 'index-i1',
  CarSelection: 'index-i2',
  BuyCar: 'index-i3',
  UseCar: 'index-i4',
  Repurchase: 'index-i5'
}
const disabledFlag = ref(-1)

const disabledChange = (item: any, index: number) => {
  if (disabledFlag.value === index && !item.disabled) {
    userJourney.value.forEach((el: any) => {
      el.disabled = false
    })
    disabledFlag.value = -1
    return undefined
  }

  userJourney.value.forEach((el: any, i: number) => {
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

const handleClick = debounce((item: any, index: number) => {
  const result = disabledChange(item, index)
  emits('userJourneyChange', result)
}, 300)

const userJourney = ref<Record<any, any>[]>([])

/**
 * @description: 阈值中文map
 * @param {*} computed
 * @return {*}
 */
const thresholdStrMap = computed(() => {
  const map: Record<any, any> = {}

  userStore.exponentialThreshold?.forEach(el => {
    map[el.code] = el.value
  })
  return map
})
/**
 * @description: 获取用户旅途
 * @return {*}
 */
const init = async () => {
  const [errs, data] = await to(
    getIndexedDistribution({ ...comQuery.requiredForm, ...comQuery.formByTesting })
  )

  if (errs) {
    Message.error(errs.message)
  }
  if (data) {
    userJourney.value = data.result?.userJourney || []
  }
}

defineExpose({ init })
</script>

<style lang="scss" scoped>
.userJourney-wrapper {
  height: 165px;
}
</style>
