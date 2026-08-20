import { useAppStoreWithOut } from '@/stores/modules/app'
import { useUserStoreWithOut } from '@/stores/modules/user'
import { Message } from '@arco-design/web-vue'
import html2canvas from 'html2canvas'

//补零
function fnAddZero(val: any) {
  if (val) {
    if (val - 10 < 0) {
      return '0' + val
    } else {
      return val + ''
    }
  } else {
    return '00'
  }
}

// 当前时间formatter
function fnGetDownloadTime() {
  const myDate = new Date() //实例一个时间对象；
  const month = fnAddZero(myDate.getMonth() + 1)
  const labelTime =
    myDate.getFullYear() +
    '' +
    month +
    fnAddZero(myDate.getDate()) +
    fnAddZero(myDate.getHours()) +
    fnAddZero(myDate.getMinutes()) +
    fnAddZero(myDate.getSeconds()) +
    '-'
  return labelTime
}

// function fnGetWaterText() {
//   const title = 'WEY customer Service Direct contact Center'
//   const user =
//     localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')!).workNo
//   const myDate = new Date() //实例一个时间对象；
//   const month = fnAddZero(myDate.getMonth() + 1)
//   const labelTime =
//     myDate.getFullYear() +
//     '-' +
//     month +
//     '-' +
//     fnAddZero(myDate.getDate()) +
//     ' ' +
//     fnAddZero(myDate.getHours()) +
//     ':' +
//     fnAddZero(myDate.getMinutes()) +
//     ':' +
//     fnAddZero(myDate.getSeconds())
//   return [title, user, labelTime, 'CONFIDENTIAL']
// }

//保存截图
export function fnSaveImg(el: any, name: any, callback: any) {
  const appStore = useAppStoreWithOut()
  const userStore = useUserStoreWithOut()

  const documentLeft = document.documentElement.scrollLeft
  const bodyLeft = document.body.scrollLeft
  document.documentElement.scrollLeft = 0
  document.body.scrollLeft = 0
  // const eleBounding = el.getBoundingClientRect()
  const width = el.offsetWidth
  const height = el.offsetHeight
  // let width = el.clientWidth
  // let height = el.clientHeight
  const scale = 1
  const canvas = document.createElement('canvas') as any
  canvas.width = width * scale
  canvas.height = height * scale

  // 设置willReadFrequently属性为true，以优化多次读取图像数据的性能
  const context = canvas.getContext('2d', { willReadFrequently: true })
  context?.scale(scale, scale)
  // context.translate(-eleBounding.left,-eleBounding.top)

  // console.log(width,height)
  // console.log(eleBounding.top,eleBounding.left)
  window.setTimeout(() => {
    html2canvas(el, {
      scale,
      canvas,
      height,
      width,
      y: 0,
      x: 0,
      // y: eleBounding.top,
      // x:eleBounding.left,
      useCORS: true,
      // foreignObjectRendering:true,
      // backgroundColor:'#fff',
      ignoreElements: ((ele: any) => {
        if (ele.classList.contains('ignore')) {
          return true
        }
      }) as any
    }).then(function (canvas: any) {
      if ((navigator as any).msSaveBlob) {
        const blob = canvas.msToBlob()
        const filename = fnGetDownloadTime() + name + '.png'
        return (navigator as any).msSaveBlob(blob, filename)
      }

      // 水印相关
      if (appStore.sysConfig.documentWatermarking) {
        const img = new Image()
        // 大画布
        const canvas1 = document.createElement('canvas') as any
        canvas1.width = `${canvas.width}` as any // 注意：没有单位
        canvas1.height = `${canvas.height}` as any // 注意：没有单位
        // 设置willReadFrequently属性为true，以优化多次读取图像数据的性能
        const ctx = canvas1.getContext('2d', { willReadFrequently: true }) as any
        if (img.complete) {
          img.src = canvas.toDataURL('image/png')
          img.onload = () => {
            ctx?.clearRect(0, 0, canvas.width, canvas.height)
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
            // 画个小水印
            const water = document.createElement('canvas') as any
            // 小水印画布大小
            water.width = 300
            water.height = 200
            const waterCtx = water.getContext('2d', { willReadFrequently: true }) as any
            waterCtx?.clearRect(0, 0, water.width, water.height)
            // 小水印中文字偏转角度
            waterCtx?.rotate((-20 * Math.PI) / 180)
            waterCtx.font = '12pt Vedana' // 水印文字添加
            waterCtx.fillStyle = 'rgba(149,155,170,0.2)'

            // const textList = fnGetWaterText()
            const textList = [
              userStore.userInfo.employeeId,
              userStore.userInfo.deptName,
              userStore.userInfo.username
            ]
            waterCtx.fillText(textList[0], 20, 110)
            waterCtx.fillText(textList[1], 20, 130)
            waterCtx.fillText(textList[2], 20, 150)
            // waterCtx.fillText(textList[3], 20, 170)
            // 铺上去
            const pat = ctx?.createPattern(water, 'repeat')
            ctx.fillStyle = pat
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            const url = canvas1.toDataURL('image/png')
            // 生成一个a元素
            const a = document.createElement('a')
            // 创建一个单击事件
            const event = new MouseEvent('click')
            // 设置图片名称
            a.download = fnGetDownloadTime() + name + '.png'
            // 将生成的URL设置为a.href属性
            a.href = url
            // 触发a的单击事件
            a.dispatchEvent(event)
          }
        }
      } else {
        const url = canvas.toDataURL('image/png')
        // 生成一个a元素
        const a = document.createElement('a')
        // 创建一个单击事件
        const event = new MouseEvent('click')
        // 设置图片名称
        a.download = fnGetDownloadTime() + name + '.png'
        // 将生成的URL设置为a.href属性
        a.href = url
        // 触发a的单击事件
        a.dispatchEvent(event)
      }
      if (callback) callback()
      window.setTimeout(() => {
        document.documentElement.scrollLeft = documentLeft
        document.body.scrollLeft = bodyLeft
      }, 200)
      Message.success('图片导出成功！如图片导出不全，请在全屏状态下重新导出或手动截屏！')
    })
  }, 400)
}
