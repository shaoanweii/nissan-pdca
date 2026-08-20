<script setup lang="ts">
import type { CascaderFieldNames } from '@arco-design/web-vue'
import { cloneDeep } from 'lodash-es'

interface Props {
  options: any[]
  multiple?: boolean
  allowClear?: boolean
  fieldNames?: CascaderFieldNames
  placeholder?: string
  maxTagCount?: number
  subLength?: number
  bgColor?: string
  cRadius?: string
  cBorder?: string
  resetTagBg?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  fieldNames: () => ({ label: 'label', value: 'value' }),
  placeholder: '全选',
  multiple: false,
  allowClear: false,
  maxTagCount: 1,
  subLength: 1,
  bgColor: 'bg-white',
  cRadius: 'radius-4',
  cBorder: 'border-def',
  resetTagBg: false
})

const { options, fieldNames, placeholder, multiple, allowClear, maxTagCount, subLength } =
  toRefs(props)
const emits = defineEmits(['change', 'change2'])
const modelValue = defineModel<any>()
const curValue = ref<any>()
const cacheValue = ref()
const changeSource = ref('')

const allList = ['all', '全选']

watch(
  () => modelValue.value,
  () => {
    if (!modelValue.value || modelValue.value?.length === 0) {
      curValue.value = []
    }
    // 外部传入的值, 需要初始化给 curValue
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
  () => options.value,
  (nval: any) => {
    if (nval?.length > 0) {
      handleOptions()
    }
  },
  {
    deep: true
  }
)

const setValue = (val: any[] | any) => {
  curValue.value = val
  if (multiple.value) {
    modelValue.value = val?.filter((el: any) => !allList.includes(el))
  } else {
    modelValue.value = val
  }

  setCacheValue(val)
  emits('change2', val)
}

const setCacheValue = (val: any[]) => {
  cacheValue.value = cloneDeep(val)
}

const allValue = computed(() => {
  return options.value.map(el => el[fieldNames.value.value!])
})

const handleChange = (val: any) => {
  emits('change', val)
  changeSource.value = 'selfChange'
  if (!multiple.value) {
    setValue(val)
    return
  }

  if (cacheValue.value?.length > val.length && val.length === 1 && allList.includes(val[0])) {
    setValue([])
    return
  }

  if ((val.length === 1 && allList.includes(val[0])) || allList.includes(val[val.length - 1])) {
    setValue(allValue.value)
    return
  }

  // 新增
  if (val.length >= cacheValue.value?.length) {
    if (
      !(val.includes('all') || val.includes('全选')) &&
      val.length === allValue.value.length - 1
    ) {
      setValue(allValue.value)
      return
    }
  } else {
    if (!(val.includes('all') || val.includes('全选')) && allList.includes(cacheValue.value?.[0])) {
      setValue([])
      return
    }
    if (val.includes('all') || val.includes('全选')) {
      setValue(val?.filter((el: string) => !allList.includes(el)))
      return
    }
  }
  setValue(val)
}

const formatLabel = (options: any) => {
  if (options.label?.length > subLength.value) {
    return `${options.label.substring(0, subLength.value)}...`
  } else {
    return options.label
  }
}

const handleOptions = () => {
  // if (!multiple.value) {
  //   return
  // }

  let allObj

  if (fieldNames.value) {
    allObj = { [fieldNames.value.value!]: 'all', [fieldNames.value.label!]: '全选' }
  } else {
    allObj = { value: 'all', label: '全选' }
  }

  if (options.value?.length > 0) {
    const firstLabel = options.value[0][fieldNames.value.label!]
    if (firstLabel === '全选') return
    options.value.unshift(allObj)
  }
}

/**
 * @description: 初始化时设置缓存值
 * @return {*}
 */
const initValue = () => {
  if (multiple.value) {
    if (modelValue.value?.length === allValue.value?.length - 1) {
      curValue.value = allValue.value
    } else {
      curValue.value = modelValue.value
    }
    setCacheValue(curValue.value!)
  } else {
    curValue.value = modelValue.value
    // nextTick(() => {
    //   curValue.value = modelValue.value ? modelValue.value : 'all'
    // })
  }
}

onMounted(() => {
  if (multiple.value) {
    handleOptions()
    initValue()
  } else {
    handleOptions()
    initValue()
  }
})
</script>

<template>
  <div :class="['f-select', resetTagBg ? 'reset-tag-bg' : '']">
    <a-select
      :class="[bgColor, cRadius, cBorder]"
      v-model="curValue"
      :multiple="multiple"
      :allow-clear="allowClear"
      :max-tag-count="maxTagCount"
      :placeholder="placeholder"
      :format-label="formatLabel"
      @change="handleChange"
    >
      <a-option v-for="(item, index) of options" :key="index" :value="item[fieldNames.value!]">
        {{ item[fieldNames.label!] }}
      </a-option>
    </a-select>
  </div>
</template>

<style lang="scss">
.f-select {
  .arco-tag {
    background-color: #f2f3f5 !important;
  }
  .arco-select-view-multiple.arco-select-view-size-medium .arco-select-view-inner {
    white-space: nowrap;
  }
}

.reset-tag-bg .arco-tag {
  background-color: #fff !important;
}
</style>
