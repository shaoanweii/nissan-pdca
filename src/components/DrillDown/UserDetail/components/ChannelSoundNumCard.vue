<template>
  <div class="channel-sound-num">
    <div class="head">
      <div class="h-item">
        <i class="ri-file-text-line"></i>
        <span>单据数</span>
        <span class="num">{{ data?.billC }}</span>
      </div>
      <div class="h-item">
        <i class="ri-stack-line"></i>
        <span>渠道数</span>
        <span class="num">{{ data?.channelC }}</span>
      </div>
    </div>
    <div class="content">
      <div class="c-left">
        <div class="c-item plain">
          <div class="ci-num">{{ data?.opinionC }}</div>
          <div class="ci-text">观点数</div>
        </div>
      </div>
      <div class="c-right">
        <a-grid :cols="3" :col-gap="8" :row-gap="8">
          <!-- 表扬  咨询  建议  抱怨  投诉   陈诉  -->
          <a-grid-item>
            <div
              class="c-item point"
              :class="{ tap: activeIntention === '表扬' }"
              @click="intentionChange('表扬')"
            >
              <div class="ci-num">{{ data?.praiseC || 0 }}</div>
              <div class="ci-text">表扬</div>
            </div>
          </a-grid-item>
          <a-grid-item>
            <div
              class="c-item point"
              :class="{ tap: activeIntention === '咨询' }"
              @click="intentionChange('咨询')"
            >
              <div class="ci-num">{{ data?.consultC || 0 }}</div>
              <div class="ci-text">咨询</div>
            </div>
          </a-grid-item>
          <a-grid-item>
            <div
              class="c-item point"
              :class="{ tap: activeIntention === '建议' }"
              @click="intentionChange('建议')"
            >
              <div class="ci-num">{{ data?.suggestionC || 0 }}</div>
              <div class="ci-text">建议</div>
            </div>
          </a-grid-item>
          <a-grid-item>
            <div
              class="c-item point"
              :class="{ tap: activeIntention === '抱怨' }"
              @click="intentionChange('抱怨')"
            >
              <div class="ci-num">{{ data?.complainC || 0 }}</div>
              <div class="ci-text">抱怨</div>
            </div>
          </a-grid-item>
          <a-grid-item>
            <div
              class="c-item point"
              :class="{ tap: activeIntention === '投诉' }"
              @click="intentionChange('投诉')"
            >
              <div class="ci-num">{{ data?.complaintC || 0 }}</div>
              <div class="ci-text">投诉</div>
            </div>
          </a-grid-item>
          <a-grid-item>
            <div
              class="c-item point"
              :class="{ tap: activeIntention === '陈述' }"
              @click="intentionChange('陈述')"
            >
              <div class="ci-num">{{ data?.statementC || 0 }}</div>
              <div class="ci-text">陈述</div>
            </div>
          </a-grid-item>
        </a-grid>
      </div>
      <!-- <div class="c-item">
        <div class="ci-num">{{ data?.opinionC }}</div>
        <div class="ci-text">观点数</div>
      </div>

      <div class="c-item">
        <div class="ci-num">{{ data?.consultC }}</div>
        <div class="ci-text">咨询</div>
      </div>

      <div class="c-item">
        <div class="ci-num">{{ data?.complaintC }}</div>
        <div class="ci-text">投诉</div>
      </div>

      <div class="c-item">
        <div class="ci-num">{{ data?.complainC }}</div>
        <div class="ci-text">抱怨</div>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  data: Record<any, any> | undefined
}

const { data } = defineProps<Props>()
const emits = defineEmits(['intentionChange'])
const activeIntention = ref()

const intentionChange = (type: string) => {
  if (type === activeIntention.value) {
    activeIntention.value = undefined
  } else {
    activeIntention.value = type
  }
  emits('intentionChange', activeIntention.value)
}
</script>

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
    /* height: 88px; */
    background: #f0f3fa;
    border-radius: 0px 0px 4px 4px;
    border: 1px solid #dde3ee;
    padding: 16px 14px;
    display: flex;
    .c-left {
      width: 62px;
      flex: none;
      display: flex;
      align-items: center;
    }
    .c-right {
      flex: 1;
    }
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
      &.tap {
        background: #2c9bde;
        color: #fbfbfb;
        border: 1px solid #2c9bde;
      }

      &.plain {
        background: transparent;
        border: none;
        border-radius: 0;
        .ci-text {
          margin-top: 8px;
        }
      }

      /* &:first-child {
        background: transparent;
        border: none;
        border-radius: 0;
        .ci-text {
          margin-top: 8px;
        }
      } */
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
