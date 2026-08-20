<template>
  <a-drawer
    class="f-drawer user-detail"
    :width="1150"
    :visible="visible"
    :footer="false"
    @ok="handleOk"
    @cancel="handleCancel"
    unmountOnClose
  >
    <template #title>
      <span class="fd-title">用户详情</span>
    </template>
    <div class="ud-content">
      <div class="ud-left">
        <div class="ud-user f-card">
          <div class="udu-head">
            <div class="udu-img"></div>
            <div class="udu-info">
              <div class="udui-name">张三</div>
              <div class="udui-address">
                <i class="ri-map-pin-line"></i>
                <span>江苏/苏州</span>
              </div>
            </div>
          </div>

          <div class="udu-content">
            <div class="udlc-info">
              <div class="udlci-label">购车日期：</div>
              <div class="udlci-value">2023/04/11</div>
            </div>

            <div class="udlc-info">
              <div class="udlci-label">品牌车系：</div>
              <div class="udlci-value">天籁</div>
            </div>

            <div class="udlc-info">
              <div class="udlci-label">车牌号码：</div>
              <div class="udlci-value">苏A9**89</div>
            </div>

            <div class="uduc-line"></div>

            <NetEmotionalValue :emotionalValue="88.26" class="mt-16"></NetEmotionalValue>
            <ChannelSoundNumCard class="mt-16"></ChannelSoundNumCard>
          </div>
        </div>

        <div class="f-card mt-16" style="height: 321px; padding: 16px 0">
          <FEcharts :options="echartOptions3" width="100%" height="100%"></FEcharts>
        </div>
      </div>
      <div class="ud-right">
        <div class="udr-title">数据轨迹</div>

        <ChannelSwitchGroup
          defaultValue="1"
          :listData="[
            {
              label: '全选',
              static: 60,
              value: '1'
            },
            {
              label: '400工单',
              static: 4,
              value: '2'
            }
          ]"
        ></ChannelSwitchGroup>

        <DataTimeLine></DataTimeLine>
      </div>
    </div>
  </a-drawer>
</template>

<script lang="ts" setup>
import NetEmotionalValue from './components/NetEmotionalValue.vue'
import ChannelSoundNumCard from './components/ChannelSoundNumCard.vue'
import ChannelSwitchGroup from './components/ChannelSwitchGroup.vue'
import DataTimeLine from './components/DataTimeLine.vue'

const visible = defineModel({ default: false })

const handleOk = () => {}

const handleCancel = () => {
  visible.value = false
}

const echartOptions3 = ref({
  title: {
    text: '发生分布'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    show: false,
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      // radius: '50%',
      // radius: ['50%', '70%'],
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})
</script>

<style lang="scss">
.user-detail {
  .ud-content {
    display: flex;
    height: 100%;
    .ud-left {
      width: 351px;
      flex: none;

      .ud-user {
        overflow: hidden;
        .udu-head {
          width: 100%;
          height: 90px;
          background: #f0f3fa;
          border-bottom: 1px solid #dde3ee;
          display: flex;
          align-items: center;
          padding: 24px;
          .udu-img {
            width: 44px;
            height: 44px;
            background-color: red;
          }

          .udu-info {
            margin-left: 16px;
            font-size: 14px;

            .udui-name {
              color: #4b5468;
              line-height: 14px;
              text-align: left;
              font-style: normal;
              text-transform: none;
            }

            .udui-address {
              margin-top: 12px;
              color: rgba(0, 0, 0, 0.65);
              line-height: 20px;

              span {
                margin-left: 2px;
              }
            }
          }
        }
        .udu-content {
          padding: 24px;

          .udlc-info {
            display: flex;
            font-size: 14px;
            line-height: 20px;
            & + .udlc-info {
              margin-top: 12px;
            }
            .udlci-label {
              color: #98a2b2;
            }
            .udlci-value {
              color: #4b5468;
            }
          }

          .uduc-line {
            width: 100%;
            border-bottom: 2px dashed #dde3ee;
            margin: 16px 0;
            padding: 0 24px;
          }
        }
      }
    }
    .ud-right {
      margin-left: 24px;
      flex: 1;
      width: 100%;
      height: 100%;
      background: #ffffff;
      box-shadow: 0px 2px 6px 0px rgba(41, 35, 35, 0.05);
      border-radius: 8px;
      border: 1px solid #dde3ee;

      .udr-title {
        padding: 24px 24px 16px;

        font-size: 16px;
        color: #4b5468;
        line-height: 24px;
        border-bottom: 1px solid rgba(#26292e, 0.15);
      }
    }
  }
}
</style>
