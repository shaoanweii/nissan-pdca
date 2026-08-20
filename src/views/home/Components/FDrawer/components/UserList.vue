<template>
  <div class="user-list">
    <div class="ul-content">
      <a-table
        :data="data"
        :pagination="false"
        :scroll="{
          x: '100%',
          y: '100%',
          // maxHeight: 'calc(100vh - 390px)'
          maxHeight: '100%'
        }"
      >
        <template #columns>
          <a-table-column title="序列" :width="60">
            <template #cell="{ rowIndex }">
              <span>{{ rowIndex + 1 }}</span>
            </template>
          </a-table-column>
          <a-table-column title="用户ID" :width="200">
            <template #cell="{ record }">
              <div class="flex justify-center">
                <div class="risk-level-s">{{ record.column1 }}</div>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="发声渠道" :width="150" ellipsis tooltip>
            <template #cell="{ record }">
              <span>{{ record.column2 }}</span>
            </template>
          </a-table-column>

          <a-table-column title="发声数" :width="80">
            <template #cell="{ record }">
              <div class="flex justify-center">
                <span>{{ record.column3 }}</span>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="提及量" :width="80">
            <template #cell="{ record }">
              <div class="flex justify-center">
                <span>{{ record.column4 }}</span>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="抱怨" :width="80">
            <template #cell="{ record }">
              <div class="flex justify-center">
                <span>{{ record.column5 }}</span>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="投诉" :width="80">
            <template #cell="{ record }">
              <div class="flex justify-center">
                <span>{{ record.column5 }}</span>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="咨询" :width="80">
            <template #cell="{ record }">
              <div class="flex justify-center">
                <span>{{ record.column5 }}</span>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="净情感值" :width="137">
            <template #cell="{ record }">
              <div class="flex justify-center">
                <span>{{ record.column5 }}</span>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="操作" :width="80">
            <template #cell="{ record }">
              <div class="flex justify-center">
                <span>{{ record.column5 }}</span>
              </div>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>

    <div class="line"></div>
    <div class="footer">
      <a-pagination :total="50" show-total show-jumper show-page-size />
      <!-- <a-button class="mr-24">上一页</a-button>
      <a-button class="mr-24">下一页</a-button>
      <div class="total">共56页</div> -->
    </div>
  </div>
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

<style lang="scss" scoped>
.user-list {
  padding: 24px;
  height: calc(100% - 64px);
  .ul-content {
    height: calc(100% - 65px);
  }
  .line {
    height: 1px;
    background: rgba(#26292e, 0.15);
    margin: 10px -24px 23px;
  }
  .footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
