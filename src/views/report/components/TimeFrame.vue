<script setup lang="ts">
import type { CalendarValue } from '@arco-design/web-vue/es/date-picker/interface'
import dayjs from 'dayjs'

defineOptions({
  name: 'TimeFrame'
})

const timer = defineModel<any[]>({ default: [] })

const setDefTime = () => {
  // 当前时间
  // const now = dayjs().subtract(1, 'day')
  const now = dayjs()

  // 获取一个月之前的时间（最多30天）
  const oneMonthAgo = now.subtract(maxRange, 'day')

  // 默认时间
  timer.value = [oneMonthAgo.format('YYYY-MM-DD'), now.format('YYYY-MM-DD')]
}

setDefTime()

const selectedTime = ref()
const maxRange = 30 // 最大选择范围为30天

/**
 * @param value 选中的时间
 */
const handleSelectDate = (value: (CalendarValue | undefined)[]): any => {
  if (value[0]) {
    selectedTime.value = value[0]
  }
}

/**
 * @description: 日期禁用逻辑
 * 1. 限制前后一个月的日期范围
 * 2. 限制最多选择30天的日期范围
 * @param {*} current
 * @return {*}
 */
const handleDisabledDate = (current?: Date): any => {
  if (selectedTime.value) {
    const startDate = dayjs(selectedTime.value).subtract(maxRange, 'day')
    const endDate = dayjs(selectedTime.value).add(maxRange, 'day')
    const currentDate = dayjs(current)
    if (currentDate.isBefore(startDate) || currentDate.isAfter(endDate)) {
      return true
    }
  }
  return false
}

defineExpose({ setDefTime })
</script>

<template>
  <a-range-picker
    v-model="timer"
    value-format="YYYY-MM-DD"
    :allow-clear="false"
    :disabled-date="handleDisabledDate"
    @select="handleSelectDate"
  />
</template>

<style lang="scss" scoped></style>
