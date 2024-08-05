import request from '.'
import { LoginInfo, UserInfo } from './typing'

export const loginRequest = (value: Record<'account' | 'password', string>) => {
  return request.request<LoginInfo>({
    url: '/admin-api/system/user/doLogin',
    method: 'post',
    data: {
      username: value.account,
      password: value.password
    }
  })
}

export const userInfoRequest = () => {
  return request.request<UserInfo>({
    url: '/admin-api/system/user/user-info'
  })
}
