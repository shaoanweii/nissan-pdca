<template>
  <div class="main-wrapper">
    <a-spin :loading="appStore.pageLoading" class="global-loading" style="width: 100%" :size="32">
      <template #element>
        <WaterRippleLoading></WaterRippleLoading>
      </template>
      <a-layout>
        <a-layout-header>
          <Header />
        </a-layout-header>
        <a-layout>
          <a-layout-sider :collapsed="collapsed" :width="176">
            <Menu @onCollapse="(val: any) => onCollapse(val)" />
          </a-layout-sider>
          <a-layout-content>
            <router-view></router-view>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-spin>
  </div>
</template>
<script lang="ts" setup>
import Header from '@/layouts/Header.vue'
import Menu from '@/layouts/Menu.vue'
import { useAppStoreWithOut } from '@/stores/modules/app'

const appStore = useAppStoreWithOut()

const collapsed = ref(false)
const onCollapse = (val: boolean) => {
  collapsed.value = val
}
</script>
<style lang="scss" scoped>
.main-wrapper {
  height: 100vh;
  overflow: hidden;
}
.arco-layout-header {
  background: #fff;
  border-bottom: $--border;
  height: 80px;
}
.arco-layout-sider {
  height: calc(100vh - 80px);
  background: #fff;
}
.arco-layout-content {
  height: calc(100vh - 80px);
  //padding: 24px 24px 48px;
  /* padding: 40px; */
  box-sizing: border-box;
  overflow-y: auto;
  /* background: linear-gradient(0deg, rgba(215, 238, 255, 0.3), #f0f3fa); */
  background: #f0f3fa;
}
</style>
