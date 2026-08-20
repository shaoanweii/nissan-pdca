<template>
  <a-drawer
    :width="value2rem(1200)"
    :visible="visible"
    @open="handleOpen"
    @cancel="handleCancel"
    @close="handleClose"
    unmount-on-close
    :data-testid="`account-form-drawer`"
  >
    <template #title>{{ titleStr }}</template>
    <!-- :rules="rules" -->
    <a-form ref="formRef" :model="roleModel" :style="{ width: px2rem('900px') }">
      <a-form-item label="角色名称" required>
        <a-input
          v-model="roleModel.roleName"
          class="border-def radius-4 bg-white"
          :style="{ width: px2rem('580px') }"
        ></a-input>
      </a-form-item>

      <a-form-item label="关联品牌" required>
        <FBtnCheckGroup v-model:index="activeIndex" v-model="brandList"></FBtnCheckGroup>
      </a-form-item>

      <a-form-item label="关联标签" v-if="roleModel.brandGroup?.length" required>
        <a-row style="width: 580px">
          <a-col :span="24" class="flex-align-center">
            <FCheckIBox1
              :key="`${activeIndex}-prod-all`"
              v-model:checked="roleModel.brandGroup[activeIndex].prodChecked"
              v-model:indeterminate="roleModel.brandGroup[activeIndex].prodIndeterminate"
              :disabled="!roleModel.brandGroup[activeIndex].relationBuTag"
              @change="(val: any) => tagTypeChange('PROD', val)"
              label="产品类"
            />
            <FCascader
              ref="prodTagRef"
              :key="`${activeIndex}-prod`"
              v-model="roleModel.brandGroup[activeIndex].businessTagIds"
              :options="roleModel.brandGroup[activeIndex].relationBuTag || []"
              multiple
              allow-clear
              :max-tag-count="1"
              :field-names="{ value: 'tagCode', label: 'tagName', children: 'child' }"
              placeholder="请选择"
              class="flex-1 ml-16 border-def radius-4 bg-white overflow-hidden"
              @indeterminateCheckedStatus="(val: any) => indeterminateCheckedStatus('PROD', val)"
            ></FCascader>
          </a-col>

          <a-col :span="24" class="mt-14 flex-align-center">
            <FCheckIBox1
              :key="`${activeIndex}-service-all`"
              v-model:checked="roleModel.brandGroup[activeIndex].serviceChecked"
              v-model:indeterminate="roleModel.brandGroup[activeIndex].serviceIndeterminate"
              :disabled="!roleModel.brandGroup[activeIndex].serviceTag"
              @change="(val: any) => tagTypeChange('SERVICE', val)"
              label="服务类"
            />
            <FCascader
              ref="serviceTagRef"
              :key="`${activeIndex}-service`"
              v-model="roleModel.brandGroup[activeIndex].serviceTagIds"
              :options="roleModel.brandGroup[activeIndex].serviceTag || []"
              multiple
              allow-clear
              :max-tag-count="1"
              :field-names="{ value: 'tagCode', label: 'tagName', children: 'child' }"
              placeholder="请选择"
              class="flex-1 ml-16 border-def radius-4 bg-white overflow-hidden"
              @indeterminateCheckedStatus="(val: any) => indeterminateCheckedStatus('SERVICE', val)"
            ></FCascader>
          </a-col>

          <a-col :span="24" class="mt-14 flex-align-center">
            <FCheckIBox1
              :key="`${activeIndex}-qy-all`"
              v-model:checked="roleModel.brandGroup[activeIndex].qyChecked"
              v-model:indeterminate="roleModel.brandGroup[activeIndex].qyIndeterminate"
              :disabled="!roleModel.brandGroup[activeIndex].qualityTag"
              @change="(val: any) => tagTypeChange('QY', val)"
              label="品质类"
            />
            <FCascader
              ref="qyTagRef"
              :key="`${activeIndex}-qy`"
              v-model="roleModel.brandGroup[activeIndex].qualityTagIds"
              :options="roleModel.brandGroup[activeIndex].qualityTag || []"
              multiple
              allow-clear
              :max-tag-count="1"
              :field-names="{ value: 'tagCode', label: 'tagName', children: 'child' }"
              placeholder="请选择"
              class="flex-1 ml-16 border-def radius-4 bg-white overflow-hidden"
              @indeterminateCheckedStatus="(val: any) => indeterminateCheckedStatus('QY', val)"
            ></FCascader>
          </a-col>
        </a-row>
      </a-form-item>

      <a-form-item label="数据渠道" v-if="roleModel.brandGroup?.length" required>
        <FCascader
          :key="activeIndex"
          v-model="roleModel.brandGroup[activeIndex].channelIds"
          :options="roleModel.brandGroup[activeIndex].dataChannel || []"
          multiple
          allow-clear
          :max-tag-count="1"
          :subLength="60"
          :field-names="{ value: 'code', label: 'name', children: 'child' }"
          placeholder="请选择"
          class="w-full border-def radius-4 bg-white overflow-hidden"
          :style="{ width: px2rem('580px') }"
        ></FCascader>
        <!-- <a-cascader
          :key="activeIndex"
          v-model="roleModel.brandGroup[activeIndex].channelIds"
          :options="roleModel.brandGroup[activeIndex].dataChannel"
          multiple
          allow-clear
          :max-tag-count="1"
          :field-names="{ value: 'id', label: 'name', children: 'child' }"
          placeholder="请选择"
        /> -->
      </a-form-item>

      <a-form-item label="对应车系" v-if="roleModel.brandGroup?.length" required>
        <!--  :isChange="form.operation === 'edit'" -->
        <FSelect
          :key="activeIndex"
          v-model="roleModel.brandGroup[activeIndex].seriesIds"
          :multiple="true"
          allow-clear
          :subLength="30"
          placeholder="请选择"
          :options="roleModel.brandGroup[activeIndex].relationCar || []"
          :field-names="{ value: 'carSeriesCode', label: 'carSeriesName' }"
          class="overflow-hidden"
          :style="{ width: px2rem('580px') }"
        />
      </a-form-item>

      <a-form-item label="对应区域" v-if="roleModel.brandGroup?.length" required>
        <FCascader
          :key="activeIndex"
          v-model="roleModel.brandGroup[activeIndex].areaIds"
          :options="roleModel.brandGroup[activeIndex].area || []"
          multiple
          allow-clear
          :max-tag-count="1"
          :subLength="60"
          :field-names="{ value: 'code', label: 'name', children: 'child' }"
          placeholder="请选择"
          class="w-full border-def radius-4 bg-white overflow-hidden"
          :style="{ width: px2rem('580px') }"
        ></FCascader>
      </a-form-item>

      <a-form-item label="权限配置" required>
        <PermissionTree
          ref="permissionTreeRef"
          v-if="treeData.appKanban?.length > 0"
          :tree="treeData"
        ></PermissionTree>
      </a-form-item>

      <a-form-item field="contact" label="备注">
        <a-textarea
          v-model="roleModel.remark"
          placeholder="请输入备注"
          allow-clear
          class="border-def radius-4 bg-white"
        />
      </a-form-item>

      <a-form-item label="状态">
        <a-radio-group v-model="roleModel.enabled" :data-testid="`account-form-10007`">
          <a-radio :value="1">启用</a-radio>
          <a-radio :value="0">禁用</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>

    <template #footer>
      <div class="text-align-left">
        <a-button type="primary" class="acro-btn-def" @click="handleOk">确定</a-button>
        <a-button class="ml-16 acro-btn-def-plain" @click="handleCancel">取消</a-button>
      </div>
    </template>
  </a-drawer>
