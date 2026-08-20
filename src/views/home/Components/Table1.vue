<template>
  <a-table
    class="custome-table"
    :data="data"
    :pagination="false"
    :scroll="{
      // x: '100%',
      // y: '100%'
      // maxHeight: 'calc(100vh - 390px)'
    }"
  >
    <template #columns>
      <a-table-column title="#" :width="30">
        <template #cell="{ rowIndex }">
          <span class="color-risk-1" v-if="rowIndex + 1 === 1">{{ rowIndex + 1 }} </span>
          <span class="color-risk-2" v-if="rowIndex + 1 === 2">{{ rowIndex + 1 }} </span>
          <span class="color-risk-3" v-if="rowIndex + 1 === 3">{{ rowIndex + 1 }} </span>
        </template>
      </a-table-column>
      <a-table-column title="风险等级" :width="90">
        <template #cell="{ record }">
          <div class="flex justify-center">
            <div class="risk-level-s">{{ record.column1 }}</div>
          </div>
        </template>
      </a-table-column>
      <a-table-column title="风险问题" :width="150" ellipsis tooltip>
        <template #cell="{ record }">
          <span>{{ record.column2 }}</span>
        </template>
      </a-table-column>

      <a-table-column title="走势" :width="60">
        <template #cell="{ record }">
          <div class="flex justify-center">
            <span>{{ record.column3 }}</span>
          </div>
        </template>
      </a-table-column>
      <a-table-column title="负面提及量" :width="110">
        <template #cell="{ record }">
          <div class="flex justify-center">
            <span>{{ record.column4 }}</span>
          </div>
        </template>
      </a-table-column>
      <a-table-column title="用户数" :width="80">
        <template #cell="{ record }">
          <div class="flex justify-center">
            <span>{{ record.column5 }}</span>
          </div>
        </template>
      </a-table-column>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
const data = ref([
  {
    column1: 'S',
    column2: '产品体验#电池续航',
    column3: 1,
    column4: '381',
    column5: '194'
  },
  {
    column1: 'S',
    column2: '产品体验#电池续航',
    column3: 1,
    column4: '381',
    column5: '194'
  },
  {
    column1: 'S',
    column2: '产品体验#电池续航',
    column3: 1,
    column4: '381',
    column5: '194'
  }
])
</script>

<style lang="scss" scoped></style>
<style lang="scss">
.custome-table {
  .arco-table-th {
    /* background: #f0f3fa; */
  }
}
</style>
