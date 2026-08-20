<template>
  <a-drawer
    :width="value2rem(1200)"
    :visible="form.visible"
    @open="handleOpen"
    @cancel="handleCancel"
    unmountOnClose
    class="f-drawer"
    :data-testid="`account-form-drawer`"
  >
    <template #title>
      <span class="fd-title">{{ titleStr }}</span>
    </template>
    <div class="pt-11">
      <div class="font-333 font-14 fw-600 lh-22">账号信息：</div>
      <div class="bgc-def radius-4 px-18 py-37 mt-15 flex">
        <SvgIcon name="avatar-male-1" width="44px" height="44px"></SvgIcon>
        <div class="ml-18 color-666 font-14">
          <div class="flex-align-center">
            <div class="font-16 fw-600 color-333">{{ formData.userName || '-' }}</div>
            <div class="line-3 mx-8"></div>
            <!-- 部门 -->
            <div>{{ formData.deptName || '-' }}</div>
            <div class="line-3 mx-8"></div>
            <!-- 职务 -->
            <div>{{ formData.position || '-' }}</div>
            <div class="line-3 mx-8"></div>
            <!-- 员工编号 -->
            <div>{{ formData.employeeId || '-' }}</div>
          </div>
          <div class="mt-5 flex-align-center">
            <!-- 电话 -->
            <i class="ri-phone-fill font-16"></i>
            <div class="ml-4 mr-16">{{ formData.officePhone || '-' }}</div>
            <!-- 手机 -->
            <i class="ri-smartphone-fill font-16"></i>
            <div class="ml-4 mr-16">{{ formData.phone || '-' }}</div>
            <!-- 邮箱 -->
            <i class="ri-mail-fill font-16"></i>
            <div class="ml-4">{{ formData.email || '-' }}</div>
          </div>
        </div>
      </div>

      <div class="flex-align-center color-666 lh-22 font-14 mt-24">
        <div class="w-81 text-align-right">*&nbsp;员工账号：</div>
        <div class="ml-16">{{ formData.accountName || '-' }}</div>
      </div>
      <div class="flex-align-center color-666 lh-22 font-14 mt-19">
        <!-- <div class="w-81 text-align-right">*&nbsp;角色类型：</div> -->
        <div class="w-81 text-align-right">角色类型：</div>
        <a-select
          v-model="formData.roleId"
          placeholder="请选择角色"
          allow-clear
          style="width: 280px"
          class="border-def bg-white radius-4 ml-16"
        >
          <a-option v-for="(item, index) of roleOptions" :key="index" :value="item.id">{{
            item.roleName
          }}</a-option>
        </a-select>
      </div>
    </div>

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
import { findAccountInfo, updateAccountInfo } from '@/service/account'
import { debounce } from '@arco-design/web-vue/es/_utils/debounce'
import { inject } from 'vue'
// import type { ConditionsDetailItem } from '@/types'
import useUserStore from '@/stores/modules/user'
import { resetObjectValues } from '@/utils'
import { cloneDeep } from 'lodash-es'
import to from 'await-to-js'
import { usePageLoading } from '@/hooks/usePageLoading'
import { value2rem } from '@/utils/rem'

// const conditions = inject('conditions') as Record<string, ConditionsDetailItem[]>
const roleOptions = inject('roleOptions') as any[]
const emit = defineEmits(['refreshList'])
const form = inject('form') as Form
let formData = reactive<Record<any, any>>({})
let titleStr = ref('')
let userStore = useUserStore()

const handleOpen = async () => {
  initializeFormData()
}

const initializeFormData = async () => {
  console.log('form.data', form)

  Object.assign(formData, cloneDeep(form.data))
  formData.clientId = userStore.clientId

  formData.status = formData.status ? formData.status : '1'
  // formData.expiryDate = formData.expiryDate ? formData.expiryDate : null
  // formData.expiryDateBoolean = formData.expiryDate ? 1 : 0
  if (form.operation == 'add') {
    // titleStr.value = '新增账号'
  } else if (form.operation == 'edit') {
    titleStr.value = '编辑账号'

    const [errs, data] = await to(
      findAccountInfo({ userId: formData.userId, clientId: userStore.clientId })
    )
    if (errs) {
      Message.error(errs.message)
      return
    }
    Object.assign(formData, cloneDeep(data?.result))
  }
  console.log('formData---', formData)
}

// const handleClose = () => {
//   resetObjectValues(formData)
// }

const handleCancel = () => {
  form.visible = false
  resetObjectValues(formData)
}

const handleOk = debounce(async () => {
  // form.visible = false;
  console.log('formData', formData)
  // if (!formData.roleId) {
  //   Message.error('请选择角色类型')
  //   return
  // }
  const params = {
    ...formData
  }
  const { loadStart, loadDone } = usePageLoading()
  loadStart()
  // const api = form.operation === 'add' ? saveAccountInfo : updateAccountInfo
  // console.log('params', params)

  const [errs] = await to(updateAccountInfo(params))
  if (errs) {
    Message.error(errs.message)
    loadDone()
    return
  }
  form.visible = false
  emit('refreshList')
  loadDone()
}, 300)
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
</style>
<style lang="scss">
.per-content {
  margin-top: 5px;
}
</style>