</template>
<script setup lang="ts">
import type { Form } from '@/types/hooks/table'
import { Message } from '@arco-design/web-vue'
import { debounce } from '@arco-design/web-vue/es/_utils/debounce'
import { inject } from 'vue'
import useUserStore from '@/stores/modules/user'
import PermissionTree from './PermissionTree.vue'
import { getListByRoleId, queryMenuPermissionList, saveOrUpdateRole } from '@/service/sysRole'
import to from 'await-to-js'
import { usePageLoading } from '@/hooks/usePageLoading'
import { cloneDeep } from 'lodash-es'
import { value2rem, px2rem } from '@/utils/rem'

const emit = defineEmits(['refreshList'])
const visible = defineModel({ default: false })
const form = inject('form') as Form
let titleStr = ref('')
let userStore = useUserStore()
const activeIndex = ref(0)

const { prodTagRef, serviceTagRef, qyTagRef, tagTypeChange } = useLinkTag()

const { loadStart, loadDone } = usePageLoading()

const indeterminateCheckedStatus = (tagType: Common.TagType, val: any) => {
  if (tagType === 'PROD') {
    roleModel.value.brandGroup[activeIndex.value].prodIndeterminate = val?.indeterminate
    roleModel.value.brandGroup[activeIndex.value].prodChecked = val?.checked
  } else if (tagType === 'SERVICE') {
    roleModel.value.brandGroup[activeIndex.value].serviceIndeterminate = val?.indeterminate
    roleModel.value.brandGroup[activeIndex.value].serviceChecked = val?.checked
  } else if (tagType === 'QY') {
    roleModel.value.brandGroup[activeIndex.value].qyIndeterminate = val?.indeterminate
    roleModel.value.brandGroup[activeIndex.value].qyChecked = val?.checked
  }
}
const handleOpen = async () => {
  initializeFormData()
}

