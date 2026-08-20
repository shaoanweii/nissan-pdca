<template>
  <div class="channel-sound-num">
    <div class="head">
      <div class="h-item">
        <i class="ri-file-text-line"></i>
        <span>发生数</span>
        <span class="num">40</span>
      </div>
      <div class="h-item">
        <i class="ri-stack-line"></i>
        <span>渠道数</span>
        <span class="num">5</span>
      </div>
    </div>
    <div class="content">
      <div class="c-item">
        <div class="ci-num">64</div>
        <div class="ci-text">提及量</div>
      </div>

      <div class="c-item">
        <div class="ci-num">30</div>
        <div class="ci-text">咨询</div>
      </div>

      <div class="c-item">
        <div class="ci-num">18</div>
        <div class="ci-text">投诉</div>
      </div>

      <div class="c-item">
        <div class="ci-num">16</div>
        <div class="ci-text">抱怨</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.channel-sound-num {
  width: 100%;
  .head {
    height: 44px;
    background: #ffffff;
    border-radius: 4px 4px 0px 0px;
    border: 1px solid #dde3ee;
    display: flex;
    align-items: center;
    .h-item {
      font-size: 14px;
      color: #4b5468;
      line-height: 16px;
      flex: 1;
      text-align: center;
      &:first-child {
        border-right: 1px solid #dde3ee;
      }
      i {
        font-size: 16px;
        margin-right: 4px;
      }
      .num {
        font-size: 16px;
        color: #4b5468;
        line-height: 20px;
        margin-left: 8px;
      }
    }
  }
  .content {
    width: 100%;
    height: 88px;
    background: #f0f3fa;
    border-radius: 0px 0px 4px 4px;
    border: 1px solid #dde3ee;
    padding: 16px 16px 16px 24px;
    display: flex;
    .c-item {
      color: #4b5468;

      width: 64px;
      height: 56px;
      background: #ffffff;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #dde3ee;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      & + .c-item {
        margin-left: 8px;
      }

      &:first-child {
        background: transparent;
        border: none;
        border-radius: 0;
        .ci-text {
          margin-top: 8px;
        }
      }
      .ci-num {
        font-size: 16px;
        line-height: 20px;
      }
      .ci-text {
        margin-top: 4px;
        font-size: 14px;
        line-height: 16px;
      }
    }
  }
}
</style>
