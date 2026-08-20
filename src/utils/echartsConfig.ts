import { emitionBase64Map, emitionColorMap, riskColorMap, RY_MAX_STR } from '@/constant'
import { formatToTwoDecimal } from '.'
import { px2rem } from './rem'

const transitionNum = (num: any) => {
  let numStr: any = num
  let _num: any = num
  if (num === undefined || num === null) {
    numStr = '-'
  }
  if (Number(num) >= 999.99) {
    // numStr = RY_MAX_STR
    // numStr = 999.99
    numStr = '-'
    _num = 999.99
  }
  if (Number(num) < -999.99) {
    // numStr = -999.99
    numStr = '-'
    _num = -999.99
  }
  if (typeof numStr === 'number') {
    numStr = Math.abs(_num)?.toFixed(2) + '%'
  }
  // const _num = Number(Number(num || 0).toFixed(2))
  return {
    // numStr: _num >= 9999 ? '新发' : Math.abs(_num) + '%',
    numStr: numStr,
    num: _num
  }
}

// 文字根据状态展示不同样式
const textByState = (num: string | number | undefined | null) => {
  const _numObj = transitionNum(num)
  let getClass
  if (_numObj.numStr === RY_MAX_STR || _numObj.num > 0) {
    // getClass = 'color-d92d3c'
    // getClass = 'color-009949'
    // getClass = 'color-999'
    getClass = 'color-666'
  }
  if (_numObj.num > 0) {
    // getClass = 'color-d92d3c'
    // getClass = 'color-009949'
    // getClass = 'color-999'
    getClass = 'color-666'
  }
  if (_numObj.num < 0) {
    // getClass = 'color-009949'
    // getClass = 'color-d92d3c'
    // getClass = 'color-999'
    getClass = 'color-666'
  }
  if (_numObj.num === 0) {
    // getClass = 'color-999'
    getClass = 'color-666'
  }

  /**
   * ri-arrow-up-long-line
   * ri-arrow-down-long-line
   *
   * ri-arrow-down-s-fill
   * ri-arrow-up-s-fill
   */

  let icon = `<i class="${
    _numObj.num > 0 ? 'ri-arrow-up-long-line' : 'ri-arrow-down-long-line'
  } font-16"></i>`
  if (
    !_numObj.num ||
    _numObj.num === 0 ||
    _numObj.numStr === RY_MAX_STR ||
    _numObj.numStr === '-'
  ) {
    icon = '<span class="pl-16"></span>'
  }
  return `
    <span class="${getClass} flex-align-center justify-end">
      <span class="font-12">${_numObj.numStr}</span>
      ${icon}
    </span>
  `
}
// 线条穿过圆的图标
const roundInLineIcon = (color: string) => {
  return `
      <div style="position: relative; width: 18px; height: 18px;">
        <div style="width: 18px; height: 1px; background: ${color}; position: absolute;top: 50%;transform: translateY(-50%);"></div>
        <div style="width: 8px; height: 8px; background: #FFFFFF; border: 2px solid ${color}; position: absolute; top: 50%;left: 50%;transform: translate(-50%, -50%); border-radius: 50%;"></div>
      </div>
      `
}

// 方块
const blockIcon = (color: string) => {
  return `
    <div class="mr-4" style="width: ${px2rem('14px')};height: ${px2rem(
    '14px'
  )}; background-color: ${color};"></div>
  `
}

// 指数icon
const emitionStr = (str: string, g: string = '1') => {
  if (str === null || str === undefined) {
    return '-'
  }
  const icon = emitionBase64Map[g]
  const eColor = emitionColorMap[g]
  return `
    <div class="flex-1 flex-xy-center ellipsis-single-line">
      ${
        icon
          ? `<img src="${icon}" style="width: ${px2rem('16px')}; height: ${px2rem('16px')};" />`
          : ''
      }
      <span class="${eColor} ml-4">${formatToTwoDecimal(str) ?? '-'}</span>
    </div>
  `
}

/**
 * echarts tooltip
 * @param params
 * @returns
 */
