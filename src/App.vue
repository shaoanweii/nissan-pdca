<template>
  <!-- <ElConfigProvider :locale="zhCn">
  </ElConfigProvider> -->
  <a-config-provider :locale="zhCN">
    <router-view />
  </a-config-provider>
</template>

<script lang="ts" setup>
// import { zhCn } from 'element-plus/es/locale/index.mjs';
// import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn'
import { selfAdaption } from './utils/pageAdaptation'

onMounted(() => {
  // selfAdaption()
})
</script>

<style lang="scss">
#app {
  height: 100%;
  font-family: 'PingFangSC-Regular', 'Microsoft YaHei', sans-serif, Avenir, Helvetica, Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  font-size: 14px;
  color: $--color-4e5969;
}
/* 用于页面缩放适配 */
#app {
  /* transform: scale(1, 1); */
  /* IE 9 */
  /* -ms-transform: scale(1, 1);  */
  /* Safari and Chrome */
  /* -webkit-transform: scale(1, 1);  */
  /*设置左上角为缩放原点*/
  /* transform-origin: left top; 
  transform: scaleX(1);
  -ms-transform: scaleX(1);
  -webkit-transform: scaleX(1); */
}
</style>
