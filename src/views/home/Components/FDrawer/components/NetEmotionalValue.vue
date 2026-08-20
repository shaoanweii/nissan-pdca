<template>
  <div class="net-emotional-value-wrapper">
    <div class="uduc-head">
      <div class="uduc-img">
        <i class="ri-user-heart-line"></i>
      </div>
      <div class="uduc-info">
        <div class="uduci-name">{{ emotionalValue }}</div>
        <div class="uduci-address">
          <span>净情感值</span>
          <i class="ri-information-line font16 ml-4"></i>
        </div>
      </div>
    </div>
    <div class="scale-bar">
      <ul class="text-content">
        <li>需要改善</li>
        <li>还行</li>
        <li>良好</li>
        <li>优秀</li>
      </ul>
      <div class="nev-line">
        <i class="ri-arrow-up-s-fill arrow" :style="{ left: arrowPosition }"></i>
      </div>
      <ul class="num-content">
        <li>-100</li>
        <li>0</li>
        <li>30</li>
        <li>70</li>
        <li>100</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  emotionalValue: number
}

const { emotionalValue = 0 } = defineProps<Props>()

const arrowPosition = computed(() => {
  console.log('emotionalValue', emotionalValue)

  // 箭头宽度16
  if (emotionalValue === -100) {
    return '-8px'
  }
  if (emotionalValue === 0) {
    return '117px'
  }
  if (emotionalValue === 100) {
    return '243px'
  }

  const basis = 117

  const scale = 251 / 200

  return `${basis + emotionalValue * scale}px`
})
</script>

<style lang="less" scoped>
.net-emotional-value-wrapper {
  width: 100%;
  height: 108px;
  .uduc-head {
    width: 100%;
    display: flex;
    align-items: center;
    .uduc-img {
      width: 44px;
      height: 44px;
      background: rgba(0, 167, 134, 0.1);
      border-radius: 50%;
      font-size: 24px;
      color: #00b489;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .uduc-info {
      margin-left: 16px;
      font-size: 14px;

      .uduci-name {
        font-size: 24px;
        color: #00b489;
        line-height: 28px;
      }

      .uduci-address {
        margin-top: 5px;
        font-size: 14px;
        color: #4b5468;
        line-height: 22px;

        span {
          margin-left: 2px;
        }
      }
    }
  }
  .scale-bar {
    width: 251px;
    // height: 38px;
    position: relative;
    margin-top: 16px;
    .text-content {
      height: 16px;
      font-size: 12px;
      color: #ffffff;
      line-height: 16px;
      display: flex;
      li {
        text-align: center;
      }

      & li:nth-child(1) {
        flex: none;
        width: 125px;
        background: #ff7b2f;
      }

      & li:nth-child(2) {
        flex: none;
        width: 38px;
        background: #2c9bde;
      }
      & li:nth-child(3) {
        flex: none;
        width: 50px;
        background: #29b9c2;
      }
      & li:nth-child(4) {
        flex: none;
        width: 38px;
        background: #27c29f;
      }
    }

    .nev-line {
      width: 100%;
      height: 1px;
      background: #dde3ee;
      margin-top: 6px;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        width: 1px;
        height: 3px;
        background: #dde3ee;
        left: 0;
        top: 0;
      }
      &::after {
        content: '';
        position: absolute;
        width: 1px;
        height: 3px;
        background: #dde3ee;
        right: 0;
        top: 0;
      }

      .arrow {
        font-size: 16px;
        position: absolute;
        top: -10px;
        // left: 50px;
        z-index: 10;
      }
    }
    .num-content {
      display: flex;
      width: 100%;
      font-weight: 600;
      font-size: 10px;
      color: #26292e;
      line-height: 10px;
      margin-top: 3px;
      position: relative;
      li {
        position: absolute;
        top: 0;
      }
      & li:nth-child(1) {
        left: -12px;
      }

      & li:nth-child(2) {
        left: 122px;
      }

      & li:nth-child(3) {
        left: 156px;
      }

      & li:nth-child(4) {
        left: 209px;
      }

      & li:nth-child(5) {
        left: 242px;
      }
    }
  }
}
</style>
