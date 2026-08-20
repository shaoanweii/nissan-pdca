<script setup lang="ts">
import { usePageLoading } from '@/hooks/usePageLoading'
import { useTable } from '@/hooks/useTable'
import {
  findReportList,
  generateReport,
  getConditions,
  getRegionTree,
  getTagType
} from '@/service/report'
import { useUserStoreWithOut } from '@/stores/modules/user'
import to from 'await-to-js'
import { debounce } from 'lodash-es'
import axios from 'axios'
import { Message } from '@arco-design/web-vue'
import TimeFrame from './TimeFrame.vue'
import BuildStatus from './BuildStatus.vue'
import { findCarSeries, findChannel, findTagLabelType } from '@/service/common'
import { handleTagPath2CheckStrictly } from '@/utils'
import {
  buildUniqueTree,
  getArrByResult,
  getMatchingNames,
  getTagNameByCode,
  updateResultWithNameAndCount
} from '../helper'
import useCondition from '@/hooks/useCondition'

defineOptions({
  name: 'VocStatPane'
})

const { conditions } = useCondition(getConditions)
const { loadStart, loadDone } = usePageLoading()

const channelOptions = ref<any[]>([])
const carSeriesOptions = ref<any[]>([])
const tagOptions = ref<any[]>([])
const brandOptions = ref<any[]>([])

const timer = ref<any[]>([])
const userStore = useUserStoreWithOut()
const { table, handleReset } = useTable({
  queryApi: () =>
    new Promise(reslove =>
      reslove({
        list: [],
        total: 0
      })
    ) as any,
  resetKeyWhiteList: ['clientId', 'brandCode']
})

const timerId = ref()

/**
 * @description: 定时刷新生成状态
 * @return {*}
 */
const pollingReportList = () => {
  const isGenterateReport = table.list?.some((item: any) => {
    return item.status === '0'
  })
  if (isGenterateReport) {
    if (timerId.value) return
    timerId.value = setInterval(() => {
      getReportList()
    }, 10000)
  } else {
    clearInterval(timerId.value)
    timerId.value = undefined
  }
}

const getReportList = async () => {
  const [errs, data] = await to(findReportList())
  if (errs) {
    Message.error(errs.message)
  }
  table.list = data?.result || []
  pollingReportList()
}

/**
 * @description: 根据品牌获取渠道
 * @return {*}
 */
const getChannelOptions = async () => {
  const params = {
    clientId: userStore.clientId,
    roleId: userStore.roleId,
    brandCode: getBrandName.value
  }
  const [errs2, data2] = await to(findChannel(params))
  if (errs2) {
    Message.error(errs2.message)
  }
  channelOptions.value = data2?.result || []
}

/**
 * @description: 根据品牌获取车系
 * @return {*}
 */
const getCarSeriesOptions = async () => {
  const params = {
    clientId: userStore.clientId,
    roleId: userStore.roleId,
    brandCode: getBrandName.value
  }
  const [errs3, data3] = await to(findCarSeries(params))
  if (errs3) {
    Message.error(errs3.message)
  }
  carSeriesOptions.value = data3?.result || []
}

/**
 * @description: 根据品牌、标签类型、获取标签(内容分类)
 * @return {*}
 */
const getTagLabelType = async () => {
  const params = {
    clientId: userStore.clientId,
    roleId: userStore.roleId,
    brandCode: getBrandName.value,
    tagLibType: table.filter.labelTypeCode
  }
  const [errs4, data4] = await to(findTagLabelType(params))
  if (errs4) {
    Message.error(errs4.message)
  }
  tagOptions.value = data4?.result || []
}

const tagTypeOptions = ref<any[]>([])

/**
 * @description: 根据品牌获取标签类型
 * @return {*}
 */
const getOneTagType = async () => {
  const [errs4, data4] = await to(getTagType(table.filter.brandCode))
  if (errs4) {
    Message.error(errs4.message)
  }
  tagTypeOptions.value = data4?.result || []
}

/**
 * @description: 标签类型更新
 * @return {*}
 */
