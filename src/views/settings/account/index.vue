<template>
  <div class="page-container">
    <div class="content-header">
      <div class="title">账号管理</div>
    </div>

    <div class="container">
      <div class="card mt-20 flex-direction-column">
        <div class="card-header">
          <div class="ch-title">
            <span>账号管理</span>
          </div>
          <div class="ch-operation">
            <FSelect
              v-model="table.filter.deptId"
              :multiple="true"
              allow-clear
              :options="deptOptions"
              placeholder="请选择部门"
              :field-names="{ value: 'value', label: 'name' }"
              class="bg-white radius-4 ml-10"
              :style="{ width: '160px' }"
              @change2="() => getList()"
            />

            <a-select
              v-model="table.filter.roleId"
              placeholder="请选择角色"
              allow-clear
              style="width: 120px"
              class="border-def bg-white radius-4 ml-10"
              @blur="() => getList()"
            >
              <a-option v-for="(item, index) of roleOptions" :key="index" :value="item.id">{{
                item.roleName
              }}</a-option>
            </a-select>
            <a-input-search
              v-model="table.filter.userName"
              placeholder="请输入员工编号或姓名"
              style="width: 214px"
              class="border-def bg-white radius-4 ml-10"
              allow-clear
              @search="() => getList()"
            />
            <!-- <a-input
              v-model="table.filter.userName"
              placeholder="请输入员工编号或姓名"
              style="width: 120px"
              class="ml-10"
              allow-clear
              @blur="() => getList()"
            /> -->
          </div>
        </div>
        <div class="card-content pt-16">
          <!-- calc(100% - 32px - 24px - 30px) -->
          <div style="height: calc(100vh - 348px - 32px - 24px - 30px)">
            <a-table
              :loading="table.loading"
              :data="table.list"
              :pagination="false"
              :bordered="{ cell: true }"
              :scroll="{
                // x: '100%',
                // y: '100%',
                // maxHeight: 'calc(100vh - 395px)'
                y: '100%',
                maxHeight: '100%'
              }"
              @page-change="handleCurrentChange"
              @page-size-change="handleSizeChange"
              @sorter-change="handleSortChange"
            >
              <template #columns>
                <a-table-column title="编号" :width="value2rem(80)">
                  <template #cell="{ rowIndex }">
                    <span>{{
                      table.pageNum > 1
                        ? table.pageNum * table.pageSize + rowIndex + 1
                        : rowIndex + 1
                    }}</span>
                  </template>
                </a-table-column>
                <a-table-column title="账号名" :width="value2rem(120)">
                  <template #cell="{ record }">
                    <span>{{ record.accountName }}</span>
                  </template>
                </a-table-column>
                <a-table-column title="姓名" :width="value2rem(150)" ellipsis tooltip>
                  <template #cell="{ record }">
                    <span>{{ record.userName }}</span>
                  </template>
                </a-table-column>
                <a-table-column title="员工工号" :width="value2rem(150)" ellipsis tooltip>
                  <template #cell="{ record }">
                    <span>{{ record.employeeId }}</span>
                  </template>
                </a-table-column>

                <a-table-column title="所属部门" :width="value2rem(120)">
                  <template #cell="{ record }">
                    <span>{{ record.deptName }}</span>
                  </template>
                </a-table-column>
                <a-table-column title="账号角色" :width="value2rem(150)">
                  <template #cell="{ record }">
                    <span>{{ record.roleName }}</span>
                  </template>
                </a-table-column>
                <a-table-column title="登录次数" :width="value2rem(120)">
                  <template #cell="{ record }">
                    <span>{{ record.loginCounts }}</span>
                  </template>
                </a-table-column>
                <a-table-column title="最近登录时间" :width="value2rem(180)">
                  <template #cell="{ record }">
                    <span>{{ record.lastLoginTime }}</span>
                  </template>
                </a-table-column>
                <!-- <a-table-column title="状态" :width="100">
                  <template #cell="{ record }">
                    <span>{{ record.statusText }}</span>
                  </template>
                </a-table-column> -->
                <a-table-column title="操作" fixed="right" :width="value2rem(80)">
                  <template #cell="{ record }">
                    <!-- <a-button type="text" status="normal">密码重置</a-button> -->
                    <!-- class="color-999 font-14" -->
                    <!-- <div>编辑</div> -->
                    <a-link @click="handleEdit(record)">编辑</a-link>
                    <!-- <a-button type="text" status="normal" @click="handleEdit(record)">编辑</a-button> -->
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
  <AddEditDrawer v-model="form.visible" @refreshList="() => getList(true)"></AddEditDrawer>
</template>

<script setup lang="ts">
import { useTable } from '@/hooks/useTable'
import AddEditDrawer from './components/AddEditDrawer.vue'
import {
  findAccountInfoList,
  findDepartList,
  getConditions,
  queryRoleALlList
} from '@/service/account'
import useCondition from '@/hooks/useCondition'
import to from 'await-to-js'
import useUserStore from '@/stores/modules/user'
import { Message } from '@arco-design/web-vue'
import { value2rem } from '@/utils/rem'

const { conditions } = useCondition(getConditions)

provide('conditions', conditions)

const {
  table,
  form,
  pagination,
  getList,
  handleEdit,
  handleCurrentChange,
  handleSizeChange,
  handleSortChange
} = useTable({
  queryApi: findAccountInfoList,
  resetKeyWhiteList: ['clientId']
})

const roleOptions = ref<any[]>([])

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

const init = async () => {
  table.filter.clientId = useUserStore().clientId
  getDept()
  getList()
  const [errs, data] = await to(queryRoleALlList({ clientId: useUserStore().clientId }))
  if (errs) {
    roleOptions.value = []
    return
  }
  if (data?.result) {
    roleOptions.value = data.result
  }
}

init()

provide('form', form)
provide('roleOptions', roleOptions)
</script>

<style lang="scss" scoped></style>
