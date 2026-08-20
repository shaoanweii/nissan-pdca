<template>
  <div class="f-switch-card">
    <div :class="{ 'card-item': true, active: active === 1 }" @click="handleChange(1)">
      <div class="num-box">
        <div class="num1">38</div>
        <div class="num2">+12</div>
      </div>
      <div class="info">
        <i class="icon ri-briefcase-2-line"></i>
        <span>服务问题</span>
      </div>
    </div>

    <div :class="{ 'card-item': true, active: active === 2 }" @click="handleChange(2)">
      <div class="num-box">
        <div class="num1">38</div>
        <div class="num2">+12</div>
      </div>
      <div class="info">
        <i class="icon ri-roadster-line"></i>
        <span>质量故障</span>
      </div>
    </div>

    <div :class="{ 'card-item': true, active: active === 3 }" @click="handleChange(3)">
      <div class="num-box">
        <div class="num1">38</div>
        <div class="num2">+12</div>
      </div>
      <div class="info">
        <i class="icon ri-user-voice-line"></i>
        <span>投诉用户</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const active = ref(1)
const handleChange = (val: number) => {
  active.value = val
}
</script>

<style lang="scss" scoped>
.f-switch-card {
  display: inline-flex;
  .card-item {
    width: 145px;
    height: 71px;
    background: #efefef;
    border-radius: 8px 8px 8px 8px;
    padding: 12px 0 0 16px;
    cursor: pointer;
    & + .card-item {
      margin-left: 24px;
    }

    &.active {
      background: #2c9bde;
      .num-box {
        .num1,
        .num2 {
          color: #fff;
        }
      }
      .info {
        color: #fff;
      }
    }
    .num-box {
      display: flex;
      .num1 {
        font-size: 20px;
        color: #272830;
        line-height: 23px;
      }
      .num2 {
        font-weight: 600;
        font-size: 8px;
        color: #ff5050;
        line-height: 12px;
        margin-left: 4px;
      }
    }
    .info {
      color: #4b5468;
      margin-top: 8px;
      .icon {
        font-size: 16px;
      }
      span {
        font-size: 12px;
        line-height: 12px;
        letter-spacing: 1px;
        margin-left: 4px;
      }
    }
  }
}
</style>
