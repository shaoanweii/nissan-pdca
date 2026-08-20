/**
 * @description: 将style中的px转成rem
 * @param {string} px
 * @return {*}
 */
export const px2rem = (px: string) => {
  if (/%/gi.test(px)) {
    // 有百分号%，特殊处理，表述pc是一个有百分号的数，比如：90%
    return px
  } else {
    return parseFloat(px) / 192 + 'rem' // 这里的37.5，和rootValue值对应
  }
}

/**
 * @description: 将图表中高度相关的数字转成rem同比例缩放
 * @param {number} px
 * @return {*}
 */
export const value2rem = (value: number) => {
  const rootSizeStr = (document.querySelector('Html') as HTMLElement)?.style?.fontSize
  const rootSize = rootSizeStr.replace('px', '')
  const r = (value / 192).toFixed(5)
  return Number(rootSize) * Number(r)
}
