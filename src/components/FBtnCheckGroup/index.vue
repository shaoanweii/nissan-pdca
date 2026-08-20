<template>
  <div class="f-btn-check-group">
    <div
      v-for="(item, index) of group"
      :key="index"
      :class="{ 'btn-item': true, checked: item.checked, active: item.active }"
      @click.stop="handleItemChange('active', item, index)"
    >
      <a-checkbox v-model="item.checked" @click.stop="handleItemChange('checker', item, index)" />
      <span class="bi-laebl ml-8">{{ item.label }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{}>(), {})

const {} = toRefs(props)

const group = defineModel<any[]>({ default: [] })
const activeIndex = defineModel<number>('index', { default: 0 })
const emits = defineEmits(['change'])

const handleItemChange = (type: string, item: any, index: number) => {
  if (type === 'checked') {
    item.checked = !item.checked
  } else if (type === 'active') {
    group.value.forEach(item => {
      item.active = false
    })
    item.active = true
    activeIndex.value = index
    emits('change', item)
  }
}
</script>

<style lang="scss" scoped>
.f-btn-check-group {
  display: flex;
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
    &::v-deep(.arco-checkbox-checked .arco-checkbox-icon) {
      background-color: #0082d6;
    }
    .bi-laebl {
      color: #4b5468;
      cursor: pointer;
    }
  }
}
</style>
