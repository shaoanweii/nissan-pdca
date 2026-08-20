<template>
  <div class="fd-tabs">
    <div class="fdt-content">
      <div
        class="fdt-item"
        :class="{ active: item.value === curTab }"
        v-for="item of tabs"
        :key="item.value"
        @click="handleChange(item)"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="fdt-extra">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  tabs: { label: string; value: number }[]
  model?: 'change' | 'change2'
}
const { tabs = [], model = 'change' } = defineProps<Props>()
const curTab = defineModel<any>()
const emit = defineEmits(['change', 'change2'])

const handleChange = (item: any) => {
  if (model === 'change') {
    curTab.value = item.value
    emit('change', item)
  } else if (model === 'change2') {
    emit('change2', item)
  }
}
</script>

<style lang="scss" scoped>
.fd-tabs {
  height: 64px;
  padding: 9px 24px 0;
  border-radius: 8px 8px 0px 0px;
  background: #fbfbfd;

  font-size: 16px;
  color: #4b5468;
  line-height: 24px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #dde3ee;
  .fdt-content {
    flex: 1;
    display: flex;
    align-items: center;
    .fdt-item {
      margin-right: 32px;
      height: 100%;
      line-height: 56px;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
      &.active {
        font-weight: 700;
        color: #26292e;
        border-bottom: 2px solid #001e50;
      }
    }
  }
  .fdt-extra {
    flex: none;
  }
}
</style>
