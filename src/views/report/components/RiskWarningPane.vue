<script setup lang="ts">
import { usePageLoading } from '@/hooks/usePageLoading'
import { useTable } from '@/hooks/useTable'
import { findReportList, generateReport } from '@/service/report'
import { useUserStoreWithOut } from '@/stores/modules/user'
import to from 'await-to-js'
import { debounce } from 'lodash-es'
import axios from 'axios'
import { Message } from '@arco-design/web-vue'
import TimeFrame from './TimeFrame.vue'
import BuildStatus from './BuildStatus.vue'

defineOptions({
  name: 'RiskWarningPane'
})

const userStore = useUserStoreWithOut()
const { table, form, getList, handleReset } = useTable({
  // queryApi: findReportList,
  queryApi: new Promise((reslove, reject) => reslove(1)) as any,
  resetKeyWhiteList: ['clientId']
})
table.filter.clientId = userStore.clientId
table.list = [
  {
    status: '0',
    statusText: '生成中',
    reportName: '风险预警报告_20250322_230021'
  },
  {
    status: '1',
    statusText: '已完成',
    reportName: '风险预警报告_20250322_230021'
  },
  {
    status: '2',
    statusText: '生成失败',
    reportName: '风险预警报告_20250322_230021'
  }
]
// getList()

provide('form', form)

const { loadStart, loadDone } = usePageLoading()
const handleGenerateReport = debounce(async () => {
  loadStart()
  await to(generateReport({ clientId: userStore.clientId }))

  getList()
  loadDone()
}, 300)

const handleDownLoad = debounce((record: any) => {
  if (!record.reportUrl) {
    Message.info('暂无报告')
    return
  }
  // const fileUrl =
  //   'http://172.16.80.16:30125/test/%E5%A3%B0%E9%9F%B3%E6%8A%A5%E5%91%8A?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=voc-cloud%2F20241017%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241017T012235Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=4575d31e2d005f83f254fda491e21b3aed300d3f95c34fea3b91b2b34d00fc12'

  axios({
    url: record.reportUrl,
    method: 'GET',
    responseType: 'blob'
  })
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${record.reportName}.pptx`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
    .catch(error => {
      console.error('下载文件出错：', error)
    })
}, 500)
</script>

<template>
  <div class="qc-content">
    <a-form layout="inline" :model="table.filter" class="clear-form-item-margin">
      <a-grid class="w-full" :cols="4" :col-gap="24" :row-gap="16">
        <a-grid-item>
          <a-form-item label="时间范围">
            <TimeFrame></TimeFrame>
          </a-form-item>
        </a-grid-item>
        <a-grid-item>
          <a-form-item label="风险类型">
            <a-select
              v-model="table.filter.enable"
              placeholder="全部"
              allow-clear
              :data-testid="`accountmanagement-10002`"
            >
              <a-option label="item.value" value="item.key" />
            </a-select>
          </a-form-item>
        </a-grid-item>
        <a-grid-item>
          <a-form-item label="风险等级">
            <a-select
              v-model="table.filter.enable"
              placeholder="全部"
              allow-clear
              :data-testid="`accountmanagement-10002`"
            >
              <a-option label="item.value" value="item.key" />
            </a-select>
          </a-form-item>
        </a-grid-item>
        <a-grid-item>
          <div class="flex-align-center justify-end">
            <a-button type="primary" class="acro-btn-def flex-align-center">
              <i class="ri-send-plane-line font-16 mr-8"></i>
              <span>生成报告</span>
            </a-button>
            <a-button class="ml-16 acro-btn-def-plain flex-align-center">
              <i class="ri-reset-right-line font-16 mr-8"></i>
              <span>重置</span>
            </a-button>
          </div>
        </a-grid-item>
      </a-grid>
    </a-form>
  </div>
  <div class="bgc-f0f3fa-h-20-w-full"></div>
  <div class="card flex-direction-column">
    <div class="card-header">
      <div class="ch-title">
        <span>报告列表</span>
        <i class="iconfont icon-information-line1 ml-12"></i>
        <span class="ml-8 cht-tip">仅保留最近生成的20份报告数据</span>
      </div>
    </div>
    <div class="card-content">
      <!-- 
                   :scroll="{
                    x: '100%',
                    y: '100%',
                    maxHeight: '500px'
                  }"
                -->
      <a-table class="mt-16" :data="table.list" :pagination="false">
        <template #columns>
          <a-table-column title="报告名称" :width="200">
            <template #cell="{ record }">
              <div class="flex-align-center ellipsis-single-line">
                <i class="ri-file-warning-fill font-16 color-2c9bde"></i>
                <div class="ml-8 color-555">
                  {{ record.reportName }}
                </div>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="时间范围" :width="150">
            <template #cell="{ record }">
              <span>{{ record.timeScope }}</span>
            </template>
          </a-table-column>
          <a-table-column title="风险类型" :width="150">
            <template #cell="{ record }">
              <span>{{ record.carSeries }}</span>
            </template>
          </a-table-column>
          <a-table-column title="风险等级" :width="150">
            <template #cell="{ record }">
              <span>{{ record.channel }}</span>
            </template>
          </a-table-column>

          <a-table-column title="生成时间" :width="150">
            <template #cell="{ record }">
              <span>{{ record.region }}</span>
            </template>
          </a-table-column>

          <a-table-column title="状态" :width="150">
            <template #cell="{ record }">
              <BuildStatus :status="record.status" :status-text="record.statusText"></BuildStatus>
            </template>
          </a-table-column>
          <a-table-column fixed="right" title="操作" :width="150">
            <!-- eslint-disable-next-line vue/no-unused-vars -->
            <template #cell="{ record }">
              <a-button
                type="text"
                :disabled="record.status !== '1'"
                @click="handleDownLoad(record)"
              >
                下载报告
              </a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
