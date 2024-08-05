export enum ErrorCode {
  未登录 = 401
}

export interface Response<T> {
  code: number
  msg: string
  data: T
}

export type LoginInfo = Response<{
  userId: number
  accessToken: string
  expiresIn: number
}>

export type UserInfo = Response<{
  userId: number
  userType: number
  nickname: string
  status: number
  userInfo: {
    createTime: number
    updateTime: number
    creator: string
    updater: null
    deleted: boolean
    tenantId: string
    id: number
    username: string
    nickname: string
    remark: string
    deptId: number
    postIds: Array<number>
    email: null
    mobile: null
    sex: number
    avatar: null
    status: number
    loginIp: string
    loginDate: number
  }
  tenantId: string
}>

export type PageParams = {
  pageNo: number
  pageSize: number
}

export type ParamsStoreList = PageParams & {
  code?: string
  name?: string
}

export type ReturnStoreList = Response<{
  id: number
  code: string
  name: string
  phone: string
  tel: string
  openTime: string
  address: string
  remark: string
  contacts: string
  sort: number
  createTime: string
  updateTime: string
  creator: string
  updater: string
}>

export type ParamsAddStore = {
  id: number
  name: string
  phone: string
  tel: string
  openTime: string
  address: string
  remark: string
  contacts: string
  sort: number
}
