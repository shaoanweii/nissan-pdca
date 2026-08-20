<template>
  <div class="f-btn-check-group" :class="{ disabled: disabled }">
    <div
      :class="{ 'btn-item': true, checked: checked, active: active, disabled: disabled }"
      @click.stop="handleItemChange('checked')"
    >
      <!-- @click.stop="handleItemChange('checked')" -->
      <a-checkbox :model-value="checked" :indeterminate="indeterminate" />
      <span class="bi-laebl ml-8">{{ label }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { label = '默认', disabled = false } = defineProps<{
  label: string
  disabled?: boolean
}>()

const emits = defineEmits(['change'])
const indeterminate = defineModel<boolean>('indeterminate', { default: false })
const checked = defineModel<boolean>('checked', { default: false })
// const checked = ref(false)
const active = ref(false)

const handleItemChange = (type: string) => {
  if (type === 'checked') {
    checked.value = !checked.value
  } else if (type === 'active') {
    active.value = !active.value
  }
  emits('change', !checked.value)
}
</script>

<style lang="scss" scoped>
.f-btn-check-group {
  flex: none;
  display: flex;
  &.disabled {
    cursor: not-allowed;
  }
  .btn-item {
    padding: 5px 15px;
    border-radius: 4px;
    border: 1px solid #dde3ee;
    display: flex;
    align-items: center;
    /* justify-content: center; */
    font-size: 14px;
    color: #4b5468;
    line-height: 20px;
    & + .btn-item {
      margin-left: 16px;
    }
    &.checked {
      border: 1px solid #0082d6;
      .bi-laebl {
        color: #0082d6;
      }
    }
    &.active {
      background: #0082d6;
      .bi-laebl {
        color: #fff;
      }
    }
    &.disabled {
      pointer-events: none;
      opacity: 0.7;
    }
    &::v-deep(.arco-checkbox-checked .arco-checkbox-icon) {
      background-color: #0082d6;
    }
    &::v-deep(.arco-checkbox-indeterminate .arco-checkbox-icon) {
      background-color: #0082d6;
    }
    .bi-laebl {
      color: #4b5468;
      cursor: pointer;
    }
  }
}
</style>
