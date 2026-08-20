/**
 * @description: 水印添加方法
 * @param {any} textList
 * @return {*}
 */
const _setWatermark = (textList: any[]) => {
  const id = '1.23452384164.123412415'

  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id)!)
  }

  const can = document.createElement('canvas')
  // 设置canvas画布大小
  can.width = 200
  can.height = 160

  const cans = can.getContext('2d')!
  cans.rotate((-20 * Math.PI) / 180) // 水印旋转角度
  cans.font = '16px Vedana'
  cans.fillStyle = '#000000'
  // cans.textAlign = 'center'
  cans.textAlign = 'left'
  cans.textBaseline = 'middle'
  cans.fillText(textList[0], 0, can.height / 3 + 15) // 水印在画布的位置x，y轴
  cans.font = '14px Vedana'
  cans.fillText(textList[1], 0, can.height / 3 + 38)
  cans.fillText(textList[2], 0, can.height / 3 + 61)
  cans.fillText(textList[3], 0, can.height / 3 + 84)

  const div = document.createElement('div')
  div.id = id
  div.style.pointerEvents = 'none'
  div.style.top = '20px'
  div.style.left = '30px'
  div.style.opacity = '0.09'
  div.style.position = 'fixed'
  div.style.zIndex = '100000'
  // div.style.width = document.documentElement.clientWidth + 'px'
  // div.style.width = 3000 + 'px'
  div.style.width = '100vw'
  // div.style.height = document.documentElement.clientHeight  + 'px'
  // div.style.height = 2000 + 'px'
  div.style.height = '100vh'
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
  document.body.appendChild(div)
  return id
}

/**
 * @description: 添加水印方法
 * @param {any} str1
 * @param {any} str2
 * @param {any} str3
 * @param {any} str4
 * @return {void}
 */
export const setWaterMark = (str1: any, str2: any, str3: any, str4: any) => {
  let id = _setWatermark([str1, str2, str3, str4])
  if (document.getElementById(id) === null) {
    id = _setWatermark([str1, str2, str3, str4])
  }
}

/**
 * @description: 移除水印方法
 * @return {void}
 */
export const removeWatermark = () => {
  const id = '1.23452384164.123412415'
  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id)!)
  }
}
