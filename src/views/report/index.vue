<template>
  <div class="page-container">
    <div class="content-header" style="border-bottom: none">
      <div class="title">报告管理中心</div>
      <div class="color-999 font-14 lh-16 mt-15">
        提供多维度可选的数据报告，助力业务更快捷分析用户声音。
      </div>
    </div>

    <div class="container mt-16" style="height: auto">
      <div class="query-card">
        <a-tabs default-active-key="1" size="large" destroy-on-hide>
          <a-tab-pane key="1" title="VOC统计">
            <VocStat></VocStat>
          </a-tab-pane>
          <!-- <a-tab-pane key="2" title="风险预警">
            <RiskWarningPane></RiskWarningPane>
          </a-tab-pane> -->
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VocStat from './components/VocStatPane.vue'
// import RiskWarningPane from './components/RiskWarningPane.vue'
</script>

<style lang="scss" scoped></style>
