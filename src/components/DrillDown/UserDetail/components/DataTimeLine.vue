<template>
  <div class="data-time-line">
    <div
      v-if="data?.length"
      class="border-dde3ee radius-4 px-8 font-14 lh-20 color-4b5468 flex-inline"
    >
      {{ firsted?.yearTime }}
    </div>
    <a-timeline v-if="data?.length" class="ml-15">
      <a-timeline-item
        v-for="(item, index) of data"
        :key="index"
        dotType="hollow"
        dotColor="#98A2B2"
        lineType="dashed"
      >
        <template #label>
          <div class="font-16 lh-24 fw-600 color-666">{{ item?.bizCreateTime }}</div>
          <div class="flex-justify-between font-16 lh-24 color-666 mt-24">
            <div>{{ item?.channelName }}</div>
            <div>{{ item?.channelBiz }}</div>
          </div>
          <div class="bg-fbfbfd-07 radius-4 py-16 px-24 mt-16">
            <div>
              {{ item?.originalTextScene }}
            </div>
            <div class="mt-16">
              <!-- 根据逗号分隔 -->
              <template v-for="(subItem, index) of item?.opinion?.split(',')" :key="index">
                <div
                  class="border-dde3ee radius-4 px-11 py-5 font-12 lh-16 color-001e50 flex-inline ml-item-16"
                >
                  {{ subItem }}
                </div>
              </template>
            </div>
          </div>
        </template>
      </a-timeline-item>
      <a-timeline-item dotType="hollow" dotColor="#98A2B2" lineType="dashed">
        <template #label>
          <div
            style="position: absolute; left: -33px"
            class="border-dde3ee radius-4 px-8 font-14 lh-20 color-4b5468 flex-inline"
          >
            {{ lasted?.yearTime }}
          </div>
        </template>
      </a-timeline-item>
      <!-- <a-timeline-item label="2018-05-12" dotType="hollow" dotColor="#98A2B2" lineType="dashed">
        <template #label>
          <div class="font-16 lh-24 fw-600 color-666">04月13日</div>
          <div class="flex-justify-between font-16 lh-24 color-666 mt-24">
            <div>APP社区</div>
            <div>DNDC_12983723</div>
          </div>
          <div class="bg-fbfbfd-07 radius-4 py-16 px-24 mt-16">
            <div>
              22款天籁
              提车半个月了跑了一千公里，我的是混动，一般用电跑，偶尔开GTE模式，油耗确实很低。
              自己装了胎压。为了更好的安全。 脚垫也做了软包，后排底部出风口也做了完美结合。
              后备箱灯换了更亮的LED. 目前用车满意，动力够用。
            </div>
            <div class="mt-16">
              <div
                class="border-dde3ee radius-4 px-11 py-5 font-12 lh-16 color-001e50 flex-inline ml-item-16"
              >
                安全性好
              </div>

              <div
                class="border-dde3ee radius-4 px-11 py-5 font-12 lh-16 color-001e50 flex-inline ml-item-16"
              >
                油耗低
              </div>
            </div>
          </div>
        </template>
      </a-timeline-item>
      <a-timeline-item label="2020-09-30" dotType="hollow" dotColor="#98A2B2" lineType="dashed">
        <template #label>
          <div class="font-16 lh-24 fw-600 color-666">04月13日</div>
          <div class="flex-justify-between font-16 lh-24 color-666 mt-24">
            <div>APP社区</div>
            <div>DNDC_12983723</div>
          </div>
          <div class="bg-fbfbfd-07 radius-4 py-16 px-24 mt-16">
            <div>
              22款天籁
              提车半个月了跑了一千公里，我的是混动，一般用电跑，偶尔开GTE模式，油耗确实很低。
              自己装了胎压。为了更好的安全。 脚垫也做了软包，后排底部出风口也做了完美结合。
              后备箱灯换了更亮的LED. 目前用车满意，动力够用。
            </div>
            <div class="mt-16">
              <div
                class="border-dde3ee radius-4 px-11 py-5 font-12 lh-16 color-001e50 flex-inline ml-item-16"
              >
                安全性好
              </div>

              <div
                class="border-dde3ee radius-4 px-11 py-5 font-12 lh-16 color-001e50 flex-inline ml-item-16"
              >
                油耗低
              </div>
            </div>
          </div>
        </template>
      </a-timeline-item>
      <a-timeline-item dotType="hollow" dotColor="#98A2B2" lineType="dashed">
        <template #label>
          <div
            style="position: absolute; left: -33px"
            class="border-dde3ee radius-4 px-8 font-14 lh-20 color-4b5468 flex-inline"
          >
            2023
          </div>
        </template>
      </a-timeline-item> -->
    </a-timeline>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  data: Record<string, any>[] | undefined
  trailChannel: Record<string, any>[] | undefined
}
const { data = [] } = defineProps<Props>()

const lasted = computed(() => {
  // yearTime
  return data?.[data.length - 1]
})

const firsted = computed(() => {
  return data?.[0]
})
</script>

<style lang="scss" scoped>
.data-time-line {
  /* padding: 0 24px; */

  &:deep(.arco-timeline-item-dot) {
    width: 8px;
    height: 8px;
  }
  &:deep(.arco-timeline-item-dot-wrapper .arco-timeline-item-dot-content) {
    width: 8px;
  }
  &:deep(.arco-timeline-item-label) {
    position: relative;
    margin-bottom: 24px;
  }
}
</style>
