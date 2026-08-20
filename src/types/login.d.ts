declare namespace Login {
  interface LoginRes {
    access_token: string
    appId: string
    type: string
    userid: string
    username: string
  }

  interface LoginReq {
    username: string
    password: string
    checkKey: string
    captcha: string
  }
}
