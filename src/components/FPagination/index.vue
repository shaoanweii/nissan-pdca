<template>
  <div class="f-pagination flex align-center justify-end">
    <div class="f-btn-def" :class="{ disabled: isFirstPage }" @click="handlePrevPage">上一页</div>
    <div class="f-btn-def ml-16" :class="{ disabled: isLastPage }" @click="handleNextPage">
      下一页
    </div>
    <div class="ml-16">共{{ pageCount }}页</div>
    <div class="flex align-center ml-27">
      <div>前往</div>
      <a-input
        v-model="jumpPage"
        class="f-input"
        @blur="jumpToPage"
        @keyup.enter="jumpToPage"
      ></a-input>
      <div>页</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  total: number
  pageSize: number
}
const { total = 0, pageSize = 10 } = defineProps<Props>()
const emits = defineEmits(['change'])
const current = defineModel<number>('current', { default: 1 })

const isFirstPage = computed(() => {
  return current.value === 1
})

const isLastPage = computed(() => {
  return current.value === pageCount.value
})

const pageCount = computed(() => {
  return Math.ceil(total / pageSize)
})

// 计算上一页页码
const prevPage = computed(() => {
  return Math.max(current.value - 1, 1)
})
// 计算下一页页码
const nextPage = computed(() => {
  return Math.min(current.value + 1, pageCount.value)
})

// 跳转页码输入框
const jumpPage = ref('')

// 处理点击上一页按钮的方法
const handlePrevPage = () => {
  if (current.value > 1) {
    current.value = prevPage.value
    emits('change', prevPage.value)
  }
}

// 处理点击下一页按钮的方法
const handleNextPage = () => {
  if (current.value < pageCount.value) {
    current.value = nextPage.value
    emits('change', nextPage.value)
  }
}
// 跳转到指定页码
const jumpToPage = () => {
  const page = parseInt(jumpPage.value)
  if (!isNaN(page) && page >= 1 && page <= pageCount.value) {
    current.value = page
    jumpPage.value = ''
    emits('change', page)
  } else if (page > pageCount.value && page !== pageCount.value) {
    jumpPage.value = ''
    current.value = pageCount.value
    emits('change', pageCount.value)
  } else if (page < 1) {
    jumpPage.value = ''
    current.value = 1
    emits('change', 1)
  }
}
</script>

<style lang="scss" scoped>
.f-pagination {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 16px;
  .f-btn-def {
    font-size: 14px;
    color: #4b5468;
    line-height: 16px;
    padding: 8px 12px;
    background: #e8f3ff;
    border-radius: 4px 4px 4px 4px;
    cursor: pointer;
    &.disabled {
      background: #f0f3fa;
      opacity: 0.45;
      /* pointer-events: none; */
      cursor: not-allowed;
    }
  }
  .ml-16 {
    margin-left: 16px;
  }
  .ml-27 {
    margin-left: 27px;
  }
  .ml-12 {
    margin-left: 12px;
  }
  .f-input {
    width: 50px;
    margin: 0 12px;
    background: #ffffff;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #f2f3f5;
  }
}
</style>
