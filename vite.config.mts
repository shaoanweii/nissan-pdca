import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { vitePluginForArco } from '@arco-plugins/vite-vue'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import vueDevTools from 'vite-plugin-vue-devtools'
// import { ArcoResolver } from 'unplugin-vue-components/resolvers'
// @ts-expect-error 消除错误提示
import eslintPlugin from 'vite-plugin-eslint'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import pxtorem from 'postcss-pxtorem'

const timestamp = new Date().getTime()
// https://vitejs.dev/config/
export default defineConfig({
  base: '/report/',
  build: {
    // 打包文件超过1M 警告提示
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // 入口文件名
        entryFileNames: `assets/[name].${timestamp}.js`,
        // 块文件名
        chunkFileNames: `assets/[name]-[hash].${timestamp}.js`,
        // 资源文件名 css 图片等等
        assetFileNames: `assets/[name]-[hash].${timestamp}.[ext]`,
        // 超过 chunkSizeWarningLimit值 分包
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      }
    }
  },
  plugins: [
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [
        // 这里分为了一般icon文件夹和文件图标类型文件夹，方便管理，可以按照需求设置更多分类
        path.resolve(__dirname, 'src/assets/svg')
      ],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]'
    }),
    vue(),
    vueJsx(),
    // vuet调试工具
    // vueDevTools(),
    AutoImport({
      imports: ['vue'],
      dts: 'src/types/auto-import.d.ts'
    }),
    Components({
      // 指定自动导入组件位置，默认是src/components
      // dirs: ['src/components'],
      // 解决命名冲突
      directoryAsNamespace: true
    }),
    vitePluginForArco({
      style: 'css'
    }),
    eslintPlugin({
      cache: false,
      include: [
        'src/**/*.ts',
        'src/**/*.tsx',
        'src/**/*.js',
        'src/**/*.vue',
        'src/*.ts',
        'src/*.tsx',
        'src/*.js',
        'src/*.vue'
      ]
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // 全局引入scss变量
        additionalData: `@import "@/style/variables.scss";`,
        javascriptEnabled: true
      }
    },
    postcss: {
      plugins: [
        pxtorem({
          rootValue: 192, //设计图宽度/10
          unitPrecision: 5, //允许REM单位增长到的十进制数字。
          propList: ['*'],
          //propWhiteList: [],  //默认值是一个空数组，这意味着禁用白名单并启用所有属性。
          // propBlackList: [], //黑名单
          // exclude: /\/node_modules\//i, //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)/ 。如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
          selectorBlackList: ['.acro', '.ri'], //要忽略并保留为px的选择器
          // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
          // mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
          minPixelValue: 0 //设置要替换的最小像素值(3px会被转rem)。 默认 0
        })
      ]
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '^/api': {
        // target: 'http://172.16.80.16:30705/', //dev
        target: 'http://172.16.80.16:30805/', //test
        // target: 'http://172.16.8.132:80/', // 范荣
        // target: 'http://192.168.7.56:8088/', // 范荣 本机 192.168.7.56
        // target: 'http://172.16.8.173:8060/', // 刘鸿兵
        // target: 'http://192.168.180.13:8060/', //雷文武
        changeOrigin: true
      }
    }
  }
})
