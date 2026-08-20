<template>
  <div class="f-switch-group">
    <div
      :class="{
        item: true,
        active: active === item.value
      }"
      v-for="(item, index) of group"
      :key="index"
      @click="handleActive(item)"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  group: { label: string; value: string }[]
}

const { group } = defineProps<Props>()
const emits = defineEmits(['change'])

const active = ref(group[0].value)

const handleActive = (item: any) => {
  active.value = item.value
  emits('change', item)
}
</script>

<style lang="scss" scoped>
.f-switch-group {
  display: inline-flex;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #dde3ee;
  .item {
    padding: 4px 8px;
    background: #ffffff;
    font-size: 14px;
    color: #2d2d2d;
    line-height: 16px;
    cursor: pointer;
    border: 1px solid transparent;
    &.active {
      background: #2c9bde;
      color: #fbfbfb;
      border: 1px solid #2c9bde;
    }
  }
}
</style>
