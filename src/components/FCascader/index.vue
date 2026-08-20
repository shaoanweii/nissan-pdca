<script setup lang="ts">
import type { CascaderFieldNames, CascaderOption, TagProps } from '@arco-design/web-vue'
import { cloneDeep } from 'lodash-es'

interface Props {
  options: any[]
  multiple?: boolean
  allowClear?: boolean
  fieldNames: CascaderFieldNames
  placeholder?: string
  separator?: string
  maxTagCount?: number
  subLength?: number
  checkStrictly?: boolean
  pathMode?: boolean
  parentKey?: string
  tagProps?: TagProps
  bgColor?: string
  resetTagBg?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  fieldNames: () => ({ label: 'label', value: 'value', children: 'children' }),
  placeholder: '全部',
  multiple: true,
  allowClear: true,
  maxTagCount: 1,
  subLength: 1,
  separator: '#',
  checkStrictly: false,
  pathMode: false,
  parentKey: 'tagCode',
  tagProps: undefined,
  bgColor: 'bg-white',
  resetTagBg: false
})

const {
  options,
  fieldNames,
  placeholder,
  multiple,
  allowClear,
  maxTagCount,
  separator,
  subLength,
  checkStrictly,
  pathMode,
  tagProps
} = toRefs(props)

const modelValue = defineModel<string[]>()
const emits = defineEmits([
  'change',
  'popupVisibleChange',
  'clear',
  'afterChange',
  'indeterminateCheckedStatus'
])

const curValue = ref<string[]>()
const cacheValue = ref<string[]>([])
const changeSource = ref('')
const cascadeRef = useTemplateRef('cascadeRef')

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
      initValue()
    }
  },
  {
    deep: true
  }
)

const formatLabel = (options: CascaderOption[]) => {
  const str = options.map((option: any) => option[fieldNames.value.label!])?.join(separator.value)
  // const offsetWidth = cascadeRef.value?.offsetWidth || 100
  // const fontSize = 12
  // const width1 = 16 + 24 + 6 + 12
  // const strWidth = fontSize * str.length
  // let newWidth = offsetWidth - width1
  // if (options?.length === 1) {
  //   newWidth = offsetWidth
  // } else if (options?.length < 10) {
  //   newWidth = offsetWidth - 45
  // } else if (options?.length < 100) {
  //   newWidth = offsetWidth - 55
  // } else if (options?.length < 1000) {
  //   newWidth = offsetWidth - 61
  // }
  // let len = Math.floor(newWidth / fontSize) - 4
  // len = len < 0 ? 0 : len
  // return `${str.substring(0, subLength.value)}...`
  if (subLength.value === -1) {
    return str
  }
  if (str?.length > subLength.value) {
    return `${str.substring(0, subLength.value)}...`
  } else {
    return str
  }
  // return str?.length >= len ? `${str.substring(0, len)}...` : str
}

const setValue = (val: any[]) => {
  curValue.value = val
  if (pathMode.value) {
    modelValue.value = multiple.value ? val?.filter(el => el[0] !== 'all') : val
  } else {
    modelValue.value = multiple.value ? val?.filter(el => el !== 'all') : val
  }
  emits('afterChange', modelValue.value)
  emits('indeterminateCheckedStatus', indeterminateCheckedStatus(val))
  setCacheValue(val)
}

const setCacheValue = (val: any[]) => {
  cacheValue.value = cloneDeep(val)
}

/**
 * @description: 默认change模式
 * @param {*} val
 * @return {*}
 */
