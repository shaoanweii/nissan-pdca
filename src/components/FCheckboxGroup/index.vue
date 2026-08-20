<template>
  <div class="f-checkbox-group">
    <template v-if="isShowAll">
      <a-checkbox v-model="checkedAll" :indeterminate="indeterminate" @change="handleChangeAll">
        全选
      </a-checkbox>
      <div class="divider"></div>
    </template>
    <a-checkbox-group v-model="selected" @change="handleChange">
      <a-checkbox v-for="(item, index) of group" :key="index" :value="item[fieldNames.value]">
        {{ item[fieldNames.label] }}
      </a-checkbox>
    </a-checkbox-group>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  group: any[]
  fieldNames?: { value: string; label: string }
  isShowAll?: boolean
}
const {
  group = [],
  fieldNames = { value: 'value', label: 'label' },
  isShowAll = false
} = defineProps<Props>()
const selected = defineModel<any[]>({ default: [] })
const indeterminate = ref(false)
const checkedAll = ref(false)

const handleChangeAll = (value: any) => {
  indeterminate.value = false
  if (value) {
    checkedAll.value = true
    selected.value = group.map(el => el[fieldNames.value]) as any[]
  } else {
    checkedAll.value = false
    selected.value = []
  }
}

watchEffect(() => {})

onMounted(() => {
  if (selected.value?.length === group.length) {
    checkedAll.value = true
    indeterminate.value = false
  } else if (selected.value?.length === 0) {
    checkedAll.value = false
    indeterminate.value = false
  } else {
    checkedAll.value = false
    indeterminate.value = false
  }
})

const handleChange = (values: any[]) => {
  if (values.length === group.length) {
    checkedAll.value = true
    indeterminate.value = false
  } else if (values.length === 0) {
    checkedAll.value = false
    indeterminate.value = false
  } else {
    checkedAll.value = false
    indeterminate.value = true
  }
}
</script>

<style lang="scss" scoped>
.f-checkbox-group {
  display: flex;
  align-items: center;
  .divider {
    background: rgba(#26292e, 0.15);
    width: 1px;
    height: 16px;
    margin: 0 16px;
  }
}
</style>
