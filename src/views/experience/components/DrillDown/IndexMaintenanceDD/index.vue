<template>
  <a-drawer
    class="f-drawer"
    :width="value2rem(1150)"
    :visible="visible"
    @cancel="handleCancel"
    @open="handleOpen"
    unmountOnClose
  >
    <template #title>
      <span class="fd-title">{{ titleStr }}</span>
    </template>
    <div class="fd-content clear-border" style="overflow-y: auto">
      <div class="f-card h-full flex-direction-column">
        <FDTabs v-model="activeTab" :tabs="tabsList" model="change2" @change2="tabChange"></FDTabs>
        <div class="flex-1 pxy-24" style="height: 0; overflow-y: auto">
          <!-- 指数阈值 -->
          <template v-if="activeTab === 1">
            <div class="w-full flex">
              <div class="lh-32 font-14 color-666 text-align-right t1-label flex-none">
                <span>*</span>
                <span class="ml-5">指数阈值:</span>
              </div>
              <div class="flex-1 ml-16" style="width: 0">
                <div style="" class="font-14 lh-22 color-fff text-align-center flex">
                  <div
                    v-for="(item, index) of threshold"
                    :key="index"
                    class="py-5 flex-1 bg-ff7b2f-1"
                    :class="[emitionBgColorOp1Map[item.code]]"
                  >
                    {{ item.value }}
                  </div>
                </div>
                <div class="flex mt-35">
                  <template v-for="(item, index) of threshold" :key="index">
                    <a-input-number
                      v-model="item.startThresholdValue"
                      :style="
                        [0].includes(index)
                          ? { minWidth: px2rem('70px'), height: px2rem('32px') }
                          : { minWidth: px2rem('133px'), height: px2rem('32px') }
                      "
                      :min="-100"
                      :max="100"
                      :disabled="[0].includes(index)"
                    />
                    <!-- v-if="index !== threshold.length - 1" -->
                    <div
                      class="color-666 font-14 lh-22 py-5 px-11 mx-12 flex-none"
                      :style="{ width: px2rem('80px') }"
                    >
                      {{ index === 0 ? '≤' : '<' }} NSR ≤
                    </div>
                    <a-input-number
                      v-if="index === threshold?.length - 1"
                      v-model="item.endThresholdValue"
                      :style="{ minWidth: px2rem('70px'), height: px2rem('32px') }"
                      :min="-100"
                      :max="100"
                      disabled
                    />
                  </template>
                </div>
              </div>
            </div>
          </template>
          <!-- 指标数据 -->
          <template v-if="activeTab === 2">
            <Tab2
              ref="tab2Ref"
              :data="initData?.exponentialType || []"
              @set-tab="handleSetTab"
            ></Tab2>
          </template>
          <!-- 指标类型 -->
          <template v-if="activeTab === 3">
            <div class="w-full font-14">
              <div style="max-height: 50vh; overflow: auto">
                <div
                  v-for="(item, index) of indexTypeList"
                  :key="index"
                  class="flex"
                  :class="{ 'mt-14': index !== 0 }"
                >
                  <div class="lh-32 color-666 text-align-right" style="width: 72px">
                    <!-- <span>*</span> -->
                    <!-- <span class="ml-5">{{ item.label }}:</span> -->
                    <span class="ml-5">指标{{ index + 1 }}:</span>
                  </div>
                  <div class="flex-1 ml-16" style="width: 0">
                    <a-input
                      v-model="item.name"
                      style="width: 200px"
                      :max-length="5"
                      allow-clear
                      class="border-def bg-white radius-4"
                      @blur="handleBlur"
                    ></a-input>
                    <a-button
                      type="outline"
                      status="danger"
                      class="ml-16 radius-4"
                      @click="delIndexType(index)"
                    >
                      删除
                    </a-button>
                  </div>
                </div>
              </div>

              <div class="flex mt-14">
                <div class="lh-32 color-666 text-align-right" style="width: 72px"></div>
                <div class="flex-1 ml-16" style="width: 0">
                  <a-button type="outline" class="radius-4" @click="addIndexType">
                    <template #icon>
                      <icon-plus />
                    </template>
                    添加指标
                  </a-button>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="text-align-left">
        <a-button type="primary" class="acro-btn-def" @click="handleOk">确定</a-button>
        <a-button class="ml-16 acro-btn-def-plain" @click="handleCancel">取消</a-button>
      </div>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