const defaultChange = (val: string[]) => {
  emits('change', val)
  changeSource.value = 'selfChange'
  if (!multiple.value) {
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

/**
 * @description: pathMode change模式
 * @param {*} val
 * @return {*}
 */
const pathModeChange = (val: any[]) => {
  emits('change', val)
  changeSource.value = 'selfChange'
  if (!multiple.value) {
    setValue(val)
    return
  }

  if (cacheValue.value?.length > val.length && val.length === 1 && val[0]?.[0] === 'all') {
    setValue([])
    return
  }

  if ((val.length === 1 && val[0]?.[0] === 'all') || val[val.length - 1]?.[0] === 'all') {
    setValue(allValue.value)
    return
  }
  // 新增
  if (val.length >= cacheValue.value?.length) {
    if (!val.toString()?.includes('all') && val.length === allValue.value.length - 1) {
      setValue(allValue.value)
      return
    }
  } else {
    if (!val.toString()?.includes('all') && cacheValue.value?.[0]?.[0] === 'all') {
      setValue([])
      return
    }
    if (val.toString()?.includes('all')) {
      setValue(val?.filter(el => el?.[0] !== 'all'))
      return
    }
  }
  setValue(val)
}

const handleChange = (val: string[]) => {
  if (pathMode.value) {
    pathModeChange(val)
  } else {
    defaultChange(val)
  }
}

/**
 * @description: 递归获取最后一级值
 * @param {*} arr
 * @return {*}
 */
const getLastLevelValues = (arr: any[]) => {
  if (!arr || arr?.length === 0) return arr
  let values: any[] = []
  if (!fieldNames.value.value) {
    for (let item of arr) {
      if (item.children) {
        values = values.concat(getLastLevelValues(item.children))
      } else {
        values.push(item.value)
      }
    }
  } else {
    for (let item of arr) {
      if (item[fieldNames.value['children']!]) {
        values = values.concat(getLastLevelValues(item[fieldNames.value['children']!]))
      } else {
        values.push(item[fieldNames.value['value']])
      }
    }
  }

  return values
}

/**
 * @description: checkStrictly模式 获取所有的value
 * @param {*} tree
 * @return {*}
 */
const getAllValueInArray = (tree: any) => {
  let vales: any = []

  function traverse(node: any) {
    if (node) {
      vales.push(node[fieldNames.value.value!])
      if (node[fieldNames.value.children!] && node[fieldNames.value.children!].length > 0) {
        node[fieldNames.value.children!].forEach(traverse)
      }
    }
  }

  tree.forEach(traverse)

  return vales
}

/**
 * @description: pathMode 模式 获取所有的value存在二维数组中， 用于pathMode模式
 * @param {*} arr
 * @return {*}
 */
const getLastLevelValuesIn2DArray = (arr: any[]) => {
  if (!arr || arr?.length === 0) return arr
  let result: any[] = []
  function recursiveTraversal(node: any, path: any[]) {
    path.push(node[fieldNames.value.value!])
    if (node[fieldNames.value.children!] && node[fieldNames.value.children!].length > 0) {
      for (const child of node[fieldNames.value.children!]) {
        recursiveTraversal(child, [...path])
      }
    } else {
      result.push(path)
    }
  }
  for (const rootNode of arr) {
    recursiveTraversal(rootNode, [])
  }
  return result
}

/**
 * @description: checkStrictly && pathMode 模式下。 获取每一项放到数组中， [父级， 子级]
 * @param {*} arr
 * @return {*}
 */
const getAllValueIn2DArray = (arr: any[]) => {
  if (!arr || arr?.length === 0) return arr
  let result: any[] = []
  function recursiveTraversal(node: any, path = []) {
    const currentPath: any = [...path, node[fieldNames.value.value!]]
    result.push(currentPath)
    if (node[fieldNames.value.children!] && node[fieldNames.value.children!].length > 0) {
      for (const child of node[fieldNames.value.children!]) {
        recursiveTraversal(child, currentPath)
      }
    }
  }
  for (const rootNode of arr) {
    recursiveTraversal(rootNode, [])
  }
  return result
}

const getAllLevelValues = (arr: any[]) => {
  if (pathMode.value && checkStrictly.value) {
    return getAllValueIn2DArray(arr)
  }
  if (pathMode.value) {
    return getLastLevelValuesIn2DArray(arr)
  }
  if (checkStrictly.value) {
    return getAllValueInArray(arr)
  }
}

const allValue = computed(() => {
  if (checkStrictly.value || pathMode.value) {
    return getAllLevelValues(options.value)
  } else {
    return getLastLevelValues(options.value)
  }
})

const handlePopupVisibleChange = (val: boolean) => {
  if (!val) {
    emits('popupVisibleChange', modelValue.value)
  }
}

const handleClear = () => {
  emits('clear')
}

/**
 * @description: 初始化时设置缓存值
 * @return {*}
 */
const initValue = () => {
  if (modelValue.value?.length === allValue.value?.length - 1) {
    curValue.value = allValue.value
    if (!pathMode.value) {
      if (!curValue.value?.includes('all')) {
        curValue.value && curValue.value.unshift('all')
      }
    }
  } else {
    curValue.value = modelValue.value
  }
  setCacheValue(curValue.value!)
}

const addTagPropsToTree = (tree: any) => {
  function traverse(node: any) {
    if (node) {
      node.tagProps = tagProps.value

      if (node[fieldNames.value.children!] && node[fieldNames.value.children!].length > 0) {
        node[fieldNames.value.children!].forEach(traverse)
      }
    }
  }

  tree.forEach(traverse)

  return tree
}

/**
 * @description: 基础多选模式下的全选半选状态
 * @return {*}
 */
const indeterminateCheckedStatus = (value: any, allInValue = true) => {
  let checked = false
  let indeterminate = false
  let allValueLength = allValue.value?.length
  if (allInValue) {
    allValueLength = allValue.value?.length
  } else {
    allValueLength = allValue.value?.length - 1
  }
  if (allValue.value?.length === 0) {
    checked = false
    indeterminate = false
    return { checked, indeterminate }
  }
  if (value?.length === allValueLength) {
    checked = true
    indeterminate = false
  } else if (value?.length === 0) {
    checked = false
    indeterminate = false
  } else {
    checked = false
    indeterminate = true
  }

  return { checked, indeterminate }
}

/**
 * @description: 处理选项(添加全选选项)
 * @return {*}
 */
const handleOptions = () => {
  if (!multiple.value) return
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
  if (tagProps.value) {
    addTagPropsToTree(options.value)
  }
}

onMounted(() => {
  if (multiple.value) {
    handleOptions()
    initValue()
  }
})
onBeforeUnmount(() => {
  changeSource.value = ''
})

defineExpose({ handleChange, indeterminateCheckedStatus })
</script>

<template>
  <div class="ft-cascader" ref="cascadeRef" :class="[resetTagBg ? 'reset-tag-bg' : '']">
    <!--  :allow-search="false" -->
    <a-cascader
      v-model="curValue"
      :options="options"
      :multiple="multiple"
      :allow-clear="allowClear"
      :field-names="fieldNames"
      :max-tag-count="maxTagCount"
      :format-label="formatLabel"
      :check-strictly="checkStrictly"
      :path-mode="pathMode"
      :trigger-props="{
        contentClass: 'fCascader'
      }"
      :class="[bgColor]"
      :placeholder="placeholder"
      @change="(val: any) => handleChange(val)"
      @popup-visible-change="handlePopupVisibleChange"
      @clear="handleClear"
    >
    </a-cascader>
  </div>
</template>

<style lang="scss">
.ft-cascader {
  display: inline-block;
  .arco-tag {
    background-color: #f2f3f5 !important;
  }
  .arco-select-view-multiple {
    border: none;
  }
  .arco-select-view-multiple.arco-select-view-size-medium .arco-select-view-inner {
    white-space: nowrap;
  }
}
.reset-tag-bg {
  .arco-tag {
    background-color: #fff !important;
  }

  .arco-select-view-multiple {
    &:focus-within {
      border: 1px solid #165dff;
    }
  }
}
</style>
