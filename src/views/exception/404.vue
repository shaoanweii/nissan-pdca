<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const goLogin = () => {
  // logout()
  // router.back()
  router.push('/')
}
</script>

<template>
  <div class="full-content">
    <a-card class="f-card" :bordered="false">
      <a-result status="404" subtitle="抱歉，页面不见了～">
        <template #extra>
          <a-space>
            <!--<a-button>重试</a-button>-->
            <a-button type="primary" @click="goLogin">返回</a-button>
          </a-space>
        </template>
      </a-result>
    </a-card>
  </div>
</template>

<style scoped lang="scss">
.f-card {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  box-sizing: border-box;
  &::v-deep(.arco-card-body) {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    box-sizing: border-box;
  }
}
</style>