import FDTabs from '@/components/DrillDown/FDTabs.vue'
import useUserStore from '@/stores/modules/user'
import { emitionBgColorOp1Map } from '@/constant'
import { cloneDeep } from 'lodash-es'
import { Message } from '@arco-design/web-vue'
import Tab2 from './components/Tab2.vue'
import { findExponentialConfig, saveExponentialConfig } from '@/service/experienceTest'
import to from 'await-to-js'
import useComQueryStore from '@/stores/modules/comQuery'
import { usePageLoading } from '@/hooks/usePageLoading'
import { px2rem, value2rem } from '@/utils/rem'

const visible = defineModel({ default: false })
const emits = defineEmits(['refresh'])
const activeTab = ref(-1)
const userStore = useUserStore()
const tab2Ref = ref()
const { loadStart, loadDone } = usePageLoading()

// console.log('userStore', userStore.exponentialThreshold)

const tabsList = computed(() => {
  return [
    {
      label: '指数阈值',
      value: 1
    },
    {
      label: '指标数据',
      value: 2
    },
    {
      label: '指标类型',
      value: 3
    }
  ]
})

const titleStr = computed(() => {
  return `数据维护`
})

const tabChange = (item: any) => {
  if (activeTab.value === 3 && !checkUniqueIndexType(indexTypeList.value)) {
    return
  } else {
    activeTab.value = item.value
  }
  initData.value.exponentialType = indexTypeList.value?.filter((el: any) => el.name)
}

// 初始化处理阈值数据
const thresholdInit = () => {
  // console.log('userStore.exponentialThreshold', userStore.exponentialThreshold)

  const result = userStore.exponentialThreshold
    ?.map((el: any) => ({
      ...el,
      startThresholdValue: +el.startThresholdValue,
      endThresholdValue: +el.endThresholdValue
    }))
    .sort((a, b) => a.code - b.code)
  return cloneDeep(result)
}

const { threshold, getThersholdData, checkThresholdValues } = useTab1()

const { indexTypeList, addIndexType, delIndexType, checkUniqueIndexType, handleBlur } = useTab3()

/**
 * @description: 手动触发tab切换
 * @param {*} type
 * @return {*}
 */
const handleSetTab = (type: number) => {
  activeTab.value = type
}

/**
 * @description: 指数阈值相关逻辑
 * @return {*}
 */
function useTab1() {
  const threshold = ref()

  /**
   * @description: 处理endThresholdValue
   * @return {*}
   */
  const handleThreshold = () => {
    return threshold.value?.reduce((acc: any, cur: any, index: number) => {
      if (index < threshold.value.length - 1) {
        const nextCur = threshold.value[index + 1]
        cur.endThresholdValue = nextCur.startThresholdValue
        acc.push(cur)
      }
      if (index === threshold.value.length - 1) {
        acc.push(cur)
      }
      return acc
    }, [])
  }

  const getThersholdData = () => {
    const exponentialThreshold = handleThreshold()
    const threshold: Record<string, string> = {}
    exponentialThreshold?.forEach((item: any, index: number) => {
      if (index === 0) {
        threshold.poorS = item.startThresholdValue
        threshold.poorE = item.endThresholdValue
      } else if (index === 1) {
        threshold.improvementS = item.startThresholdValue
        threshold.improvementE = item.endThresholdValue
      } else if (index === 2) {
        threshold.goodS = item.startThresholdValue
        threshold.goodE = item.endThresholdValue
      } else if (index === 3) {
        threshold.excellentS = item.startThresholdValue
        threshold.excellentE = item.endThresholdValue
      }
    })

    return {
      exponentialThreshold,
      thresholdParams: threshold
    }
  }

  /**
   * @description: 输入框是否为空，且是否存在逻辑错误（输入框从左到右依次增大），如逻辑错误，则提示“内容输入有误，请修改后重新提交。”
   * @param {*} arr
   * @return {*}
   */
  function checkThresholdValues(arr: any) {
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i]
      if (
        item.startThresholdValue === undefined ||
        item.startThresholdValue === null ||
        item.startThresholdValue === ''
      ) {
        Message.error('内容输入有误，请修改后重新提交。')
        return false
      }

      if (i > 0 && item.startThresholdValue <= arr[i - 1].startThresholdValue) {
        Message.error('内容输入有误，请修改后重新提交。')
        return false
      }
    }
    return true
  }

  return {
    threshold,
    checkThresholdValues,
    getThersholdData
  }
}

