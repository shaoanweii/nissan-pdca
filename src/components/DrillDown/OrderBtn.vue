<template>
  <div class="btn-wrapper border-def radius-4 bg-white flex-xy-center point" @click="orderChange">
    <template v-if="order === 'desc'">
      <span class="font-14 lh-16 color-26292e">时间降序</span>
      <!-- icon-shengxu -->
      <i class="iconfont icon-jiangxu font-16 ml-8"></i>
    </template>
    <template v-else>
      <span class="font-14 lh-16 color-26292e">时间升序</span>
      <i class="iconfont icon-shengxu font-16 ml-8"></i>
    </template>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  orderKey: string
  defOrder?: 'desc' | 'asc'
}
const { orderKey, defOrder = 'desc' } = defineProps<Props>()
const emits = defineEmits(['change'])

const order = ref(defOrder)

const orderChange = () => {
  order.value = order.value === 'desc' ? 'asc' : 'desc'
  emits('change', `${orderKey} ${order.value}`)
}
</script>

<style lang="scss" scoped>
.btn-wrapper {
  width: 104px;
  height: 32px;
}
</style>
