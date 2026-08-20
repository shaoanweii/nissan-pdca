import request from './request'

/**
 * 登录
 * @param data
 */
export const login = (data: Login.LoginReq) => {
  return request<Login.LoginRes>({
    url: '/report/base/login',
    method: 'POST',
    data
  })
}

/**
 * 登出
 */
export const logout = () => {
  return request<any>({
    url: '/report/logout',
    method: 'POST'
  })
}

/**
 * 获取验证码
 * @param param
 */
export const getRandomImage = (param: number) => {
  return request<string>({
    url: '/auth/randomImage/' + param,
    method: 'GET'
  })
}
