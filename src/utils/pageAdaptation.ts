/**
 * @description: 页面适配(scale 缩放实现)
 * @return {*}
 */
export const selfAdaption = () => {
  // const body = document.querySelector('body')
  const body = document.querySelector<HTMLElement>('#app')
  const defWidth = 1920
  const defHeight = 1080
  // const windowHeight = document.documentElement.clientHeight
  // const windowWidth = document.documentElement.clientWidth
  const windowHeight = window.innerHeight
  const windowWidth = window.innerWidth
  const _heightScale = windowHeight / defHeight
  const heightScale = _heightScale > 1 ? _heightScale : 1
  const widthScale = windowWidth / defWidth

  // body?.style.setProperty('transform', `scale(${widthScale},${heightScale})`)
  // body?.style.setProperty('-ms-transform', `scale(${widthScale},${heightScale})`)
  // body?.style.setProperty('-webkit-transform', `scale(${widthScale},${heightScale})`)
  body?.style.setProperty('transform', `scaleX(${widthScale})`)
  body?.style.setProperty('-ms-transform', `scaleX(${widthScale}`)
  body?.style.setProperty('-webkit-transform', `scaleX(${widthScale})`)
  body?.style.setProperty('width', `${defWidth}px`)
  // body?.style.setProperty('height', `${defHeight}px`)
  body?.style.setProperty('height', `100vh`)

  window.onresize = () => {
    //屏幕尺寸改变时触发
    // const windowHeight = document.documentElement.clientHeight
    // const windowWidth = document.documentElement.clientWidth
    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth
    const _heightScale = windowHeight / defHeight
    const heightScale = _heightScale > 1 ? _heightScale : 1
    const widthScale = windowWidth / defWidth
    body?.style.setProperty('width', `${defWidth}px`)
    // body?.style.setProperty('height', `${defHeight}px`)
    body?.style.setProperty('height', `100vh`)
    // body?.style.setProperty('transform', `scale(${widthScale},${heightScale})`)
    // body?.style.setProperty('-ms-transform', `scale(${widthScale},${heightScale})`)
    // body?.style.setProperty('-webkit-transform', `scale(${widthScale},${heightScale})`)
    body?.style.setProperty('transform', `scaleX(${widthScale})`)
    body?.style.setProperty('-ms-transform', `scaleX(${widthScale}`)
    body?.style.setProperty('-webkit-transform', `scaleX(${widthScale})`)
  }
}