const roleModel = ref<Record<any, any>>({
  roleId: '',
  roleName: '',
  enabled: 1,
  remark: '',
  brandGroup: []
})
// 权限配置
const treeData = ref<Record<any, any>>({
  allPermission: false,
  isExport: false,
  isDownload: true,
  appKanban: []
})
// 关联品牌
const brandList = ref<any[]>([])
const permissionTreeRef = ref()

const initOptions = (options: any[], type?: string) => {
  if (!options || options?.length === 0) return

  const _options = cloneDeep(options)
  brandList.value = _options.map((el: any, index: number) => ({
    value: el.brandCode,
    label: el.brandName,
    checked: type === 'edit' ? el.checked : false,
    active: index === 0
  }))
  roleModel.value.brandGroup = _options

  treeData.value.isExport = _options[0].isExport
  // treeData.value.isDownload = _options[0].isDownload
  // 处理全选与半选状态
  treeData.value.appKanban = _options[0].appKanban?.map((el: any) => {
    let indeterminate = false
    let checked = el.checked
    if (el.children) {
      const result = el.children.some((item: any) => item.checked)
      const allChecked = el.children.every((item: any) => item.checked)
      if (allChecked) {
        indeterminate = false
        checked = allChecked
      } else {
        checked = false
        if (result) {
          indeterminate = true
        }
      }
    }
    return {
      ...el,
      checked: checked,
      indeterminate
    }
  })
  console.log('_options[0].appKanban', _options[0].appKanban)

  treeData.value.allPermission = _options[0].allPermission

  if (type === 'add') {
    // 默认选择下载图表
    // treeData.value.isDownload = true
    // 默认选择总览页面
    // treeData.value.appKanban = _options[0].appKanban.map((el: any) => {
    //   return {
    //     ...el,
    //     checked: el.permissionKey === 'vocView' ? true : el.checked
    //   }
    // })

    nextTick(() => {
      // 默认全选权限配置
      permissionTreeRef.value?.allChange(true)
    })
  }
  if (type === 'edit') {
    roleModel.value.roleName = _options[0].roleName
    roleModel.value.remark = _options[0].remark
    roleModel.value.enabled = _options[0].status
    roleModel.value.roleId = _options[0].roleId
    treeData.value.isDownload = _options[0].isDownload

    // console.log('roleModel.value.brandGroup', roleModel.value.brandGroup)

    nextTick(() => {
      // 回显的时候关联产品 品质  服务
      roleModel.value.brandGroup.forEach((item: any) => {
        if (item.businessTagIds) {
          const result = prodTagRef.value?.indeterminateCheckedStatus(item.businessTagIds, false)
          item.prodIndeterminate = result?.indeterminate
          item.prodChecked = result?.checked
        }
        if (item.serviceTagIds) {
          const result = serviceTagRef.value?.indeterminateCheckedStatus(item.serviceTagIds, false)
          item.serviceIndeterminate = result?.indeterminate
          item.serviceChecked = result?.checked
        }
        if (item.qualityTagIds) {
          const result = qyTagRef.value?.indeterminateCheckedStatus(item.qualityTagIds, false)
          item.qyIndeterminate = result?.indeterminate
          item.qyChecked = result?.checked
        }
      })
    })
  }
}

