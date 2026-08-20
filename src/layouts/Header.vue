<template>
  <header class="flex-justify-between">
    <div class="left">
      <div class="l-title flex-align-center justify-center" style="width: 176px">
        <!-- <img src="../assets/icon/logo.png" alt="" /> -->
        <div class="">VOC数字化</div>
      </div>

      <div class="brand-wrapper" v-if="userStore.isHideBrand">
        <template v-for="(item, index) of userStore.brands" :key="index">
          <div
            class="bw-item"
            :class="{ active: comQueryStore.form.brandCodeList?.includes(item.value) }"
            @click="handleBrandChange(item)"
          >
            <img v-if="item.img" :src="item.img" alt="" class="brand-logo" />
            <div v-else class="brand-name">
              {{ getBrandDisplayName(item) }}
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="right flex-align-center">
      <!-- <div class="mr-16">
        <i class="iconfont icon-riqi"></i>
        <span class="ml-8" style="color: #4e5969">{{ now }}</span>
      </div> -->

      <!-- <a-avatar :style="{ backgroundColor: '#98A2B2', color: '#FFFFFF' }">
        <IconUser />
      </a-avatar>
      <span class="ml-8 username">{{ userStore.userInfo.username }}</span> -->
      <a-spin :loading="downloadLoading">
        <div class="mr-24 download-report-class" @click="handleDownloadReport">
          <img class="download-report-img" src="@/assets/imgs/download_report.png" alt="" /><span
            class="ml-8 download-report-text"
            >页面功能介绍</span
          >
        </div>
      </a-spin>
      <a-dropdown trigger="click" position="br" @select="handleUserMenuSelect">
        <button
          type="button"
          class="user-trigger"
          :title="userStore.userInfo.deptName || ''"
          aria-label="打开用户菜单"
        >
          <i class="ri-account-circle-line"></i>
          <span>{{ userStore.userInfo.username || '当前用户' }}</span>
          <i class="ri-arrow-down-s-line user-trigger-arrow"></i>
        </button>
        <template #content>
          <a-doption value="logout">
            <span class="user-menu-option"><i class="ri-logout-box-r-line"></i>退出登录</span>
          </a-doption>
        </template>
      </a-dropdown>
    </div>
  </header>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import useUserStore from '@/stores/modules/user'
import eventBus from '@/utils/eventBus'
import useComQueryStore from '@/stores/modules/comQuery'
import { debounce } from 'lodash-es'
import axios from 'axios'
import to from 'await-to-js'
import { getHandBook } from '@/service/common'
import { Message } from '@arco-design/web-vue'

const userStore = useUserStore()
const comQueryStore = useComQueryStore()

const downloadLoading = ref(false)

const getBrandDisplayName = (item: any) => {
  if (item.value === 'NISSAN') return '日产'
  if (item.value === 'VENUCIA') return '启辰'
  return item.key || item.value
}
const handleUserMenuSelect = (value: string | number | Record<string, any> | undefined) => {
  if (value === 'logout') userStore.logout()
}

const handleBrandChange = debounce((item: any) => {
  if (comQueryStore.form.brandCodeList?.includes(item.value)) {
    return
  }
  comQueryStore.setBrandCodeList(item.value)
  // comQueryStore.setBrandCode(item.value)
  eventBus.emit('brandChange')
}, 300)

//下载功能
const handleDownloadReport = async () => {
  // 显示加载状态
  downloadLoading.value = true
  const [errs, data] = await to(getHandBook())
  if (errs) {
    Message.error(errs.message)
    downloadLoading.value = false
    return
  }
  if (data) {
    const { key, url } = data.result
    if (!url) {
      Message.error('下载地址不存在')
      downloadLoading.value = false
      return
    }
    try {
      // 获取完整的下载URL
      const downloadUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`
      const fileResponse = await axios({
        url: downloadUrl,
        method: 'get',
        responseType: 'blob'
      })
      // 创建下载链接
      const downloadLink = document.createElement('a')
      downloadLink.href = URL.createObjectURL(
        new Blob([fileResponse.data], { type: 'application/pdf' })
      )
      downloadLink.download = getFileName(downloadUrl)

      // 添加到文档中并触发点击
      document.body.appendChild(downloadLink)
      downloadLink.click()
      // 清理
      document.body.removeChild(downloadLink)
      URL.revokeObjectURL(downloadLink.href)
    } catch (error) {
      console.error('下载出错:', error)
    } finally {
      // 结束加载状态
      downloadLoading.value = false
    }
  }
}

const now = ref(dayjs().format('YYYY-MM-DD'))

const timer = setInterval(() => {
  now.value = dayjs().format('YYYY-MM-DD')
}, 60000)

const getFileName = (file: string) => {
  const fileKeyArr = file?.split('/')
  const str = fileKeyArr[fileKeyArr?.length - 1] || file
  return decodeURIComponent(str)
}
onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<style lang="scss" scoped>
header {
  height: 100%;
  /* padding: 0 16px; */
  padding: 0 16px 0 0;
}

.left {
  display: flex;
  .l-title {
    height: 100%;
    font-weight: 600;
    font-size: 20px;
    color: #000000;
    line-height: 20px;

    img {
      height: 28px;
    }
  }
}

.download-report-class {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 12px;
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #0082d6;
}

.download-report-img {
  width: 20px;
  height: 20px;
}

.download-report-text {
  font-weight: 400;
  font-size: 14px;
  color: #0082d6;
  line-height: 22px;
}

.username {
  font-weight: 600;
  font-size: 14px;
  color: #4b5468;
  line-height: 16px;
}

.user-trigger,
.user-menu-option {
  display: inline-flex;
  align-items: center;
}

.user-trigger {
  gap: 6px;
  padding: 5px 7px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: #4b5468;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  i {
    color: #6e7b91;
    font-size: 20px;
  }
  &:hover,
  &:focus-visible {
    background: #f5f7fa;
    color: #1d2635;
  }
  &:focus-visible {
    outline: 2px solid #8ab7f5;
    outline-offset: 2px;
  }
}

.user-trigger .user-trigger-arrow {
  font-size: 16px;
}

.user-menu-option {
  gap: 7px;
  min-width: 112px;
  color: #526075;
  i {
    font-size: 16px;
  }
}

.brand-wrapper {
  display: flex;
  align-items: center;
  .bw-item {
    padding: 20px;
    cursor: pointer;
    /* border-bottom: 3px solid transparent; */
    position: relative;
    &.active {
      background: linear-gradient(180deg, rgba(99, 0, 20, 0) 0%, rgba(#c90028, 0.1) 100%);
      /* border-bottom: 3px solid #c3002f; */
      font-weight: 600;
      color: #000;
      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 3px;
        background-color: #c3002f;
        bottom: 2px;
        left: 0;
        right: 0;
      }
    }
    .brand-name {
      min-height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #333;
      font-size: 16px;
    }
    .brand-logo {
      width: 150px;
      height: 40px;
      object-fit: contain;
    }
  }
}
</style>
