<template>
  <div class="login-wrapper">
    <div class="big-title">
      <div class="bt-l1">
        <div class="t1">VOC</div>
        <div class="t2">数智平台</div>
      </div>
      <div class="bt-l2">东风日产数据服务有限公司</div>
    </div>
    <a-card class="login-card" :body-style="{ padding: '48px 48px 77px' }">
      <h3 class="lc-title">欢迎登录</h3>
      <h2 class="lc-subtitle">东风日产VOC数智平台</h2>
      <a-form
        class="form"
        :model="form"
        size="large"
        :label-col-props="{ span: 0, offset: 0 }"
        :wrapper-col-props="{ span: 24, offset: 0 }"
      >
        <a-form-item>
          <a-input
            :data-testid="`login-1001`"
            placeholder="账号"
            v-model.trim="form.username"
            autocomplete="username"
            clearable
          />
        </a-form-item>
        <a-form-item>
          <a-input-password
            :data-testid="`login-1002`"
            placeholder="密码"
            v-model.trim="form.password"
            autocomplete="current-password"
            clearable
          />
        </a-form-item>
        <a-form-item>
          <div class="code-box flex">
            <a-input
              :data-testid="`login-1003`"
              placeholder="请输入验证码"
              v-model.trim="form.captcha"
              clearable
              style="flex: 1"
              @keyup.enter="doLogin"
            />
            <div class="img-box" :title="'点击刷新'" :data-testid="`login-1005`" @click="getCode">
              <img :src="state.codeSrc" alt="" />
            </div>
          </div>
        </a-form-item>
        <a-form-item>
          <div :data-testid="`login-1004`" class="btn" style="width: 100%" @click="doLogin">
            登 录
          </div>
        </a-form-item>
      </a-form>

      <div class="copy-right">@2024 东风日产数据服务有限公司</div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { getRandomImage } from '@/service/login'
import useUserStore from '@/stores/modules/user'

const message = getCurrentInstance()?.appContext.config.globalProperties.$message

const userStore = useUserStore()
const state = reactive({
  loading: false,
  codeSrc: '',
  timeKey: ''
})
onMounted(() => {
  getCode()
})

const form = reactive({
  username: '',
  password: '',
  // "appId": "insights",
  // "type": "base",
  checkKey: '',
  captcha: ''
})

let router = useRouter()

const doLogin = async () => {
  form.checkKey = state.timeKey
  userStore
    .login(form)
    .then(() => {
      // router.push('/dataCenter/processing');
      // router.push('/')
      setTimeout(() => {
        router.push(userStore.homePath)
      }, 500)
    })
    .catch((err: any) => {
      state.loading = false
      message?.clear()
      message?.error(err.message || '登录失败，请重试！')
      console.log(err)
      getCode()
    })
}

//获取验证码
const getCode = () => {
  let timeKey = new Date().getTime()
  state.timeKey = timeKey.toString()

  getRandomImage(timeKey).then(res => {
    state.codeSrc = res.result
  })
}
</script>

<style lang="scss" scoped>
.login-wrapper {
  height: 100vh;
  /* background: url(@/assets/bg/login.png); */
  background: url(@/assets/bg/login_bg.png);
  background-size: 100% auto;
  position: relative;

  .logo {
    position: absolute;
    top: 0px;
    left: 50px;
    height: 160px;
  }

  .big-title {
    position: absolute;
    top: 291px;
    left: 140px;
    .bt-l1 {
      display: flex;
      align-items: center;
      .t1 {
        font-weight: 600;
        font-size: 112px;
        line-height: 131px;

        /* 设置渐变背景 */
        background-image: linear-gradient(180deg, #2babee 0%, #1668ff 100%);
        /* 将背景裁剪到文字区域 */
        -webkit-background-clip: text;
        background-clip: text;
        /* 将文字填充颜色设置为透明 */
        -webkit-text-fill-color: transparent;
        text-fill-color: transparent;
      }
      .t2 {
        font-weight: 600;
        font-size: 85px;
        line-height: 100px;

        /* 设置渐变背景 */
        background-image: linear-gradient(180deg, #0659db 0%, #117fe7 100%);
        /* 将背景裁剪到文字区域 */
        -webkit-background-clip: text;
        background-clip: text;
        /* 将文字填充颜色设置为透明 */
        -webkit-text-fill-color: transparent;
        text-fill-color: transparent;
        margin-left: 9px;
      }
    }
    .bt-l2 {
      font-size: 40px;
      color: #000000;
      line-height: 47px;
      margin-top: 18px;
      padding-left: 24px;
    }
  }

  .login-card {
    width: 40vw;
    height: 100vh;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    .lc-title {
      font-weight: 500;
      font-size: 48px;
      color: #000000;
      line-height: 56px;
      letter-spacing: 3px;
      text-align: center;
      margin-top: 173px;
    }
    .lc-subtitle {
      font-size: 40px;
      color: #000000;
      line-height: 47px;
      letter-spacing: 3px;
      margin-top: 20px;
      text-align: center;
    }

    .code-box {
      width: 100%;
      justify-content: space-between;
    }

    .img-box {
      width: 144px;
      margin-left: 12px;
      // border-radius: 4px;
      background-color: #f2f3f7;
      display: flex;
      align-items: center;
      cursor: pointer;

      img {
        width: 100%;
      }
    }

    .form {
      margin: 40px auto 0;
      width: 530px;
      font-size: 18px;

      :deep(.arco-input-wrapper) {
        .arco-input {
          height: 46px;
          box-sizing: border-box;
          font-size: 18px;

          &:-webkit-autofill {
            -webkit-text-fill-color: #000 !important; /*记住密码的字的颜色*/
            transition: background-color 5000s ease-in-out 0s; /*延时渲染背景色来去除背景色*/
            //caret-color: #acfff2;/*光标颜色*/
          }
        }
      }

      :deep(.arco-form-item) {
        margin-bottom: 12px;
      }
    }

    .btn {
      background-color: #165dff;
      border-radius: 4px;
      padding: 14px;
      text-align: center;
      color: #fff;
      margin-top: 36px;
      font-size: 18px;
    }
  }

  .copy-right {
    width: 100%;
    position: absolute;
    bottom: 42px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 16px;
    color: #000000;
    line-height: 19px;
    opacity: 0.8;
  }
}
</style>
