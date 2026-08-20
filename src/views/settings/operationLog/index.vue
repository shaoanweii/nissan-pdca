<template>
  <div class="page-container">
    <div class="content-header">
      <div class="title">操作日志</div>
    </div>
    <div class="container">
      <div class="card mt-20 flex-direction-column">
        <div class="card-header">
          <div class="ch-title">查询结果</div>
          <div class="ch-operation">
            <!-- <FDatePicker controller="operationLog" @change="timeChange"></FDatePicker> -->
            <FRangePicker
              controller="operationLog"
              :isCacheTime="false"
              @change="timeChange"
            ></FRangePicker>
            <FSelect
              v-model="table.filter.deptId"
              :multiple="true"
              allow-clear
              :options="deptOptions"
              placeholder="请选择部门"
              :subLength="2"
              :field-names="{ value: 'value', label: 'name' }"
              class="bg-white radius-4 ml-10"
              :style="{ width: '160px' }"
              @change2="() => getList()"
            />

            <a-input-search
              v-model="table.filter.searchKeyword"
              placeholder="请输入查询关键词"
              style="width: 214px"
              class="border-def bg-white radius-4 ml-10"
              allow-clear
              @search="() => getList()"
            />
            <!-- <a-input
              v-model="table.filter.searchKeyword"
              placeholder="请输入查询关键词"
              style="width: 214px"
              class="border-def bg-white radius-4 ml-10"
              @blur="() => getList()"
            /> -->
            <!-- TODO 操作日志导出接口有问题临时先隐藏按钮 -->
            <!-- <a-button type="primary" class="ml-10 acro-btn-def" @click="handleExport">
              <i class="iconfont icon-xiazai mr-8"></i>
              导出数据
            </a-button> -->
          </div>
        </div>
        <div class="card-content pt-16">
          <!-- :pagination="pagination" - 162px -->
          <!-- height: calc(100% - 32px - 24px - 30px) -->
          <div style="height: calc(100vh - 348px - 32px - 24px - 30px)">
            <a-table
              :loading="table.loading"
              :data="table.list"
              :pagination="false"
              :scroll="{
                // x: '100%',
                y: '100%',
                // y: 'calc(100% - 162px - 24px)'
                // maxHeight: 'calc(100vh - 390px)'
                maxHeight: '100%'
              }"
              :bordered="{ cell: true }"
              @sorter-change="handleSortChange"
            >
              <template #columns>
                <a-table-column title="编号" :width="value2rem(70)">
                  <template #cell="{ rowIndex }">
                    <span>{{
                      table.pageNum > 1
                        ? table.pageNum * table.pageSize + rowIndex + 1
                        : rowIndex + 1
                    }}</span>
                  </template>
                </a-table-column>
                <a-table-column title="操作时间" :width="value2rem(180)">
                  <template #cell="{ record }">
                    <span>{{ record.operatorTime }}</span>
                  </template>
                </a-table-column>
                <a-table-column title="操作人" :width="value2rem(260)">
                  <template #cell="{ record }">
                    <span>{{ record.username }}</span>
                  </template>
                </a-table-column>
                <a-table-column title="操作事件" ellipsis tooltip :width="value2rem(260)">
                  <template #cell="{ record }">
                    <span>{{ record.logContent }}</span>
                  </template>
                </a-table-column>
                <a-table-column title="操作描述" ellipsis tooltip>
                  <template #cell="{ record }">
                    <span>{{ record.logDesc }}</span>
                  </template>
                </a-table-column>
                <a-table-column title="IP地址" :width="value2rem(140)">
                  <template #cell="{ record }">
                    <span>{{ record.ip }}</span>
                  </template>
                </a-table-column>
              </template>
            </a-table>
          </div>
          <div class="card-line mb-23 mt-30"></div>
          <div class="flex justify-end">
            <FPagination
              v-model:current="pagination.current"
              :total="pagination.total"
              :pageSize="pagination.pageSize"
              @change="handleCurrentChange"
            ></FPagination>
            <!-- <a-pagination
              v-model:current="pagination.current"
              v-model:page-size="pagination.pageSize"
              :total="pagination.total"
              show-total
              show-jumper
              show-page-size
              @change="handleCurrentChange"
              @page-size-change="handleSizeChange"
            /> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExport } from '@/hooks/useExport'
import { usePageLoading } from '@/hooks/usePageLoading'
import { useTable } from '@/hooks/useTable'
import { downLoadOperationLog, findDepartList, findOperationLog } from '@/service/operationLog'
import { Message } from '@arco-design/web-vue'
import to from 'await-to-js'
import { debounce } from 'lodash-es'
import { value2rem } from '@/utils/rem'

const { table, pagination, getList, handleCurrentChange, handleSortChange } = useTable({
  queryApi: findOperationLog
})

const timeChange = (val: any) => {
  table.filter.startDate = val.startDate
  table.filter.endDate = val.endDate
  getDept()
  getList()
}

const deptOptions = ref<any[]>([])
const getDept = async () => {
  const [errs, data] = await to(findDepartList())
  if (errs) {
    Message.error(errs.message)
  }
  if (data) {
    deptOptions.value = data.result
  }
}

const { exportFile } = useExport()
const { loadStart, loadDone } = usePageLoading()
const handleExport = debounce(async () => {
  loadStart()
  const [errs] = await to(exportFile(downLoadOperationLog, {}))
  if (errs) {
    Message.error(errs.message)
    loadDone()
    return
  }
  loadDone()
}, 300)
</script>

<style lang="scss" scoped></style>
