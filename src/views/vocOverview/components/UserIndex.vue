<template>
  <div style="width: 100%; overflow: auto">
    <div>
      <a-grid
        :cols="11"
        class="pt-6 pb-7 bgc-def border-radius4400"
        :class="{ 'pr-10': data && data?.length > 7 }"
      >
        <a-grid-item :span="2" class="text-align-center">
          <span class="color-26292e font-14 lh-20">类型</span>
        </a-grid-item>
        <a-grid-item :span="3" class="">
          <span class="color-26292e font-14 lh-20">分类名称</span>
        </a-grid-item>
        <a-grid-item :span="2" class="">
          <span class="color-26292e font-14 lh-20">体验指数</span>
        </a-grid-item>
        <a-grid-item :span="2" class="text-align-right">
          <span class="color-26292e font-14 lh-20 pr-18">环比</span>
        </a-grid-item>
        <a-grid-item :span="2" class="text-align-right">
          <span class="color-26292e font-14 lh-20 pr-23">同比</span>
        </a-grid-item>
      </a-grid>

      <div class="table-body">
        <div v-if="productList?.length" class="py-5 bgc-e6f8f5-fff radius-4 mt-6 lh-24">
          <template v-for="(item, index) of productList" :key="index">
            <a-grid :cols="11" :class="{ 'mt-16': index > 0 }">
              <a-grid-item :span="2" class="text-align-center">
                <span class="color-09121f font-14">{{ item.title }}</span>
              </a-grid-item>
              <!-- @click="linkToExperience" point -->
              <a-grid-item :span="3" class="flex-align-center">
                <SvgIcon
                  :name="svgToTagNameMap[item.firstCode] || svgToTagNameMap.default"
                  width="14px"
                  height="14px"
                ></SvgIcon>

                <span class="color-09121f font-14 ml-4">{{ item.tagName }}</span>
              </a-grid-item>
              <a-grid-item :span="2" class="flex-align-center">
                <ExperienceIndex :emitionType="item.nsrG" :num="item.nsrC"></ExperienceIndex>
                <!-- <SvgIcon
                  v-if="emitionMap[item.nsrG]"
                  :name="emitionMap[item.nsrG]"
                  width="16px"
                  height="16px"
                ></SvgIcon>
                <span class="color-009949 font-14 ml-7">{{ item.nsrC?.substring(0, 5) }}</span> -->
              </a-grid-item>
              <a-grid-item :span="2" class="text-align-right color-dd3e3e">
                <RatioRY :value="item.nsrRp"></RatioRY>
              </a-grid-item>
              <a-grid-item :span="2" class="text-align-right color-009949 pr-5">
                <RatioRY :value="item.nsrYp"></RatioRY>
              </a-grid-item>
            </a-grid>
          </template>
        </div>

        <div v-if="serviceList?.length" class="py-5 bgc-fff-e5f1ff radius-4 mt-6 lh-24">
          <a-grid
            v-for="(item, index) of serviceList"
            :key="index"
            :cols="11"
            :class="{ 'mt-14': index > 0 }"
          >
            <a-grid-item :span="2" class="text-align-center">
              <span class="color-09121f font-14">{{ item.title }}</span>
            </a-grid-item>
            <!-- @click="linkToExperience" point -->
            <a-grid-item :span="3" class="flex-align-center">
              <SvgIcon
                :name="svgToTagNameMap[item.firstCode] || svgToTagNameMap.default"
                width="14px"
                height="14px"
              ></SvgIcon>
              <span class="color-09121f font-14 ml-4">{{ item.tagName }}</span>
            </a-grid-item>
            <a-grid-item :span="2" class="flex-align-center">
              <ExperienceIndex :emitionType="item.nsrG" :num="item.nsrC"></ExperienceIndex>
            </a-grid-item>
            <a-grid-item :span="2" class="flex-x-end-y-center color-dd3e3e">
              <RatioRY :value="item.nsrRp"></RatioRY>
            </a-grid-item>
            <a-grid-item :span="2" class="flex-x-end-y-center color-009949 pr-5">
              <RatioRY :value="item.nsrYp"></RatioRY>
            </a-grid-item>
          </a-grid>
        </div>

        <FEmpty v-if="productList?.length === 0 && serviceList?.length === 0" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import useComQueryStore from '@/stores/modules/comQuery'

interface Props {
  data: Record<any, any>[] | undefined
}

const { data } = defineProps<Props>()

const svgToTagNameMap: Record<string, string> = {
  // 产品体验: 'car-line',
  // 智能化体验: 'codepen-fill',
  // 品牌体验: 'registered-line',
  // 销售服务: 'service-line',
  // 售后服务: 'customer-service-2-line',
  // 权益服务: 'gift-line',
  // 线上服务: 'global-line'
  DNDC1001: 'car-line',
  DNDC1004: 'codepen-fill',
  DNDC1002: 'registered-line',
  DNDC1007: 'service-line',
  DNDC1003: 'customer-service-2-line',
  DNDC1005: 'gift-line',
  DNDC1006: 'global-line',
  default: 'user-index-default'
}

const serviceList = computed(() => {
  return data?.filter(el => el.title === '服务')
})

const productList = computed(() => {
  return data?.filter(el => el.title === '产品')
})

// const linkToExperience = () => {
//   useComQueryStore().linkToExperience()
// }
</script>

<style lang="scss" scoped>
.table-body {
  height: 285px;
  overflow: auto;
}
</style>