export const defTooltip = (type: string, params: any, other?: any) => {
  if (['bar', 'pie'].includes(type)) {
    return toolTipByBarAndPie(type, params)
  } else if (['line'].includes(type)) {
    return toolTipByLine(params)
  } else if (['map'].includes(type)) {
    return toolTipByBMap(params)
  } else if (['line-1'].includes(type)) {
    return toolTipByLine1(params)
  } else if (['pie-1'].includes(type)) {
    return toolTipByPie1(params, other)
  } else if (['line-2'].includes(type)) {
    return toolTipByLine2(params, other)
  }
}
const toolTipByBMap = (params: any) => {
  // const icon = emitionBase64Map[params?.data?.nsrG]
  // const eColor = emitionColorMap[params?.data?.nsrG]

  // ${icon ? `<img src="${icon}" style="width: 16px; height: 16px;" />` : ''}
  // <span class="${eColor} ml-4">${params?.data?.nsrC || '-'}</span>
  return `
        <div class="radius-4 py-14 px-20 bg-white border-def" style="width: ${px2rem(
          '277px'
        )};height: ${px2rem('132px')}; box-shadow: 0px ${px2rem('24px')} ${px2rem(
    '24px'
  )} 0px rgba(0,0,0,0.04);">
          <div class="flex-align-center">
          ${
            params.color
              ? `<div style="width: 14px;height: 14px; border-radius: 50%; background-color: ${params.color}"></div>`
              : ''
          }
            
            <span class="color-999 font-14 lh-20 ml-5">${params.data?.area || ''}</span>
          </div>
          <div class="flex-align-center py-6 bgc-def font-14 lh-20 color-26292e mt-9 border-radius4400">
            <div class="flex-1 text-align-center">体验指数</div>
            <div class="flex-1 text-align-right"><span class="pr-16">环比</span></div>
            <div class="flex-1 text-align-right"><span class="pr-16">同比</span></div>
          </div>
          <div class="flex-align-center py-6 font-14 lh-20 color-26292e mt-11">
            <div class="flex-1 flex-xy-center ellipsis-single-line">
              ${emitionStr(params?.data?.nsrC, params?.data?.nsrG)}
            </div>
            
            <div class="flex-1 text-align-right ellipsis-single-line">${textByState(
              params.data?.nsrRp
            )}</div>
            <div class="flex-1 text-align-right ellipsis-single-line">${textByState(
              params.data?.nsrYp
            )}</div>
          </div>
        </div>
        `
}

const toolTipByBarAndPie = (type: string, params: any) => {
  const typeMap: any = {
    common: `width: 14px;height: 14px;`,
    pie: `border-radius: 50%; border: 4px solid ${params.color};`,
    bar: `background: ${params.color}`
  }
  const percentMap: any = {
    pie: params.percent,
    bar: params.data.tagP || '-'
  }
  const percentHeadStrMap: any = {
    pie: `<div class="flex-1 text-align-center">占比</div>`,
    bar: ''
  }
  const percentBodyStrMap: any = {
    pie: `<div class="flex-1 text-align-center ellipsis-single-line">${percentMap[type]}%</div>`,
    bar: ''
  }

  const widthMap: any = {
    pie: px2rem('326px'),
    bar: px2rem('277px')
  }
  return `
        <div class="radius-4 py-14 px-20 bg-white border-def" style="width: ${
          widthMap[type]
        };height: ${px2rem('132px')}; box-shadow: 0px 24px 24px 0px rgba(0,0,0,0.04);">
          <div class="flex-align-center">
            <div style="${typeMap.common} ${typeMap[type]}"></div>
            <span class="color-999 font-14 lh-20 ml-5">${params.name}</span>
          </div>
          <div class="flex-align-center py-6 bgc-def font-14 lh-20 color-26292e mt-9 border-radius4400">
            <div class="flex-1 text-align-center">观点数</div>
            ${percentHeadStrMap[type]}
            <div class="flex-1 text-align-right"><span class="pr-16">环比</span></div>
            <div class="flex-1 text-align-right"><span class="pr-16">同比</span></div>
          </div>
          <div class="flex-align-center py-6 font-14 lh-20 color-26292e mt-11">
            <div class="flex-1 text-align-center ellipsis-single-line">${params.value}</div>
            ${percentBodyStrMap[type]}
            <div class="flex-1 text-align-right ellipsis-single-line">${textByState(
              params.data.tagRp
            )}</div>
            <div class="flex-1 text-align-right ellipsis-single-line">${textByState(
              params.data.tagYp
            )}</div>
          </div>
        </div>
        `
}

