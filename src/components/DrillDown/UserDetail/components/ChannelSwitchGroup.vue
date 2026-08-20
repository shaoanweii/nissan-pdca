<template>
  <div class="car-list white radius4">
    <span
      class="left"
      v-if="isOver"
      @click="handleClick('left')"
      :class="{ 'left-end': beStarted }"
    >
      <i class="iconfont icon-xiangzuo"></i>
    </span>
    <ul
      class="car-list-wrapper"
      ref="carListWrapper"
      :class="{ overScroll: isOver }"
      :style="{ left: moveX + 'px' }"
    >
      <li
        v-for="(item, index) in listData"
        :key="index"
        :class="{ active: item.value === activeValue }"
        @click="handleClickCar(item)"
      >
        <p class="label">
          {{ item.label }}<span>{{ item.static }}</span>
        </p>
      </li>
    </ul>
    <span class="right" v-if="isOver" @click="handleClick('right')" :class="{ 'right-end': beEnd }">
      <i class="iconfont icon-xiangyou"></i>
    </span>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  defaultValue?: string
  listData: any[]
}

const { defaultValue, listData = [] } = defineProps<Props>()

const emits = defineEmits(['input', 'change'])

const activeValue = ref(defaultValue)

const carObjWidth = ref()
const isOver = ref(false)
const moveX = ref(0)
const dir = ref(0)
const beStarted = ref(true)
const beEnd = ref(false)
const carListWrapper = ref()

watch(
  () => listData,
  val => {
    if (val && val.length) {
      calclistDataWidth()
    }
  }
)

onMounted(() => {
  calclistDataWidth()
})

const handleClickCar = (item: any) => {
  activeValue.value = item.value
  emits('input', item.value)
  emits('change', item)
}

const handleClick = (arg: any) => {
  let space = carObjWidth.value + 30
  let index = Math.ceil(space / 160) // 往单个方向移动的次数
  // console.info('index', index)
  // let dir = 1
  if (arg === 'right') {
    if (++dir.value && dir.value < index) {
      moveX.value += -1 * 160
    } else {
      dir.value = index
      moveX.value = -space
    }
  } else {
    if (dir.value-- && dir.value > 0) {
      moveX.value += 1 * 160
    } else {
      dir.value = 0
      moveX.value = 0
    }
  }
  if (dir.value === 0) {
    beStarted.value = true
    beEnd.value = false
  } else if (dir.value * 160 + 630 > space) {
    beEnd.value = true
    beStarted.value = false
  } else {
    beEnd.value = false
    beStarted.value = false
  }
  // console.info(this.dir, this.moveX)
  // this.listData[0].showImg = this.dir === 0 ? require('@/assets/cars/all-checked@1x.png') : require('@/assets/cars/all@1x.png')
}
const calclistDataWidth = () => {
  isOver.value = false
  moveX.value = 0
  dir.value = 0
  beStarted.value = true
  beEnd.value = false
  carObjWidth.value = carListWrapper.value.offsetWidth
  isOver.value = carObjWidth.value > 640
}
</script>

<style lang="scss" scoped>
.car-list {
  position: relative;
  margin: 16px 24px;
  overflow: hidden;
  width: calc(100% - 48px);
  height: 32px;
  .left,
  .right {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 10px;
    position: absolute;
    width: 18px;
    height: 30px;
    top: 0;
    background: #f0f3fa;
    cursor: pointer;
    z-index: 1;
    transition: all 0.5s ease 0s;
    border: $--border;
    font-size: 12px;
  }
  .left {
    left: 0;
  }
  .right {
    right: 0;
  }
  .left-end {
    display: none;
  }
  .right-end {
    display: none;
  }
  ul {
    width: auto;
    // display: flex;
    white-space: nowrap;
    position: absolute;
    transition: all 1s ease 0s;
    li {
      display: inline-block;
      border-top: $--border;
      border-bottom: $--border;
      padding: 0 12px;
      line-height: 30px;
      position: relative;
      cursor: pointer;
      background: #f8f9fa;
      .car-img {
        width: 120px;
        display: block;
        height: 80px;
      }
      p.label {
        text-align: center;
        white-space: nowrap;
        span {
          font-weight: normal;
          margin-left: 8px;
        }
      }
      &::after {
        content: '';
        height: 16px;
        border-left: $--border;
        position: absolute;
        top: 8px;
        right: 0;
      }
      &.active {
        // color: $--color-primary;
        background: #fff;
        font-weight: bold;
        color: #001e50;
      }
      &:first-child {
        position: relative;
        border-left: $--border;
        border-radius: 4px 0 0 4px;
        // &::before {
        //   position: absolute;
        //   width: 1px;
        //   height: 80px;
        //   top: 26px;
        //   right: 0;
        //   background-color: rgba(0, 0, 0, 0.1);
        //   content: '';
        //   display: inline-block;
        // }
      }
      &:last-child {
        border-right: $--border;
        border-radius: 0 4px 4px 0;
        &::after {
          display: none;
        }
      }
    }
  }
}
</style>
