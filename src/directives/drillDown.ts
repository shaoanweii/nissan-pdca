import { hasDrillDownPermission } from '@/utils/permission'

//下钻指令
const drillDownDirective = {
  mounted(el: HTMLElement, binding: any) {
    applyPermission(el, binding.value)
  },
  // 添加 updated 钩子，支持权限变化
  updated(el: HTMLElement, binding: any) {
    applyPermission(el, binding.value)
  }
}

// 抽取权限应用逻辑到独立函数
function applyPermission(el: HTMLElement, code: string) {
  const isHasPermission = hasDrillDownPermission(code)
  // 移除之前可能绑定的点击阻止事件
  el.removeEventListener('click', preventDefault, true)
  if (!isHasPermission) {
    //有权限保持原样，没有权限则移除样式并阻止点击事件
    // 去掉可点击样式
    el.classList.remove('point')
    el.style.cursor = 'default'
    // 不再使用 pointerEvents = 'none'，而是添加事件监听器阻止点击
    el.addEventListener('click', preventDefault, true)
  } else {
    // 有权限时确保样式正确
    el.classList.add('point')
    el.style.cursor = 'pointer'
  }
}

// 阻止点击事件的处理函数
function preventDefault(e: Event) {
  e.stopPropagation()
  e.preventDefault()
}

export default drillDownDirective
