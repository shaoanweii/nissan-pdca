<script setup lang="ts">
import { cloneDeep } from 'lodash-es'

const attrs = useAttrs()
const slots = useSlots()

const value = defineModel<string[]>()

const _value = ref<string[]>()
const cacheValue = ref<string[]>([])
const changeSource = ref('')

watch(
  () => value.value,
  () => {
    if (!value.value || value.value?.length === 0) {
      _value.value = []
    }
    // 外部传入的值, 需要初始化给 _value
    if (changeSource.value !== 'selfChange') {
      initValue()
    }
  },
  {
    deep: true
  }
)

// options 更新
watch(
  () => attrs?.options,
  (nval: any) => {
    if (nval?.length > 0) {
      handleOptions()
    }
  },
  {
    deep: true
  }
)

const setValue = (val: any[]) => {
  _value.value = val
  value.value = isMultiple.value ? val?.filter(el => el !== 'all') : val
  setCacheValue(val)
}

const setCacheValue = (val: any[]) => {
  cacheValue.value = cloneDeep(val)
}

const handleChange = (val: string[]) => {
  console.log('val', val)
  console.log('cacheValue.value', cacheValue.value)

  changeSource.value = 'selfChange'
  if (!isMultiple.value) {
    setValue(val)
    return
  }

  if (cacheValue.value?.length > val.length && val.length === 1 && val[0] === 'all') {
    setValue([])
    return
  }

  if ((val.length === 1 && val[0] === 'all') || val[val.length - 1] === 'all') {
    setValue(allValue.value)
    return
  }

  // 新增
  if (val.length >= cacheValue.value?.length) {
    if (!val.includes('all') && val.length === allValue.value.length - 1) {
      setValue(allValue.value)
      return
    }
  } else {
    if (!val.includes('all') && cacheValue.value?.[0] === 'all') {
      setValue([])
      return
    }
    if (val.includes('all')) {
      setValue(val?.filter(el => el !== 'all'))
      return
    }
  }
  setValue(val)
}

const handleOptions = () => {
  const options = (attrs?.options || []) as any[]
  let allObj
  if (fieldNames.value) {
    allObj = { [fieldNames.value?.value]: 'all', [fieldNames.value?.label]: '全选' }
  } else {
    allObj = { value: 'all', label: '全选' }
  }

  if (options?.length > 0) {
    const firstLabel = options[0][fieldNames.value?.label]
    if (firstLabel === '全选') return
    options.unshift(allObj)
  }
}

const fieldNames = computed(() => {
  return attrs['field-names'] as any
})

const isMultiple = computed(() => {
  return Object.keys(attrs!).includes('multiple')
})

const getLastLevelValues = (arr: any[]) => {
  if (!arr || arr?.length === 0) return arr
  let values: any[] = []
  if (!fieldNames.value) {
    for (let item of arr) {
      if (item.children) {
        values = values.concat(getLastLevelValues(item.children))
      } else {
        values.push(item.value)
      }
    }
  } else {
    for (let item of arr) {
      if (item[fieldNames.value['children']]) {
        values = values.concat(getLastLevelValues(item[fieldNames.value['children']]))
      } else {
        values.push(item[fieldNames.value['value']])
      }
    }
  }

  return values
}

const allValue = computed(() => {
  return getLastLevelValues(attrs?.options as any)
})

const initValue = () => {
  if (value.value?.length === allValue.value?.length - 1) {
    _value.value = allValue.value
  } else {
    _value.value = value.value
  }
  setCacheValue(_value.value!)
}

onMounted(() => {
  if (isMultiple.value) {
    handleOptions()
    initValue()
  }
})
</script>

<template>
  <a-cascader v-model="_value" v-bind="$attrs" @change="(val: any) => handleChange(val)">
    <template v-if="slots.label" #label="{ laebl }">
      <slot name="label">
        <span style="background-color: red">{{ laebl }}</span>
      </slot>
    </template>
    <template v-if="slots.prefix" #prefix>
      <slot name="prefix"></slot>
    </template>
    <template v-if="slots['arrow-icon']" #arrow-icon>
      <slot name="arrow-icon"></slot>
    </template>
    <template v-if="slots['loading-icon']" #loading-icon>
      <slot name="loading-icon"></slot>
    </template>
    <template v-if="slots['search-icon']" #search-icon>
      <slot name="search-icon"></slot>
    </template>
    <template v-if="slots.empty" #empty>
      <slot name="empty"></slot>
    </template>
    <template v-if="slots.option" #option>
      <slot name="option"></slot>
    </template>
  </a-cascader>
</template>

<style scoped lang="scss"></style>
