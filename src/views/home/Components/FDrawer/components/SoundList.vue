<template>
  <div class="sound-list">
    <div class="ul-content">
      <a-button>
        <span>时间降序</span>
        <i class="ri-sort-desc ml-8"></i>
      </a-button>

      <div class="list-content">
        <div class="left">
          <div v-for="item of 20" :key="item" :class="['ll-item', item === 1 ? 'active' : '']">
            <div class="lli-num">{{ item }}</div>
            <div class="lli-content">
              用户会影响发动机并且涉水可能会异响，用户对此产生疑问，想要核实自动启停功能在涉水比较深的路段会不会导致发动机异响或者启停失效
            </div>
          </div>
        </div>
        <div class="right">
          <div class="r-title">声音内容</div>
          <div class="r-head">
            <div class="rh-l">
              <div class="rhl-img"></div>
              <div class="rhl-info">
                <div class="rhli-name">@#$XA(天籁)</div>
                <div class="rhli-other">
                  北京
                  <span>&nbsp;|&nbsp;</span>
                  2024-04-11 10:59:13
                </div>
              </div>
            </div>
            <div class="rh-r">
              <a-button shape="round">400工单</a-button>
            </div>
          </div>
          <div class="r-tag">发动机/发动机/自动熄火</div>

          <div class="r-sound-content">
            <div>
              途昂车主曾先生来电表示维修站工作人员告诉用户会影响发动机并且涉水可能会异响，用户对此产生疑问，想要核实自动启停功能在涉水比较深的路段会不会导致发动机异响或者启停失效，经常启停是否会影响引擎的寿命，会不会导致发动机寿命缩短，另外用户反映车载雷达灵敏度不够，有时候靠墙很近也没有反应，询问是否有故障，用户表示两天前已经反映过这个问题，一直没有得到回复，要求尽快核实处理，希望得到厂家回复。
              回电号码：***********
            </div>

            <div class="rsc-tag mt-16">发动机#</div>
          </div>
        </div>
      </div>
    </div>

    <div class="line"></div>
    <div class="footer">
      <a-pagination :total="50" show-total show-jumper show-page-size />
      <!-- <a-button class="mr-24">上一页</a-button>
      <a-button class="mr-24">下一页</a-button>
      <div class="total">共56页</div> -->
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.sound-list {
  padding: 24px;
  height: calc(100% - 64px);
  .ul-content {
    height: calc(100% - 79px);
    .list-content {
      margin-top: 24px;
      display: flex;
      height: calc(100% - 56px);
      .left {
        flex: none;
        width: 458px;
        border-right: 1px solid rgba(#26292e, 0.15);
        overflow-y: auto;
        .ll-item {
          display: flex;
          padding: 16px 33px 16px 24px;
          border-bottom: 1px solid #f6f6f6;
          color: #4b5468;
          line-height: 20px;
          cursor: pointer;
          &.active {
            background: rgba(17, 104, 202, 0.1);
            color: #001e50;
            border-bottom: 1px solid rgba(17, 104, 202, 0.1);
          }
          .lli-num {
            width: 31px;
            flex: none;
            font-weight: 600;
            font-size: 14px;
          }
          .lli-content {
            font-size: 14px;
          }
        }
      }
      .right {
        flex: 1;
        margin-left: 24px;
        .r-title {
          font-size: 16px;
          color: #4b5468;
          line-height: 24px;
        }
        .r-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 24px;
          .rh-l {
            flex: 1;
            display: flex;
            .rhl-img {
              flex: none;
              width: 44px;
              height: 44px;
              background: red;
            }
            .rhl-info {
              font-size: 14px;
              line-height: 20px;
              margin-left: 12px;
              .rhli-name {
                color: #26292e;
              }
              .rhli-other {
                color: #757575;
              }
            }
          }
          .rh-r {
            flex: none;
          }
        }
        .r-tag {
          margin: 16px 0;
          font-size: 14px;
          color: #26292e;
          line-height: 22px;
        }

        .r-sound-content {
          width: 100%;
          height: calc(100% - 146px);
          background: #f0f3fa;
          border-radius: 8px;
          border: 1px solid #dde3ee;
          padding: 16px 24px;

          font-size: 14px;
          color: #6e7b91;
          line-height: 22px;
          overflow-y: auto;

          .rsc-tag {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 4px;
            border: 1px solid #667896;

            font-size: 12px;
            color: #001e50;
            line-height: 16px;
          }
        }
      }
    }
  }
  .line {
    height: 1px;
    background: rgba(#26292e, 0.15);
    margin: 24px -24px 23px;
  }
  .footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
