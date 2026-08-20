import mitt from 'mitt'

/**
 * 触发事件 eventBus.emit(eventName)
 * 监听事件 eventBus.on(eventName, () => void)
 */
const eventBus = mitt()

export function safeOn(eventName: string, callback: any) {
  // console.log('eventName', eventName)
  // console.log('callback', callback)

  const existingCallbacks = eventBus.all.get(eventName)
  // console.log('existingCallbacks', existingCallbacks)
  // console.log('existingCallbacks.includes(callback)', existingCallbacks?.includes(callback))

  if (!existingCallbacks || !existingCallbacks.includes(callback)) {
    eventBus.on(eventName, callback)
  }
}

// 用于监听、触发事件
export default eventBus