const handleTagTypeChange = () => {
  getTagLabelType()
}

const dlrShortOptions = ref<any[]>([])

/**
 * @description: 根据品牌获取专营店
 * @return {*}
 */
const getDlrShort = async () => {
  const params = {
    clientId: userStore.clientId,
    brandCode: getBrandName.value
  }
  const [errs4, data4] = await to(getRegionTree(params))
  if (errs4) {
    Message.error(errs4.message)
  }
  dlrShortOptions.value = data4?.result || []
}

// 品牌中文
const getBrandName = computed(() => {
  const brand = brandOptions.value?.find((item: any) => item.key === table.filter.brandCode)
  return brand?.value
})

// 车系中文
const carSeriesNameList = () => {
  return carSeriesOptions.value
    ?.filter((item: any) => table.filter.carSeriesCode?.includes(item.code))
    ?.map((item: any) => item.name)
}

/**
 * @description: 获取conditions中的中文
 * @param {*} key
 * @param {*} values
 * @return {*}
 */
const conditions2Name = (key: string, values: any[]) => {
  if (!values || values?.length === 0) return []
  return conditions[key]?.filter((item: any) => values?.includes(item.key))?.map(item => item.value)
}

const conditions2NameBySingle = (key: string, value: string) => {
  return conditions[key]?.find((item: any) => value === item.key)?.value
}

/**
 * @description: 获取标签中文
 * @return {*}
 */
const getTagLabelNameList = () => {
  const field = { value: 'tagCode', label: 'tagName', children: 'child' }
  if (table.filter.labelCodeList) {
    const result = handleTagPath2CheckStrictly(table.filter.labelCodeList, tagOptions.value)
    const _getTagNameByCode = getTagNameByCode(tagOptions.value, result, field)
    const nameList = getArrByResult(_getTagNameByCode)
    return nameList
  }
  return
}

/**
 * @description: 获取渠道中文
 * @return {*}
 */
const getChannelNameList = () => {
  const field = { value: 'code', label: 'name', children: 'child', parentId: 'parentId' }
  if (table.filter.channelCode) {
    const result = buildUniqueTree(table.filter.channelCode)

    const _updateResultWithNameAndCount = updateResultWithNameAndCount(
      channelOptions.value,
      result,
      field
    )
    const _getMatchingNames = getMatchingNames(_updateResultWithNameAndCount)
    return _getMatchingNames
  }
}

/**
 * @description: 获取专营店中文名称
 * @return {*}
 */
const getDlrShortName = () => {
  const field = { value: 'id', label: 'name', children: 'child', parentId: 'parentId' }
  if (table.filter.dlrShortCode) {
    const result = buildUniqueTree(table.filter.dlrShortCode)

    const _updateResultWithNameAndCount = updateResultWithNameAndCount(
      dlrShortOptions.value,
      result,
      field
    )
    const _getMatchingNames = getMatchingNames(_updateResultWithNameAndCount)
    return _getMatchingNames
  }
}

/**
 * @description: 获取标签类型中文
 * @return {*}
 */
const getLabelTypeName = () => {
  const labelType = tagTypeOptions.value?.find(
    (item: any) => item.value === table.filter.labelTypeCode
  )

  return labelType?.key
}

const timeRef = ref()
const setDefForm = () => {
  table.filter.clientId = userStore.clientId

  table.filter.brandCode = brandOptions.value?.[0]?.key

  table.filter.labelTypeCode = 'PROD'

  timeRef.value?.setDefTime()

  // table.filter.custCodeList = ['unlimited']
  // table.filter.genderCode = 'unlimited'
  // table.filter.ageCode = ['unlimited']
  // table.filter.vocAgeCode = ['unlimited']
}

const init = () => {
  brandOptions.value = userStore.brands
  setDefForm()

  getChannelOptions()
  getCarSeriesOptions()
  getTagLabelType()
  getOneTagType()
  getDlrShort()

  getReportList()
}

init()

const handleBrandChange = () => {
  getChannelOptions()
  getCarSeriesOptions()
  getTagLabelType()
  getOneTagType()
  getDlrShort()
}

