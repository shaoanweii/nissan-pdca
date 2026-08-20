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
      <span class="fd-title">数据总览</span>
    </template>
    <div class="fd-content">
      <FDTabs v-model="activeTab" :tabs="tabsList"></FDTabs>

      <TrendChange v-if="activeTab === 1"></TrendChange>
      <SoundList v-if="activeTab === 2" mapKey="vocView"></SoundList>
      <DocList v-if="activeTab === 3"></DocList>
      <UserList v-if="activeTab === 4" mapKey="vocView"></UserList>
    </div>
  </a-drawer>
</template>

<script lang="ts" setup>
import FDTabs from '@/components/DrillDown/FDTabs.vue'
import UserList from '@/components/DrillDown/UserList.vue'
import SoundList from '@/components/DrillDown/SoundList.vue'
import DocList from '@/components/DrillDown/DocList.vue'
import TrendChange from '@/components/DrillDown/TrendChange.vue'
import useDrillDownStore from '@/stores/modules/drillDown'
import { value2rem } from '@/utils/rem'

const visible = defineModel({ default: false })
const drillDownStore = useDrillDownStore()
const activeTab = ref(-1)
const tabsList = ref([
  {
    label: '趋势变化',
    value: 1
  },
  {
    label: '观点列表',
    value: 2
  },
  {
    label: '单据列表',
    value: 3
  },
  {
    label: '用户列表',
    value: 4
  }
])
const handleOpen = () => {
  activeTab.value = drillDownStore.initData.activeTab || 1
}
const handleOk = () => {}

const handleCancel = () => {
  visible.value = false
  activeTab.value = -1
}
</script>

<style lang="scss"></style>
