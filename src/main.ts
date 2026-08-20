import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/stores'

// 相关样式引入
// import './style/global.scss'
// import './style/root.scss'
// import './style/mainTable.scss'
// import './style/layouts.scss'
// import '@/assets/iconfont/iconfont.css'
import '@/style/index.scss'
// 导入图标库
import 'remixicon/fonts/remixicon.css'
import './permission'

// 引入Message组件
import { Message } from '@arco-design/web-vue'
import directives from '@/directives'
import 'virtual:svg-icons-register'

import 'amfe-flexible'

const app = createApp(App)

app.config.globalProperties.$message = Message
app.use(directives)
app.use(store)
app.use(router)

app.mount('#app')
