<template>
  <div class="user-list" :class="{ mhc: ['vocViewInRisk', 'warning'].includes(mapKey) }">
    <div class="ul-content">
      <a-table
        :loading="table.loading"
        :data="table.list"
        :pagination="false"
        :scroll="{
          x: '100%',
          y: '100%',
          // maxHeight: 'calc(100vh - 390px)'
          maxHeight: '100%'
        }"
        @sorter-change="handleSortChange"
      >
        <template #columns>
          <a-table-column title="" :width="value2rem(60)">
            <template #cell="{ rowIndex }">
              <!-- <span>{{ rowIndex + 1 }}</span> -->
              <span>{{
                table.pageNum === 1
                  ? rowIndex + 1
                  : (table.pageNum - 1) * table.pageSize + rowIndex + 1
              }}</span>
            </template>
          </a-table-column>
          <a-table-column title="用户" :width="value2rem(200)">
            <template #cell="{ record }">
              <div class="">
                <div>{{ record.username }}</div>
              </div>
            </template>
          </a-table-column>
          <a-table-column
            title="渠道数"
            data-index="channelC"
            :width="value2rem(150)"
            :sortable="sortOpts"
          >
            <template #cell="{ record }">
              <a-tooltip :content="record.channelName">
                <span style="text-decoration: underline" class="point">{{ record.channelC }}</span>
              </a-tooltip>
            </template>
          </a-table-column>

          <a-table-column
            title="单据数"
            data-index="billC"
            :width="value2rem(120)"
            :sortable="sortOpts"
          >
            <template #cell="{ record }">
              <div class="">
                <span>{{ record.billC }}</span>
              </div>
            </template>
          </a-table-column>
          <a-table-column
            title="观点数"
            data-index="opinionC"
            :width="value2rem(120)"
            :sortable="sortOpts"
          >
            <template #cell="{ record }">
              <div class="">
                <span>{{ record.opinionC }}</span>
              </div>
            </template>
          </a-table-column>
          <a-table-column
            title="表扬"
            data-index="praiseC"
            :width="value2rem(100)"
            :sortable="sortOpts"
          >
            <template #cell="{ record }">
              <div class="">
                <span>{{ record.praiseC }}</span>
              </div>
            </template>
          </a-table-column>
          <a-table-column
            title="咨询"
            data-index="consultC"
            :width="value2rem(100)"
            :sortable="sortOpts"
          >
            <template #cell="{ record }">
              <div class="">
                <span>{{ record.consultC }}</span>
              </div>
            </template>
          </a-table-column>
          <a-table-column
            title="建议"
            data-index="suggestionC"
            :width="value2rem(100)"
            :sortable="sortOpts"
          >
            <template #cell="{ record }">
              <div class="">
                <span>{{ record.suggestionC }}</span>
              </div>
            </template>
          </a-table-column>
          <a-table-column
            title="抱怨"
            data-index="complainC"
            :width="value2rem(100)"
            :sortable="sortOpts"
          >
            <template #cell="{ record }">
              <div class="">
                <span>{{ record.complainC }}</span>
              </div>
            </template>
          </a-table-column>
          <a-table-column
            title="投诉"
            data-index="complaintC"
            :width="value2rem(100)"
            :sortable="sortOpts"
          >
            <template #cell="{ record }">
              <div class="">
                <span>{{ record.complaintC }}</span>
              </div>
            </template>
          </a-table-column>
          <a-table-column
            title="陈述"
            data-index="statementC"
            :width="value2rem(100)"
            :sortable="sortOpts"
          >
            <template #cell="{ record }">
              <div class="">
                <span>{{ record.statementC }}</span>
              </div>
            </template>
          </a-table-column>

          <a-table-column
            title="体验指数"
            data-index="nsrC"
            :width="value2rem(137)"
            :sortable="sortOpts"
          >
            <template #cell="{ record }">
              <span :class="[emitionColorMap[record.nsrG]]">{{
                formatToTwoDecimal(record.nsrC)
              }}</span>
            </template>
          </a-table-column>
          <a-table-column title="操作" fixed="right" :width="value2rem(80)">
            <template #cell="{ record }">
              <!-- <a-button>查阅</a-button> -->
              <div class="font-14 lh-20 color-6e7b91 point" @click="handleDetail(record)">查阅</div>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>

    <div class="line"></div>
    <div class="footer">
      <FPagination
        v-model:current="table.pageNum"
        :total="table.total"
        :pageSize="table.pageSize"
        @change="handleCurrentChange"
      ></FPagination>
      <!-- <a-pagination
        v-model:current="table.pageNum"
        v-model:page-size="table.pageSize"
        :total="table.total"
        show-total
        show-jumper
        @change="handleCurrentChange"
      /> -->
      <!-- <a-button class="mr-24">上一页</a-button>
      <a-button class="mr-24">下一页</a-button>
      <div class="total">共56页</div> -->
    </div>
  </div>
  <UserDetail v-model="visible" :record="curRecord" :mapKey="mapKey"></UserDetail>
</template>

<script lang="ts" setup>
import { getRiskUserList, getUserList } from '@/service/vocOverview'
import UserDetail from './UserDetail/index.vue'
import { useTable } from '@/hooks/useTable'
import useComQueryStore from '@/stores/modules/comQuery'
import { emitionColorMap } from '@/constant'
import { indexDetectionGetUserList } from '@/service/experienceTest'
import useDrillDownStore from '@/stores/modules/drillDown'
import { focusGetUserList } from '@/service/focus'
import useFocusStore from '@/stores/modules/focus'
import { insightGetUserList } from '@/service/insights'
import { warningGetRiskUserList } from '@/service/riskWarning'
import { formatToTwoDecimal } from '@/utils'
import { getUserListByPraise } from '@/service/praise'
import { value2rem } from '@/utils/rem'

