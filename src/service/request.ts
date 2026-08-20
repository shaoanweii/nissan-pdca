import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Message } from '@arco-design/web-vue'
import { resolveMockRequest } from './mock'
const instence = axios.create({
  baseURL: '/api',
  timeout: 6000 * 10
})

type Response<T = any> = {
  code: string
  message: string
  result: T
}

export default <T>(config: AxiosRequestConfig) => {
  return new Promise<Response<T>>((resolve, reject) => {
    resolveMockRequest<T>(config).then(mockResponse => {
      if (mockResponse) {
        resolve(mockResponse)
        return
      }

      instence
        .request<Response<T>>(config)
        .then((response: AxiosResponse<Response<T>>) => {
          // 文件流
          if (response.status === 200 && response.config.responseType === 'blob') {
            resolve(response as any)
          }
          const { code, message } = response.data
          if (code === '200') {
            resolve(response.data)
            // 登录失效处理
          } else if (
            [401, '401', '100041', '100000', '100008'].includes(code) ||
            message === '没有携带Token信息'
          ) {
            Message.error(message)
            reject(response.data)
          } else {
            // Message.error(message)
            reject(response.data)
            // resolve(response.data)
          }
        })
        .catch((error: any) => {
          console.log('error', error)
          Message.clear()
          // Message.error('服务异常！')
          reject(error)
        })
    })
  })
}