const toolTipByPie1 = (params: any, other?: any) => {
  return `
        <div class="radius-4 py-14 px-20 bg-white border-def" style="width: ${px2rem(
          '326px'
        )};height: ${px2rem('132px')}; box-shadow: 0px 24px 24px 0px rgba(0,0,0,0.04);">
          <div class="flex-align-center">
            <div style="width: 14px;height: 14px; border-radius: 50%; border: 4px solid ${
              params.color
            };"></div>
            <span class="color-999 font-14 lh-20 ml-5">${params.name}</span>
          </div>
          <div class="flex-align-center py-6 bgc-def font-14 lh-20 color-26292e mt-9" style="border-radius: 4px 4px 0px 0px;">
            <div class="flex-1 text-align-center">${other?.t1Label || '问题数'}</div>
            <div class="flex-1 text-align-center">占比</div>
            <div class="flex-1 text-align-right"><span class="pr-16">环比</span></div>
            <div class="flex-1 text-align-right"><span class="pr-16">同比</span></div>
          </div>
          <div class="flex-align-center py-6 font-14 lh-20 color-26292e mt-11">
            <div class="flex-1 text-align-center ellipsis-single-line">${params.value}</div>
            <div class="flex-1 text-align-center ellipsis-single-line">${params.percent}%</div>
            <div class="flex-1 text-align-right ellipsis-single-line">${textByState(
              params.data?.nsrRp
            )}</div>
            <div class="flex-1 text-align-right ellipsis-single-line">${textByState(
              params.data?.nsrYp
            )}</div>
          </div>
        </div>
        `
}
const toolTipByLine1 = (params: any) => {
  return `
        <div class="radius-4 py-12 px-20 bg-white border-def" style="width: ${px2rem(
          '310px'
        )};height: ${px2rem('131px')}; box-shadow: 0px 24px 24px 0px rgba(0,0,0,0.04);">
          <div class="flex-align-center">
            <span class="color-999 font-14 lh-20 ml-5">${params[0]?.axisValue}</span>
          </div>
          <div class="flex-align-center py-6 bgc-def font-14 lh-20 color-26292e mt-9  mb-6" style="border-radius: 4px 4px 0px 0px;">
            <div class="flex-2 text-align-center">名称</div>
             <div class="flex-1 text-align-center">等级</div>
           <div class="flex-1 text-align-center">数值</div>
            <div class="flex-2 text-align-right"><span class="pr-16">环比</span></div>
           
          </div>
          ${params
            .map((el: any) => {
              return `
            <div class="flex-align-center py-6 font-12 color-26292e">
              <div class="flex-2 text-align-center flex-xy-center ellipsis-single-line">
                <div style="position: relative; width: 18px; height: 18px;">
                  <div style="width: 18px; height: 1px; background: ${
                    el.color
                  }; position: absolute;top: 50%;transform: translateY(-50%);"></div>
                  <div style="width: 8px; height: 8px; background: #FFFFFF; border: 2px solid ${
                    el.color
                  }; position: absolute; top: 50%;left: 50%;transform: translate(-50%, -50%); border-radius: 50%;"></div>
                </div>
                <div class="ml-5">${el.seriesName}</div>
              </div>
              <div class="flex-1 text-align-center ellipsis-single-line ${
                riskColorMap[el.data?.riskLevelS]
              }">${el.data?.riskLevelS}</div>
              <div class="flex-1 text-align-center ellipsis-single-line ${
                riskColorMap[el.data?.riskLevelS]
              }">${el.value}</div>
              <div class="flex-2 text-align-right ellipsis-single-line">${textByState(
                el.data.rp
              )}</div>
            </div>
              `
            })
            .join('')}
        </div>
        `
}
const toolTipByLine = (params: any) => {
  // let axisValue = ''
  // if (params?.length !== 0) {
  //   axisValue = params[0].axisValue
  // }
  // height: 195px;
  return `
        <div class="radius-4 py-12 px-20 bg-white border-def" style="width: ${px2rem(
          '359px'
        )}; box-shadow: 0px 24px 24px 0px rgba(0,0,0,0.04);">
          <div class="flex-align-center">
            <span class="color-999 font-14 lh-20 ml-5">${params[0]?.axisValue}</span>
          </div>
          <div class="flex-align-center py-6 bgc-def font-14 lh-20 color-26292e mt-9  mb-6" style="border-radius: 4px 4px 0px 0px;">
            <div class="flex-1 text-align-center">名称</div>
           <div class="flex-1 text-align-center">数值</div>
            <div class="flex-1 text-align-right"><span class="pr-16">环比</span></div>
            <div class="flex-1 text-align-right"><span class="pr-16">同比</span></div>
          </div>
          ${params
            .map((el: any) => {
              return `
            <div class="flex-align-center py-6 font-12 color-26292e">
              <div class="flex-1 text-align-center flex-xy-center ellipsis-single-line">
                <div style="position: relative; width: 18px; height: 18px;">
                  <div style="width: 18px; height: 1px; background: ${
                    el.color
                  }; position: absolute;top: 50%;transform: translateY(-50%);"></div>
                  <div style="width: 8px; height: 8px; background: #FFFFFF; border: 2px solid ${
                    el.color
                  }; position: absolute; top: 50%;left: 50%;transform: translate(-50%, -50%); border-radius: 50%;"></div>
                </div>
                <div class="ml-5">${el.name}</div>
              </div>
              <div class="flex-1 text-align-center ellipsis-single-line">${
                el.data.g ? emitionStr(el.value, el.data.g) : el.value ?? '-'
              }</div>
              <div class="flex-1 text-align-right ellipsis-single-line">${textByState(
                el.data.rp
              )}</div>
              <div class="flex-1 text-align-right ellipsis-single-line">${textByState(
                el.data.yp
              )}</div>
            </div>
              `
            })
            .join('')}
        </div>
        `
}

