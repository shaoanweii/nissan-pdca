<script setup lang="ts">
defineOptions({
  name: 'BuildStatus'
})

const { status, statusText } = defineProps<{
  status: string
  statusText: string
}>()

const statusMap: any = {
  0: {
    color: '#FF7B2F',
    icon: 'ri-file-history-line'
  },
  1: {
    color: '#6E7B91',
    icon: 'ri-task-line'
  },
  2: {
    color: '#DD3E3E',
    icon: 'ri-file-warning-line'
  }
}
</script>

<template>
  <span class="flex-inline align-center" :style="{ color: statusMap[status].color }">
    <i class="font-16" :class="[statusMap[status].icon]"></i>
    <span class="ml-4">{{ statusText }}</span>
  </span>
</template>

<style lang="scss" scoped></style>
