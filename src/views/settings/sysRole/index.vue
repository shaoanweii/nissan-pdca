<template>
  <div class="page-container">
    <div class="content-header">
      <div class="title">角色管理</div>
    </div>

    <div class="container">
      <div class="card mt-20 flex-direction-column">
        <div class="card-header">
          <div class="ch-title">
            <span>角色管理</span>
          </div>
          <div class="ch-operation">
            <a-input-search
              v-model="table.filter.searchKeyword"
              placeholder="请输入关键字"
              style="width: 214px"
              class="border-def bg-white radius-4 ml-10"
              allow-clear
              @search="() => getList()"
            />
            <a-button type="primary" class="ml-10 acro-btn-def" @click="handleAdd">
              <i class="iconfont icon-plus mr-8"></i>
              添加角色
            </a-button>
          </div>
        </div>
        <div class="card-content pt-16">
          <div style="height: calc(100vh - 348px - 32px - 24px - 30px - 16px)">
            <a-table
              class="mt-16"
              :data="table.list"
              :pagination="false"
              :bordered="{ cell: true }"
              @sorter-change="handleSortChange"
              :scroll="{
                // x: '100%',
                // y: '100%',
                // maxHeight: 'calc(100vh - 395px)'
                y: '100%',
                maxHeight: '100%'
              }"
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

                <a-table-column title="角色名称">
                  <template #cell="{ record }">
                    <span>{{ record.roleName }}</span>
                  </template>
                </a-table-column>
                <a-table-column title="关联品牌">
                  <template #cell="{ record }">
                    <span>{{ record.brandName }}</span>
                  </template>
                </a-table-column>
                <a-table-column title="备注">
                  <template #cell="{ record }">
                    <span>{{ record.remark }}</span>
                  </template>
                </a-table-column>
                <a-table-column title="状态">
                  <template #cell="{ record }">
                    <div class="flex-align-center">
                      <a-badge v-if="record.roleStatusName === '启用中'" color="#2DAD7B" />
                      <a-badge v-else color="#ABB4C3" />
                      <span class="ml-8">{{ record.roleStatusName }}</span>
                    </div>
                  </template>
                </a-table-column>

                <a-table-column title="操作" :width="value2rem(120)">
                  <template #cell="{ record }">
                    <a-link @click="handleEdit(record)">编辑</a-link>
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
  <AddEditDrawer v-model="form.visible" @refreshList="getList"></AddEditDrawer>
</template>

<script setup lang="ts">
import { queryList } from '@/service/sysRole'
import AddEditDrawer from './components/AddEditDrawer.vue'
import { useTable } from '@/hooks/useTable'
import { useUserStoreWithOut } from '@/stores/modules/user'
import { value2rem } from '@/utils/rem'

const {
  table,
  form,
  pagination,
  getList,
  handleEdit,
  handleCurrentChange,
  handleSortChange,
  handleAdd
} = useTable({
  queryApi: queryList
})
table.filter.clientId = useUserStoreWithOut().clientId
getList()

provide('form', form)
</script>

<style lang="scss" scoped></style>