const toolTipByLine2 = (params: any, other?: any) => {
  return `
        <div class="radius-4 py-12 px-20 bg-white border-def" style="width: ${px2rem(
          '359px'
        )}; box-shadow: 0px 24px 24px 0px rgba(0,0,0,0.04);">
          <div class="flex-align-center">
            <span class="color-999 font-14 lh-20 ml-5">${params[0]?.axisValue}</span>
          </div>
          <div class="flex-align-center py-6 bgc-def font-14 lh-20 color-26292e mt-9  mb-6" style="border-radius: 4px 4px 0px 0px;">
            <div class="flex-2 text-align-center">${other?.t1Label ? other.t1Label : '名称'}</div>
           <div class="flex-1 text-align-center">${other?.t2Label ? other.t2Label : '数值'}</div>
            <div class="flex-1 text-align-right"><span class="pr-16">环比</span></div>
            <div class="flex-1 text-align-right"><span class="pr-16">同比</span></div>
          </div>
          ${params
            .map((el: any) => {
              return `
            <div class="flex-align-center py-6 font-12 color-26292e">
              <div class="flex-2 text-align-center flex-xy-center ellipsis-single-line">
                ${el.color ? roundInLineIcon(el.color) : ''}
                <div class="ml-5">${el.name}</div>
              </div>
              <div class="flex-1 text-align-center ellipsis-single-line">
              ${el.g ? emitionStr(el.value, el.g) : el.value ?? '-'}
              </div>
              <div class="flex-1 text-align-right">${textByState(el.data.rp)}</div>
              <div class="flex-1 text-align-right">${textByState(el.data.yp)}</div>
            </div>
              `
            })
            .join('')}
        </div>
        `
}

export const toolTipByTreemap = (params: any) => {
  return `
        <div class="radius-4 py-14 px-20 bg-white border-def" style="width: ${px2rem(
          '271px'
        )}; box-shadow: 0px 24px 24px 0px rgba(0,0,0,0.04);">
          <div class="flex-align-center">
            ${blockIcon(params.color)}
            <span class="color-999 font-14 lh-20">${params?.name || ''}</span>
          </div>
          <div class="flex-align-center py-6 bgc-def font-14 lh-20 color-26292e mt-9" style="border-radius: 4px 4px 0px 0px;">
            <div class="flex-1 text-align-center">单据数</div>
            <div class="flex-1 text-align-center">占比</div>
            <div class="flex-1 text-align-right"><span class="pr-16">环比</span></div>
          </div>
          <div class="flex-align-center py-6 font-14 lh-20 color-26292e mt-11">
            <div class="flex-1 flex-xy-center ellipsis-single-line">
              ${params?.value}
            </div>
            
            <div class="flex-1 text-align-center ellipsis-single-line">${params.cp}%</div>
            <div class="flex-1 text-align-right ellipsis-single-line">${textByState(
              params?.rp
            )}</div>
          </div>
        </div>
        `
}

