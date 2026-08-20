<template>
  <div class="data-time-line">
    <a-tag>2024</a-tag>
    <a-timeline class="ml-15">
      <a-timeline-item label="2017-03-10" dotType="hollow" dotColor="#98A2B2" lineType="dashed">
        <template #label>
          <div class="flex-justify-between">
            <div>1</div>
            <div>2</div>
          </div>
        </template>
      </a-timeline-item>
      <a-timeline-item label="2018-05-12" dotType="hollow" dotColor="#98A2B2" lineType="dashed">
        The second milestone
        <br />
        <a-typography-text type="secondary" :style="{ fontSize: '12px', marginTop: '4px' }">
          This is a descriptive message
        </a-typography-text>
      </a-timeline-item>
      <a-timeline-item label="2020-09-30" dotType="hollow" dotColor="#98A2B2" lineType="dashed">
        The third milestone
        <br />
        <a-typography-text type="secondary" :style="{ fontSize: '12px', marginTop: '4px' }">
          This is a descriptive message
        </a-typography-text>
      </a-timeline-item>
    </a-timeline>
    <a-tag>2023</a-tag>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.data-time-line {
  padding: 0 24px;

  &:deep(.arco-timeline-item-dot) {
    width: 8px;
    height: 8px;
  }
  &:deep(.arco-timeline-item-dot-wrapper .arco-timeline-item-dot-content) {
    width: 8px;
  }
}
</style>