const handleGenerateReport = debounce(async (params: any) => {
  loadStart()
  await to(generateReport(params))
  getReportList()
  loadDone()
}, 300)

const handleQuery = () => {
  const params = {
    clientId: userStore.clientId,
    // 品牌
    brandName: getBrandName.value,
    brandCode: table.filter.brandCode,
    // 车系
    carSeriesName: carSeriesNameList(),
    carSeriesCode: table.filter.carSeriesCode,
    // 渠道
    channelName: getChannelNameList(),
    channelCode: getArrByResult(table.filter.channelCode),
    // 专营店
    dlrShortName: getDlrShortName(),
    dlrShortCode: getArrByResult(table.filter.dlrShortCode),
    tempDlrShortCodeList: table.filter.dlrShortCode,
    // 标签类型
    labelTypeName: getLabelTypeName(),
    labelTypeCode: table.filter.labelTypeCode,
    // 标签
    labelNameList: getTagLabelNameList(),
    tagLabelList: table.filter.labelCodeList,
    // 客户类型
    custType: conditions2NameBySingle('customerType', table.filter.custCode),
    custCode: table.filter.custCode,
    // 客户性别
    gender: conditions2NameBySingle('customerGender', table.filter.genderCode),
    genderCode: table.filter.genderCode,
    // 车主年龄
    age: conditions2Name('carOwnerAge', table.filter.ageCode),
    ageCode: table.filter.ageCode,
    // 车辆年龄
    vocAge: conditions2Name('carAge', table.filter.vocAgeCode),
    vocAgeCode: table.filter.vocAgeCode,
    // 时间范围
    startDate: timer.value[0],
    endDate: timer.value[1]
  }

  console.log('params', params)
  handleGenerateReport(params)
}
const handleResetForm = () => {
  setDefForm()
}

const getFileUrl = (fileUrl: string) => {
  let _fileUrl = ''
  if (fileUrl.startsWith('http')) {
    _fileUrl = fileUrl
  } else {
    _fileUrl = `${window.location.origin}${fileUrl}`
  }

  return _fileUrl
}

const getFileName = (file: string) => {
  const fileKeyArr = file?.split('/')
  const str = fileKeyArr[fileKeyArr?.length - 1] || file
  return decodeURIComponent(str)
}