interface Props {
  mapKey: MapKey
}
const { mapKey } = defineProps<Props>()

const comQueryStore = useComQueryStore()
const drillDownStore = useDrillDownStore()
const focusStore = useFocusStore()

const visible = ref(false)

const curRecord = ref({})

const queryApi = computed(() => {
  const queryApiMap: Record<MapKey, any> = {
    vocView: getUserList,
    vocViewInRisk: getRiskUserList,
    testing: indexDetectionGetUserList,
    focus: focusGetUserList,
    insights: insightGetUserList,
    warning: warningGetRiskUserList,
    praise: getUserListByPraise
  }
  return queryApiMap[mapKey]
})

const handleDetail = (record: any) => {
  curRecord.value = record
  visible.value = true
}

const { table, sortOpts, handleSortChange, getList, handleCurrentChange } = useTable({
  queryApi: queryApi.value
})

const baseFormMap = computed(() => {
  const map: Record<string, any> = {
    vocView: { ...comQueryStore.requiredForm, ...comQueryStore.formByVocView },
    vocViewInRisk: { ...comQueryStore.requiredForm, ...comQueryStore.formByVocView },
    testing: { ...comQueryStore.requiredForm, ...comQueryStore.formByTesting },
    focus: { ...comQueryStore.requiredForm, ...comQueryStore.formByFocus },
    insights: { ...comQueryStore.requiredForm, ...comQueryStore.formByInsights },
    warning: { ...comQueryStore.requiredForm, ...comQueryStore.formByWarning },
    praise: { ...comQueryStore.requiredForm, ...comQueryStore.formByPraise }
  }
  return map[mapKey]
})

onMounted(() => {
  table.filter = baseFormMap.value
  table.filter.order = undefined
  if (mapKey === 'vocViewInRisk') {
    table.filter.riskId = drillDownStore.riskInitData.riskId || undefined
    table.filter.sentimentList = ['负面']
  }
  if (mapKey === 'testing') {
    table.filter.labelTypeLevelFourList = drillDownStore.fourTagName
    table.filter.userJourneyCode = drillDownStore.indexInitData.userJourneyCode
    table.filter.labelTypeLevelFirstList = drillDownStore.indexInitData.labelTypeLevelFirstList
  }

  if (mapKey === 'focus') {
    table.filter.tagType = focusStore.tagType || undefined

    table.filter.topicList = drillDownStore.topicList

    table.filter = Object.assign(table.filter, drillDownStore.focusInitData.labelTypeLevelList)

    if (['PROD', 'SERVICE'].includes(focusStore.tagType)) {
      table.filter.faultLevelList = undefined
      table.filter.sentimentList = drillDownStore.focusEmotionName
    }
    if (['QY'].includes(focusStore.tagType)) {
      table.filter.sentimentList = undefined
      table.filter.faultLevelList = drillDownStore.focusEmotionName
    }
  }

  if (mapKey === 'insights') {
    table.filter.tagType = drillDownStore.insightTagType

    if (drillDownStore.insightInitData.level?.toString() === '2') {
      table.filter.labelTypeLevelSecondList = drillDownStore.insightTagName
      table.filter.labelTypeLevelFourList = undefined
    }
    if (drillDownStore.insightInitData.level?.toString() === '4') {
      table.filter.labelTypeLevelSecondList = undefined
      table.filter.labelTypeLevelFourList = drillDownStore.insightTagName
    }
    table.filter.mentionCarSeries = drillDownStore.insightInitData?.mentionCarSeries
    // table.filter.carSeries = drillDownStore.insightInitData?.carSeries
    // 本竞品车系同时提及分析 默认传本品车系
    if (drillDownStore.insightInitData?.carSeriesList) {
      table.filter.carSeriesList = drillDownStore.insightInitData?.carSeriesList
    }
    table.filter.labelTypeLevelFirstList = drillDownStore.insightInitData.labelTypeLevelFirstList
    table.filter.reportType = drillDownStore.insightInitData?.reportType
  }

  if (mapKey === 'warning') {
    table.filter.riskId = drillDownStore.riskWarningInitData.riskId || undefined
    table.filter.tagLabelList = drillDownStore.riskWarningInitData.tagLabelList || undefined
    table.filter.sentimentList = ['负面']
  }

  if (mapKey === 'praise') {
    const { viewType, labelType } = drillDownStore.praiseInitData

    table.filter.labelTypeList = labelType ? [labelType] : undefined

    if (viewType === 1) {
      table.filter.bigAreaIds = drillDownStore.praiseInitData?.data?.tagCode || undefined
    } else {
      table.filter.bigAreaIds = undefined
    }

    if (viewType === 2) {
      table.filter.carSeries = drillDownStore.praiseInitData?.data?.tagName || undefined
    } else {
      table.filter.carSeries = undefined
    }

    if ([3, 4].includes(viewType)) {
      table.filter.topicList = drillDownStore.praiseInitData?.tagName
        ? [drillDownStore.praiseInitData?.tagName]
        : undefined
      table.filter.tagLabelList = drillDownStore.praiseInitData?.tagLabelList
    } else {
      table.filter.topicList = undefined
      table.filter.tagLabelList = undefined
    }

    table.filter = Object.assign(table.filter, drillDownStore.praiseInitData.labelTypeLevelList)
  }

  getList()
})
</script>

<style lang="scss" scoped>
.user-list {
  padding: 24px;
  height: calc(100% - 64px);
  min-height: 500px;
  &.mhc {
    min-height: calc(100vh - 64px);
  }
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