export const toolTipByTag = (params: any, other?: any): string => {
  return `
        <div class="radius-4 py-14 px-20 bg-white border-def" style="width: ${px2rem(
          '326px'
        )};height: ${px2rem('132px')}; box-shadow: 0px 24px 24px 0px rgba(0,0,0,0.04);">
          <div class="flex-align-center">
            ${params.icon ? blockIcon(params.color) : ''}
            <span class="color-999 font-14 lh-20">${params?.name}</span>
          </div>
          <div class="flex-align-center py-6 bgc-def font-14 lh-20 color-26292e mt-9" style="border-radius: 4px 4px 0px 0px;">
            <div class="flex-1 text-align-center">${other?.t1Label || '体验指数'}</div>
            <div class="flex-1 text-align-right"><span class="pr-16">环比</span></div>
            <div class="flex-1 text-align-right"><span class="pr-16">同比</span></div>
          </div>
          <div class="flex-align-center py-6 font-14 lh-20 color-26292e mt-11">
            <div class="flex-1 flex-xy-center ellipsis-single-line">
              ${params?.nsrG ? emitionStr(params?.nsrC, params?.nsrG) : params?.nsrC ?? '-'}
            </div>
            <div class="flex-1 text-align-right ellipsis-single-line">${textByState(
              params?.nsrR
            )}</div>
            <div class="flex-1 text-align-right ellipsis-single-line">${textByState(
              params?.nsrY
            )}</div>
          </div>
        </div>
        `
}

export const toolTipByStatistics = (params: any) => {
  return `
        <div class="radius-4 py-14 px-20 bg-white border-def" style="width: ${px2rem(
          '326px'
        )};height: ${px2rem('132px')}; box-shadow: 0px 24px 24px 0px rgba(0,0,0,0.04);">
          <div class="flex-align-center">
            ${params.icon ? blockIcon(params.color) : ''}
            <span class="color-999 font-14 lh-20">${params?.name}</span>
          </div>
          <div class="flex-align-center py-6 bgc-def font-14 lh-20 color-26292e mt-9" style="border-radius: 4px 4px 0px 0px;">
            <div class="flex-1 text-align-center">观点数</div>
            <div class="flex-1 text-align-center">占比</div>
            <div class="flex-1 text-align-right"><span class="pr-16">环比</span></div>
            <div class="flex-1 text-align-right"><span class="pr-16">同比</span></div>
          </div>
          <div class="flex-align-center py-6 font-14 lh-20 color-26292e mt-11">
            <div class="flex-1 flex-xy-center ellipsis-single-line">
              ${params?.nsrG ? emitionStr(params?.nsrC, params?.nsrG) : params?.nsrC}
            </div>
             <div class="flex-1 flex-xy-center ellipsis-single-line">
              ${params?.p ? `${params?.p}%` : '-'}
            </div>
            <div class="flex-1 text-align-right ellipsis-single-line">${textByState(
              params?.nsrR
            )}</div>
            <div class="flex-1 text-align-right ellipsis-single-line">${textByState(
              params?.nsrY
            )}</div>
          </div>
        </div>
        `
}

/**
 * @description: echarts弹窗位置
 * @param {any} point
 * @param {any} params
 * @param {any} dom
 * @param {any} rect
 * @param {any} size
 * @return {*}
 */
export const toolTipPosition = (point: any, params: any, dom: any, rect: any, size: any) => {
  // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
  // var obj = { top: 60 }
  // obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5
  // return [point[0] + 10, point[1] + 10]

  let x = 0 // x坐标位置
  let y = 0 // y坐标位置
  // 当前鼠标位置
  const pointX = point[0]
  const pointY = point[1]
  // 提示框大小
  const boxWidth = size.contentSize[0]
  const boxHeight = size.contentSize[1]

  // boxWidth > pointX 说明鼠标左边放不下提示框
  if (boxWidth > pointX) {
    x = pointX + 10
  } else {
    // 左边放的下
    x = pointX - boxWidth - 10
  }

  // boxHeight > pointY 说明鼠标上边放不下提示框
  if (boxHeight > pointY) {
    y = 5
  } else {
    // 上边放得下
    y = pointY - boxHeight
  }
  return [x, y]
}
