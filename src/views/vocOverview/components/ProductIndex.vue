<template>
  <div style="width: 100%; overflow: auto">
    <!-- style="min-width: 430px" -->
    <div>
      <a-grid
        :cols="20"
        class="pt-6 pb-7 mb-6 bgc-def border-radius4400"
        :class="{ 'pr-10': data?.length > 5 }"
      >
        <a-grid-item :span="2" class="text-align-center">
          <span class="color-26292e font-14 lh-20"></span>
        </a-grid-item>
        <a-grid-item :span="7" class="">
          <span class="color-26292e font-14 lh-20">车系名称</span>
        </a-grid-item>
        <a-grid-item :span="3" class="">
          <span class="color-26292e font-14 lh-20">体验指数</span>
        </a-grid-item>
        <a-grid-item :span="4" class="text-align-right">
          <span class="color-26292e font-14 lh-20 pr-18">环比</span>
        </a-grid-item>
        <a-grid-item :span="4" class="text-align-right">
          <span class="color-26292e font-14 lh-20 pr-23">同比</span>
        </a-grid-item>
      </a-grid>
      <div class="table-body">
        <template v-if="data?.length">
          <template v-for="(item, index) of data" :key="index">
            <a-grid
              :cols="20"
              class="pt-4 pb-7"
              :class="{ 'border-bottom-def': index !== data.length - 1 }"
            >
              <a-grid-item :span="2" class="text-align-center flex-xy-center">
                <span
                  class="font-14 fw-600"
                  :class="[rankColorMap[index + 1] ? rankColorMap[index + 1] : '']"
                  >{{ index + 1 }}.</span
                >
              </a-grid-item>
              <a-grid-item
                :span="7"
                class="flex-align-center point"
                @click="linkToExperience(item)"
              >
                <div class="car-img">
                  <SvgIcon
                    v-if="item.core === '1'"
                    name="car-bookmark-3-fill"
                    width="18px"
                    height="24px"
                    style="position: absolute; left: 0; top: 0"
                  ></SvgIcon>
                  <img
                    v-if="item.imgUrl"
                    :src="item.imgUrl"
                    class="car-img"
                    :class="{ 'bg-e78fa1-015': item.core === '1' }"
                  />
                  <!-- <SvgIcon name="car-xuan-yi" width="91px" height="44px"></SvgIcon> -->
                </div>
                <span
                  class="color-09121f font-16 ml-8"
                  :class="{ 'color-999-important': item.haltSales === '1' }"
                  >{{ handleStrBySliceNum(item.name, 5) }}</span
                >
              </a-grid-item>
              <a-grid-item :span="3" class="flex-align-center">
                <ExperienceIndex :emitionType="item.nsrG" :num="item.nsrC"></ExperienceIndex>
              </a-grid-item>
              <a-grid-item :span="4" class="flex-x-end-y-center color-dd3e3e">
                <RatioRY :value="item.nsrRp"></RatioRY>
              </a-grid-item>
              <a-grid-item :span="4" class="flex-x-end-y-center color-009949 pr-5">
                <RatioRY :value="item.nsrYp"></RatioRY>
              </a-grid-item>
            </a-grid>
          </template>
        </template>
        <template v-else>
          <FEmpty />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { rankColorMap } from '@/constant'
import useComQueryStore from '@/stores/modules/comQuery'
import { handleStrBySliceNum } from '@/utils'

interface Props {
  data: Record<any, any>[]
}

const { data } = defineProps<Props>()

const linkToExperience = (item: any) => {
  useComQueryStore().setCarSeriesList(item.name)
  useComQueryStore().linkToExperience()
}
</script>

<style lang="scss" scoped>
.table-body {
  height: 285px;
  overflow: auto;

  .car-img {
    width: 91px;
    height: 44px;
    position: relative;
  }
}
</style>
