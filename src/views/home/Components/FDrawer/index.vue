<template>
  <a-drawer
    class="f-drawer"
    :width="1150"
    :visible="visible"
    :footer="false"
    @ok="handleOk"
    @cancel="handleCancel"
    unmountOnClose
  >
    <template #title>
      <span class="fd-title">数据总览-声音列表</span>
    </template>
    <div class="fd-content">
      <FDTabs
        v-model="activeTab"
        :tabs="[
          {
            label: '趋势变化',
            value: 1
          },
          {
            label: '声音列表',
            value: 2
          },
          {
            label: '用户列表',
            value: 3
          }
        ]"
      ></FDTabs>

      <SoundList v-if="activeTab === 2"></SoundList>
      <UserList v-if="activeTab === 3"></UserList>
    </div>
  </a-drawer>
</template>

<script lang="ts" setup>
import FDTabs from './components/FDTabs.vue'
import UserList from './components/UserList.vue'
import SoundList from './components/SoundList.vue'

const visible = defineModel({ default: false })

const activeTab = ref(1)
const handleOk = () => {}

const handleCancel = () => {
  visible.value = false
}
</script>

<style lang="scss"></style>
