<template>
  <a-spin :loading="loading" :size="30" style="width: 100%">
    <template #element>
      <WaterRippleLoading></WaterRippleLoading>
    </template>
    <div class="redirect-wrapper">
      <FEmpty v-if="isShowTip" :tipStr="tipStr">
        <div class="font-20 mt-20">{{ tipStr }}</div>
      </FEmpty>
    </div>
  </a-spin>
</template>

<script lang="ts" setup>
import { TOKEN_KEY } from '@/constant'
import { checkToken } from '@/service/common'
import useUserStore from '@/stores/modules/user'
import { Message } from '@arco-design/web-vue'
import to from 'await-to-js'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const { token } = route.query
const userStore = useUserStore()
const loading = ref(false)
const tipStr = ref('请返回员工工作台重新登录')
const isShowTip = ref(false)

const init = async () => {
  loading.value = true
  if (token) {
    localStorage.setItem(TOKEN_KEY, token as string)
    const [errs, data] = await to(checkToken({ tokenKey: token as string }))

    if (errs) {
      Message.error(errs.message)
      loading.value = false
      isShowTip.value = true
      tipStr.value = errs.message
      return
    }
    if ((data as any)?.result) {
      try {
        await userStore.getUserPermissions()
        setTimeout(() => {
          router.push(userStore.homePath)
          loading.value = false
        }, 500)
      } catch (error: any) {
        Message.error(error.message)
        isShowTip.value = true
        loading.value = false
        if (error.message === '角色ID不允许为空') {
          tipStr.value = '尊敬的客户，您的账户未开通权限，请联系管理员进行配置。'
        } else {
          tipStr.value = error.message
        }
      }
    } else {
      isShowTip.value = true
      Message.error('token无效')
      loading.value = false
    }
  } else {
    isShowTip.value = true
  }
  setTimeout(() => {
    loading.value = false
  }, 1000)
}
init()

// const goHome = () => {
//   window.location.href = 'https://www.baidu.com'
// }
</script>

<style lang="scss" scoped>
.redirect-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