/**
 * @description: 指标类型
 * @return {*}
 */
function useTab3() {
  const indexTypeList = ref([{ name: '' }])

  /**
   * @description: 新增指标
   * @return {*}
   */
  const addIndexType = () => {
    indexTypeList.value.push({ name: '' })
  }
  /**
   * @description: 删除指标
   * @param {*} index
   * @return {*}
   */
  const delIndexType = (index: number) => {
    if (indexTypeList.value.length === 1) {
      indexTypeList.value[0] = {
        name: ''
      }
    } else {
      indexTypeList.value.splice(index, 1)
    }
  }

  /**
   * @description: 校验是否存在重复的指标
   * @param {*} arr
   * @return {*}
   */
  const checkUniqueIndexType = (arr: any) => {
    let nameSet = new Set()

    for (let i = 0; i < arr.length; i++) {
      let item = arr[i]
      if (nameSet.has(item.name)) {
        Message.error('指标不允许重复')
        return false
      } else {
        nameSet.add(item.name)
      }
    }

    return true
  }

  const handleBlur = () => {
    checkUniqueIndexType(indexTypeList.value)
  }

  return { indexTypeList, addIndexType, delIndexType, checkUniqueIndexType, handleBlur }
}

const initData = ref()
const handleOpen = async () => {
  activeTab.value = 1
  threshold.value = thresholdInit()
  const [errs, data] = await to(
    findExponentialConfig({ brandName: useComQueryStore().brandCode, clientId: userStore.clientId })
  )

  if (errs) {
    Message.error(errs.message)
  }
  if (data) {
    initData.value = data.result || {}
    indexTypeList.value = data.result?.exponentialType
  }
}
const handleOk = async () => {
  if (!checkThresholdValues(threshold.value)) {
    return
  }
  if (!checkUniqueIndexType(indexTypeList.value)) {
    return
  }

  const { thresholdParams } = getThersholdData()
  const _indexTypeList = indexTypeList.value?.filter((el: any) => el.name)
  const params = {
    threshold: thresholdParams,
    exponentialType: tab2Ref.value?.getIndexData() || _indexTypeList,
    brandCode: useComQueryStore().brandCode,
    clientId: userStore.clientId
  }
  loadStart()
  const [errs, data] = await to(saveExponentialConfig(params))
  if (errs) {
    Message.error(errs.message)
    loadDone()
    return
  }
  if (data) {
    // 保存以后更新pinia里边的数据
    // userStore.setExponentialThreshold(cloneDeep(exponentialThreshold))
    setTimeout(() => {
      userStore.getFindThreshold(useComQueryStore().brandCode!)
    })
    emits('refresh')
    handleCancel()
  }
  loadDone()
}

const handleCancel = () => {
  visible.value = false
  activeTab.value = -1
}
</script>

<style lang="scss" scoped>
.t1-label {
  width: 80px;
}
</style>