const initializeFormData = async () => {
  if (form.operation == 'add') {
    titleStr.value = '新增角色'
    const [, data] = await to(queryMenuPermissionList({ clientId: userStore.clientId }))
    initOptions(data?.result, 'add')
  } else if (form.operation == 'edit') {
    titleStr.value = '编辑角色'
    const [, data] = await to(
      getListByRoleId({ clientId: userStore.clientId, roleId: form.data.roleId })
    )
    initOptions(data?.result, 'edit')
  }
}

const handleClose = () => {
  // resetObjectValues(formData)
  activeIndex.value = 0

  roleModel.value.roleName = ''
  roleModel.value.enabled = 1
  roleModel.value.remark = ''
  roleModel.value.roleId = ''
  roleModel.value.brandGroup = []

  treeData.value.allPermission = false
  treeData.value.isExport = false
  treeData.value.isDownload = true
  treeData.value.appKanban = []
}

const handleCancel = () => {
  // form.visible = false
  visible.value = false
}

/**
 * @description: 递归获取id集合
 * @param {*} arr
 * @param {*} ids
 * @return {*}
 */
const getDeepIds = (arr: any[], ids: string[]) => {
  arr.forEach(el => {
    if (el.checked) {
      ids.push(el.id)
    }
    // 处理菜单子元素
    if (el.children) {
      // 当子级有选中的时候需要把父级的id也加入到ids中
      const result = el.children?.some((item: any) => item.checked)
      if (result) {
        ids.push(el.id)
      }
      getDeepIds(el.children, ids)
    }
    if (el.drillDownPermission) {
      //如果打开了下钻，则将子元素的id加入到ids中
      // 处理drillDownPermissionList集合
      if (el.drillDownPermissionList && el.drillDownPermissionList.length) {
        // 递归处理drillDownPermissionList中的元素
        el.drillDownPermissionList.forEach((item: any) => {
          // 如果当前元素drillDownPermission为true，将其ID添加到ids
          ids.push(item.id)
          // 递归处理嵌套的drillDownPermissionList
          if (item.drillDownPermissionList && item.drillDownPermissionList.length) {
            getDeepIds([item], ids) // 递归调用，传入当前元素作为数组
          }
        })
      }
    }
  })
  return ids
}

/**
 * @description: 校验必填项
 * @param {*} dataArray
 * @return {*}
 */
const validateData = (dataArray: any) => {
  if (!Array.isArray(dataArray) || dataArray?.length === 0) return false
  for (let i = 0; i < dataArray.length; i++) {
    const item = dataArray[i]
    if (!item.roleName) {
      return false
    }
    // 关联标签校验
    if (
      !item.businessTagIds?.length &&
      !item.serviceTagIds?.length &&
      !item.qualityTagIds?.length
    ) {
      return false
    }
    // 渠道
    if (!item.channelIds || (Array.isArray(item.channelIds) && item.channelIds.length === 0)) {
      return false
    }
    // 车系
    if (!item.seriesIds || (Array.isArray(item.seriesIds) && item.seriesIds.length === 0)) {
      return false
    }
    // 区域
    if (!item.areaIds || (Array.isArray(item.areaIds) && item.areaIds.length === 0)) {
      return false
    }
    // 权限配置
    if (
      !item.permissionIdList ||
      (Array.isArray(item.permissionIdList) && item.permissionIdList.length === 0)
    ) {
      return false
    }
  }
  return true
}