const downloadExcel = async (record: any) => {
  try {
    const response = await axios({
      method: 'get',
      url: getFileUrl(record.reportUrl),
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    // link.download = '6b8712f88edc33e25facb484fbc5891e.xlsx'
    // link.download = record.reportName + '.xlsx'
    link.download = getFileName(record.reportUrl)
    document.body.appendChild(link)
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('下载出错:', error)
  }
}

const handleDownLoad = debounce((record: any) => {
  if (!record.reportUrl) {
    Message.info('暂无报告')
    return
  }
  // const fileUrl =
  //   'http://172.16.80.16:30125/test/%E5%A3%B0%E9%9F%B3%E6%8A%A5%E5%91%8A?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=voc-cloud%2F20241017%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241017T012235Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=4575d31e2d005f83f254fda491e21b3aed300d3f95c34fea3b91b2b34d00fc12'
  downloadExcel(record)
  // axios({
  //   url: record.reportUrl,
  //   method: 'GET',
  //   responseType: 'blob'
  // })
  //   .then(response => {
  //     const url = window.URL.createObjectURL(new Blob([response.data]))
  //     const link = document.createElement('a')
  //     link.href = url
  //     link.setAttribute('download', `${record.reportName}.pptx`)
  //     document.body.appendChild(link)
  //     link.click()
  //     document.body.removeChild(link)
  //   })
  //   .catch(error => {
  //     console.error('下载文件出错：', error)
  //   })
}, 500)
</script>

<template>
  <div class="qc-content border-radius-0088">
    <a-form layout="inline" :model="table.filter" class="clear-form-item-margin">
      <a-grid class="w-full" :cols="4" :col-gap="24" :row-gap="16">
        <a-grid-item>
          <a-form-item label="时间范围">
            <TimeFrame v-model="timer" ref="timeRef"></TimeFrame>
          </a-form-item>
        </a-grid-item>
        <a-grid-item>
          <a-form-item label="品牌车系">
            <a-row class="w-full">
              <a-col :span="8">
                <a-select
                  v-model="table.filter.brandCode"
                  placeholder="全部"
                  @change="handleBrandChange"
                >
                  <a-option
                    v-for="(item, index) of brandOptions"
                    :key="index"
                    :label="item.value"
                    :value="item.key"
                  />
                </a-select>
              </a-col>
              <a-col :span="16">
                <FSelect
                  v-model="table.filter.carSeriesCode"
                  :multiple="true"
                  :options="carSeriesOptions"
                  placeholder="全部车系"
                  :subLength="4"
                  bgColor=""
                  cRadius="radius-0"
                  cBorder=""
                  resetTagBg
                  :field-names="{ value: 'code', label: 'name' }"
                />
              </a-col>
            </a-row>
          </a-form-item>
        </a-grid-item>
        <a-grid-item>
          <a-form-item label="数据渠道">
            <FCascader
              key="channel"
              v-model="table.filter.channelCode"
              :options="channelOptions"
              :subLength="15"
              :check-strictly="false"
              :path-mode="true"
              :allowClear="true"
              placeholder="全部渠道"
              bgColor=""
              resetTagBg
              :field-names="{ value: 'code', label: 'name', children: 'child' }"
              class="w-full"
            ></FCascader>
          </a-form-item>
        </a-grid-item>
        <a-grid-item>
          <a-form-item label="区域专营店">
            <FCascader
              key="dlrShortCode"
              v-model="table.filter.dlrShortCode"
              :options="dlrShortOptions"
              :subLength="15"
              :check-strictly="false"
              :path-mode="true"
              :allowClear="true"
              placeholder="全部"
              bgColor=""
              resetTagBg
              :field-names="{ value: 'id', label: 'name', children: 'child' }"
              class="w-full"
            ></FCascader>
          </a-form-item>
        </a-grid-item>
        <a-grid-item>
          <a-form-item label="内容分类">
            <a-row class="w-full">
              <a-col :span="8">
                <a-select
                  v-model="table.filter.labelTypeCode"
                  placeholder="全部"
                  :data-testid="`accountmanagement-10002`"
                  @change="handleTagTypeChange"
                >
                  <a-option
                    v-for="(item, index) of tagTypeOptions"
                    :key="index"
                    :label="item.key"
                    :value="item.value"
                  />
                </a-select>
              </a-col>
              <a-col :span="16">
                <FCascader
                  key="tagLabel"
                  v-model="table.filter.labelCodeList"
                  :options="tagOptions"
                  :check-strictly="false"
                  :path-mode="true"
                  :allowClear="true"
                  placeholder="全部分类"
                  :subLength="5"
                  bgColor=""
                  resetTagBg
                  :field-names="{ value: 'tagCode', label: 'tagName', children: 'child' }"
                  class="w-full"
                ></FCascader>
              </a-col>
            </a-row>
          </a-form-item>
        </a-grid-item>
        <a-grid-item>
          <a-form-item label="客户类型">
            <a-select
              v-model="table.filter.custCode"
              placeholder="不限"
              allow-clear
              :data-testid="`accountmanagement-10002`"
            >
              <a-option
                v-for="(item, index) of conditions.customerType"
                :key="index"
                :label="item.value"
                :value="item.key"
              />
            </a-select>
          </a-form-item>
        </a-grid-item>
        <a-grid-item>
          <a-form-item label="客户性别">
            <a-select
              v-model="table.filter.genderCode"
              placeholder="不限"
              allow-clear
              :data-testid="`accountmanagement-10002`"
              class="w-full"
            >
              <a-option
                v-for="(item, index) of conditions.customerGender"
                :key="index"
                :label="item.value"
                :value="item.key"
              />
            </a-select>
          </a-form-item>
        </a-grid-item>
        <a-grid-item>
          <a-form-item label="车主年龄">
            <a-select
              v-model="table.filter.ageCode"
              placeholder="不限"
              allow-clear
              multiple
              :max-tag-count="1"
              :data-testid="`accountmanagement-10002`"
            >
              <a-option
                v-for="(item, index) of conditions.carOwnerAge"
                :key="index"
                :label="item.value"
                :value="item.key"
              />
            </a-select>
          </a-form-item>
        </a-grid-item>
        <a-grid-item>
          <a-form-item label="车辆年龄">
            <a-select
              v-model="table.filter.vocAgeCode"
              placeholder="不限"
              allow-clear
              multiple
              :max-tag-count="1"
              :data-testid="`accountmanagement-10002`"
            >
              <a-option
                v-for="(item, index) of conditions.carAge"
                :key="index"
                :label="item.value"
                :value="item.key"
              />
            </a-select>
          </a-form-item>
        </a-grid-item>
        <a-grid-item :offset="2">
          <div class="flex-align-center justify-end">
            <a-button type="primary" class="acro-btn-def flex-align-center" @click="handleQuery">
              <i class="ri-send-plane-line font-16 mr-8"></i>
              <span>生成报告</span>
            </a-button>
            <a-button
              class="ml-16 acro-btn-def-plain flex-align-center"
              @click="() => handleReset(handleResetForm)"
            >
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
      <a-table class="mt-16" :data="table.list" :pagination="false">
        <template #columns>
          <a-table-column title="报告名称" ellipsis tooltip :width="260">
            <template #cell="{ record }">
              <div class="flex-align-center ellipsis-single-line">
                <i class="ri-file-warning-fill font-16 color-2c9bde"></i>
                <div class="ml-8 color-555">
                  {{ record.reportName }}
                </div>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="时间范围" ellipsis tooltip :width="220">
            <template #cell="{ record }">
              <span>{{ record.timeScope }}</span>
            </template>
          </a-table-column>
          <a-table-column title="品牌车系" ellipsis tooltip :width="200">
            <template #cell="{ record }">
              <span>{{ record.brandCarSeries }}</span>
            </template>
          </a-table-column>
          <a-table-column title="数据渠道" ellipsis tooltip :width="150">
            <template #cell="{ record }">
              <span>{{ record.channel }}</span>
            </template>
          </a-table-column>

          <a-table-column title="区域专营店" ellipsis tooltip :width="150">
            <template #cell="{ record }">
              <span>{{ record.dlrShort }}</span>
            </template>
          </a-table-column>
          <a-table-column title="内容分类" ellipsis tooltip :width="150">
            <template #cell="{ record }">
              <span>{{ record.tag }}</span>
            </template>
          </a-table-column>
          <a-table-column title="客户类型" ellipsis tooltip :width="150">
            <template #cell="{ record }">
              <span>{{ record.custType }}</span>
            </template>
          </a-table-column>
          <a-table-column title="客户性别" :width="150">
            <template #cell="{ record }">
              <span>{{ record.gender }}</span>
            </template>
          </a-table-column>
          <a-table-column title="车主年龄" ellipsis tooltip :width="180">
            <template #cell="{ record }">
              <span>{{ record.age }}</span>
            </template>
          </a-table-column>
          <a-table-column title="车辆年龄" ellipsis tooltip :width="180">
            <template #cell="{ record }">
              <span>{{ record.vocAge }}</span>
            </template>
          </a-table-column>
          <a-table-column title="生成时间" :width="180">
            <template #cell="{ record }">
              <span>{{ record.createTime }}</span>
            </template>
          </a-table-column>
          <a-table-column title="状态" :width="150">
            <template #cell="{ record }">
              <BuildStatus
                v-if="record.status"
                :status="record.status"
                :status-text="record.statusText"
              ></BuildStatus>
            </template>
          </a-table-column>
          <a-table-column fixed="right" title="操作" :width="150">
            <!-- eslint-disable-next-line vue/no-unused-vars -->
            <template #cell="{ record }">
              <a-button
                :disabled="record.status !== '1'"
                type="text"
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
