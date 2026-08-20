<template>
  <div class="doc-list pxy-24 flex direction-column">
    <OrderBtn order-key="publish_time" @change="handleOrderChange"></OrderBtn>

    <div class="flex-1 flex direction-column h-full mt-24">
      <div class="flex flex-1-0-auto" style="height: 0">
        <div class="border-right-f6f6f6" style="width: 460px; height: 100%; overflow-y: auto">
          <!-- <div v-for="item of 100" :key="item">1111--{{ item }}</div> -->
          <template v-if="table.list?.length">
            <div
              v-for="(item, index) of table.list"
              :key="
                table.pageNum === 1 ? index + 1 : (table.pageNum - 1) * table.pageSize + index + 1
              "
              class="py-16 pl-24 pr-33 flex font-14 lh-20 color-333 border-bottom-f6f6f6 point"
              :class="{ active: index === active }"
              @click="handleChange(item, index)"
            >
              <div style="min-width: 26px" class="fw-600 mr-5">
                {{
                  table.pageNum === 1
                    ? index + 1
                    : (table.pageNum - 1) * table.pageSize + index + 1
                }}.
              </div>
              <div class="flex-1">
                <span>{{ handleStrBySliceNum(item?.originalTextScene, 50) }}</span>
              </div>
            </div>
          </template>
          <template v-else>
            <FEmpty />
          </template>
        </div>
        <div class="flex-1 ml-24 flex-direction-column">
          <div class="font-16 lh-24 color-4b5468">单据内容</div>
          <template v-if="curDetail">
            <div class="flex mt-24">
              <SvgIcon name="avatar-male" width="44px" height="44px"></SvgIcon>
              <div class="flex-1 ml-12">
                <div class="color-26292e flex-align-center justify-between">
                  <div class="font-14 lh-20">{{ curDetail?.username }}</div>
                  <div class="font-12 lh-16">{{ curDetail?.channelName }}</div>
                </div>
                <div class="color-26292e flex-align-center justify-between">
                  <div class="font-14 lh-20">
                    {{ curDetail?.provinceName }}丨{{ curDetail?.bizCreateTime }}
                  </div>
                  <div class="font-12 lh-16">{{ curDetail?.channelBiz }}</div>
                </div>
              </div>
            </div>
            <div class="mt-16">
              <div class="color-26292e font-14 lh-22">
                <span>车系：</span>
                <span>{{ curDetail?.carSeriesName }}</span>
              </div>
              <div class="color-26292e font-14 lh-22 mt-5">
                <span>焦点：</span>
                <span>{{ curDetail?.focus }}</span>
              </div>
              <div class="color-26292e font-14 lh-22 mt-5">
                <span>观点：</span>
                <span>{{ curDetail?.opinion }}</span>
              </div>
            </div>
            <div
              class="mt-16 bgc-def radius-8 flex-1-0-auto border-def py-16 px-24 font-14"
              style="height: 0; overflow-y: auto"
            >
              <div>
                {{ curDetail?.originalTextScene }}
              </div>
            </div>
          </template>
          <template v-else>
            <FEmpty />
          </template>
        </div>
      </div>
      <div style="flex: none" class="line-26292e"></div>
      <div style="flex: none" class="flex-justify-end">
        <FPagination
          v-model:current="table.pageNum"
          :total="table.total"
          :pageSize="table.pageSize"
          @change="handlePageChange"
        ></FPagination>
        <!-- <a-pagination
          v-model:current="table.pageNum"
          v-model:page-size="table.pageSize"
          :total="table.total"
          show-total
          show-jumper
          @change="handlePageChange"
        /> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getBillList, getUserVoiceDetail } from '@/service/vocOverview'
import { useTable } from '@/hooks/useTable'
import useComQueryStore from '@/stores/modules/comQuery'
import to from 'await-to-js'
import OrderBtn from './OrderBtn.vue'
import { handleStrBySliceNum } from '@/utils'
import { Message } from '@arco-design/web-vue'
import { usePageLoading } from '@/hooks/usePageLoading'

const comQueryStore = useComQueryStore()
const active = ref(0)
const { loadStart, loadDone } = usePageLoading()

const { table, getList, handleCurrentChange } = useTable({
  queryApi: getBillList
})

const curDetail = ref<Record<string, any>>()
onMounted(async () => {
  table.filter = { ...comQueryStore.requiredForm, ...comQueryStore.formByVocView }
  table.filter.order = 'publish_time desc'
  loadStart()
  await getList()
  if (table.list?.[0]) {
    getDetail(table.list?.[0]?.newId)
  }
  loadDone()
})

const handlePageChange = async (pageNum: number) => {
  active.value = 0
  handleCurrentChange(pageNum)
}

const handleOrderChange = async (order: string) => {
  table.filter.order = order
  active.value = 0
  loadStart()
  await getList(true)
  if (table.list?.[0]) {
    getDetail(table.list?.[0]?.newId)
  }
  loadDone()
}

const getDetail = async (newId: string) => {
  const [errs, data] = await to(
    getUserVoiceDetail({ ...comQueryStore.requiredForm, ...comQueryStore.formByVocView, newId })
  )
  if (errs) {
    Message.error(errs.message)
    loadDone()
  }
  if (data) {
    curDetail.value = data?.result
  }
}

const handleChange = (item: any, index: number) => {
  active.value = index
  getDetail(item.newId)
}
</script>

<style lang="scss" scoped>
.doc-list {
  height: calc(100% - 64px);

  .active {
    /* background: rgba(17, 104, 202, 0.1); */
    background: #f0f3fa;
    color: #333;
    /* border-bottom: 1px solid rgba(#1168ca, 0.5); */
    border-bottom: 1px solid #2c9bde;
  }
}
</style>
