<template>
  <a-drawer
    class="f-drawer"
    :width="value2rem(1150)"
    :visible="visible"
    :footer="false"
    @ok="handleOk"
    @cancel="handleCancel"
    @open="handleOpen"
    unmountOnClose
  >
    <template #title>
      <span class="fd-title">{{ titleStr }}</span>
    </template>
    <div class="fd-content clear-border" style="overflow-y: auto">
      <div class="f-card h-full">
        <FDTabs v-model="activeTab" :tabs="tabsList"></FDTabs>
        <IndexTrendChange v-if="activeTab === 1" mapKey="testing"></IndexTrendChange>
        <SoundList v-if="activeTab === 2" mapKey="testing"></SoundList>
        <UserList v-if="activeTab === 4" mapKey="testing"></UserList>
      </div>
    </div>
  </a-drawer>
</template>

<script lang="ts" setup>
import FDTabs from '@/components/DrillDown/FDTabs.vue'
import UserList from '@/components/DrillDown/UserList.vue'
import SoundList from '@/components/DrillDown/SoundList.vue'
import IndexTrendChange from '@/components/DrillDown/IndexTrendChange.vue'
import useDrillDownStore from '@/stores/modules/drillDown'
import { value2rem } from '@/utils/rem'
// import useComQueryStore from '@/stores/modules/comQuery'

const visible = defineModel({ default: false })
const drillDownStore = useDrillDownStore()
// const comQueryStore = useComQueryStore()
const activeTab = ref(-1)

const tabsList = computed(() => {
  return [
    {
      label: '趋势变化',
      value: 1
    },
    {
      label: '观点列表',
      value: 2
    },
    {
      label: '用户列表',
      value: 4
    }
  ]
})

/**
 * 四级标题
 */
const titleStr = computed(() => {
  return drillDownStore.indexInitData?.data?.[2]
})

const handleOpen = () => {
  activeTab.value = 1
}
const handleOk = () => {}

const handleCancel = () => {
  visible.value = false
  activeTab.value = -1
}
</script>

<style lang="scss"></style>
