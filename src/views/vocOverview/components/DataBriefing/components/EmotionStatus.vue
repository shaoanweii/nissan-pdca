<template>
  <div class="emotion-wrapper">
    <div class="emotion-bg laugh">
      <img class="eb-icon" :src="imgs[status]" alt="" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import happy from '@/assets/svg/emition/emotion-happy-line.svg'
import laugh from '@/assets/svg/emition/emotion-laugh-line.svg'
import normal from '@/assets/svg/emition/emotion-normal-line.svg'
import sad from '@/assets/svg/emition/emotion-sad-line.svg'

const { status = 'laugh' } = defineProps<{
  status: string
}>()

const imgs: Record<string, string> = {
  happy,
  laugh,
  normal,
  sad
}
</script>

<style lang="scss" scoped>
.emotion-wrapper {
  width: 98px;
  height: 98px;
  border-radius: 50%;
  border: 1px solid #dde3ee;
  display: flex;
  justify-content: center;
  align-items: center;

  .emotion-bg {
    width: 75px;
    height: 75px;
    background: rgba(39, 194, 159, 0.07);
    border-radius: 50%;
    /* border: 0px solid #dde3ee; */
    display: flex;
    justify-content: center;
    align-items: center;

    &.laugh {
      background: rgba(39, 194, 159, 0.07);
    }
    &.happy {
      background-color: rgba(#29b9c2, 0.07);
    }
    &.normal {
      background-color: rgba(#2c9bde, 0.07);
    }
    &.sad {
      background-color: rgba(#ff7b2f, 0.07);
    }

    .eb-icon {
      width: 48px;
      height: 48px;
    }
  }
}
</style>