const formRef = ref()
const handleOk = debounce(async () => {
  const ids: any = []
  const _permIds = getDeepIds(treeData.value.appKanban, ids)

  const selectedBrandCode = brandList.value.filter(el => el.checked).map(el => el.value)

  const _roleModelList = roleModel.value.brandGroup
    .filter((el: any) => selectedBrandCode.includes(el.brandCode))
    .map((el: any) => ({
      clientId: userStore.clientId,
      roleName: roleModel.value.roleName,
      brandCode: el.brandCode,
      brandName: el.brandName,
      businessTagIds: el.businessTagIds,
      qualityTagIds: el.qualityTagIds,
      serviceTagIds: el.serviceTagIds,
      channelIds: el.channelIds,
      seriesIds: el.seriesIds,
      areaIds: el.areaIds,
      allPermission: treeData.value.allPermission,
      permissionIdList: _permIds,
      isExport: treeData.value.isExport,
      isDownload: treeData.value.isDownload,
      enabled: roleModel.value.enabled,
      remark: roleModel.value.remark,
      roleId: roleModel.value.roleId
    }))

  const flag = validateData(_roleModelList)
  if (!flag) {
    Message.error('信息提交有误，请修改后重新提交。')
    return
  }

  loadStart()
  const api = form.operation === 'add' ? saveOrUpdateRole : saveOrUpdateRole
  // console.log('params', params)

  const [errs] = await to(api(_roleModelList))
  if (errs) {
    Message.error(errs.message)
    loadDone()
    return
  }
  form.visible = false
  emit('refreshList')
  loadDone()
}, 300)

/**
 * @description: 关联标签交互逻辑
 * @return {*}
 */
function useLinkTag() {
  const prodIndeterminate = ref(false)
  const serviceIndeterminate = ref(false)
  const qyIndeterminate = ref(false)

  const prodChecked = ref(false)
  const serviceChecked = ref(false)
  const qyChecked = ref(false)

  const prodTagRef = ref()
  const serviceTagRef = ref()
  const qyTagRef = ref()

  const tagTypeChange = (type: Common.TagType, val: boolean) => {
    if (type === 'PROD') {
      prodTagRef.value?.handleChange(val ? ['all'] : [])
    } else if (type === 'SERVICE') {
      serviceTagRef.value?.handleChange(val ? ['all'] : [])
    } else if (type === 'QY') {
      qyTagRef.value?.handleChange(val ? ['all'] : [])
    }
  }

  return {
    prodIndeterminate,
    serviceIndeterminate,
    qyIndeterminate,
    prodChecked,
    prodTagRef,
    serviceChecked,
    serviceTagRef,
    qyChecked,
    qyTagRef,
    tagTypeChange
  }
}
</script>

<style lang="scss" scoped>
.self-radio {
  padding: 4px 16px;
  border-radius: 32px;
}

.active-self-radio {
  background-color: #f2f3f5;
  color: #165dff;
}

.per-content {
  margin-top: 10px;
}

.pwd-default {
  width: 688px;
  height: 32px;
  background: #f2f3f5;
  border-radius: 2px 2px 2px 2px;
  padding: 0 12px;
  display: flex;
  align-items: center;

  .pwdd-circle {
    width: 6px;
    height: 6px;
    background: #4e5969;
    border-radius: 50%;

    & + .pwdd-circle {
      margin-left: 12px;
    }
  }
}

.divider {
  background: rgba(#26292e, 0.15);
  width: 1px;
  height: 16px;
  margin: 0 16px;
}
.check-border-right {
  padding-right: 16px;
  margin-right: 16px;
  border-right: 1px solid rgba(#26292e, 0.15);
}
</style>
<style lang="scss">
.per-content {
  margin-top: 5px;
}
</style>
