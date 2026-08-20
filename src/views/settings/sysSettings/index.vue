<template>
  <div class="page-container">
    <div class="content-header">
      <div class="title">系统配置</div>
    </div>

    <div class="container">
      <div class="card full mt-20 flex-direction-column">
        <div class="card-content">
          <a-form :model="form" auto-label-width>
            <a-form-item label="系统水印显示" show-colon>
              <a-switch v-model="form.systemWatermarking">
                <template #checked> ON </template>
                <template #unchecked> OFF </template>
              </a-switch>
            </a-form-item>
            <a-form-item label="下载文档水印" show-colon>
              <a-switch v-model="form.documentWatermarking">
                <template #checked> ON </template>
                <template #unchecked> OFF </template>
              </a-switch>
            </a-form-item>
            <!-- 日:d 月:m 周：w 季:q 年:y -->
            <!-- <a-form-item label="默认时间周期" show-colon>
              <a-radio-group v-model="form.defaultPeriod">
                <a-radio v-for="item of conditions.period" :key="item.key" :value="item.key">
                  {{ item.value }}
                </a-radio>
              </a-radio-group>
            </a-form-item> -->
          </a-form>
        </div>
        <div class="card-footer cf-border-top">
          <a-button type="primary" class="acro-btn-def" @click="handleUpdateConfig"
            >更新配置</a-button
          >
          <a-button class="ml-10 acro-btn-def-plain" @click="handleCacelConfig">取消</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useCondition from '@/hooks/useCondition'
import { usePageLoading } from '@/hooks/usePageLoading'
import { getConditions, updateSystemConfig } from '@/service/sysSettings'
import { useAppStoreWithOut } from '@/stores/modules/app'
import { useUserStoreWithOut } from '@/stores/modules/user'
import to from 'await-to-js'
import { debounce } from 'lodash-es'

const { conditions } = useCondition(getConditions)

const userStore = useUserStoreWithOut()
const form = reactive<SysSettings.Entity>({
  id: '',
  clientId: '',
  systemWatermarking: false,
  documentWatermarking: false,
  defaultPeriod: 'd'
})
const appStore = useAppStoreWithOut()
const { loadStart, loadDone } = usePageLoading()

const setForm = () => {
  form.id = appStore.sysConfig.id
  form.defaultPeriod = appStore.sysConfig.defaultPeriod
  form.documentWatermarking = appStore.sysConfig.documentWatermarking
  form.systemWatermarking = appStore.sysConfig.systemWatermarking
  form.clientId = userStore.clientId
}

onBeforeMount(async () => {
  setForm()
})

// 更新配置
const handleUpdateConfig = debounce(async () => {
  loadStart()

  const [errs] = await to(updateSystemConfig(form))

  if (!errs) {
    appStore.setSysConfig(form)
    // if (form.systemWatermarking) {
    //   setWaterMark('Arco Design', 'Arco Design', 'Arco Design', 'Arco Design')
    // } else {
    //   removeWatermark()
    // }
  }

  loadDone()
}, 300)

// 恢复默认配置
const handleCacelConfig = debounce(async () => {
  loadStart()
  appStore.resetSysConfig()
  setForm()
  // const [, data] = await to(findSystemConfig({ clientId: userStore.clientId }))
  // if (data?.result) {

  // }
  loadDone()
}, 300)
</script>

<style lang="scss" scoped></style>
