export enum ErrorCode {
  未登录 = 401
}

export enum Dict {
  包厢类型 = 'infra_guest_room_category'
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

export type ReturnStoreList = Response<
  {
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
  }[]
>

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

export type ParamsRoomList = PageParams & {
  code?: string
  category?: string
}

export type ReturnRoomList = Response<
  {
    id: number
    code: string
    name: string
    status: number
    category: string
    categoryName: string
    capacityNum: number
    isLowest: number
    lowestPrice: number
    isOvertime: number
    overtimeDuration: number
    overtimeUnitPrice: number
    createTime: string
    updateTime: string
  }[]
>

export type ParamsAddRoom = {
  code: string
  name: string
  category: string
  remark: string
  capacityNum: number
  isLowest: number
  isOvertime: number
  overtimeDuration: number
  lowestPrice: number
  overtimeUnitPrice: number
  sort: number
}

export type RoomItem = {
  id: number
  code: string
  name: string
  status: number
  category: string
  categoryName: string
  capacityNum: number
  isLowest: number
  lowestPrice: number
  isOvertime: number
  overtimeDuration: number
  overtimeUnitPrice: number
  createTime: string
  updateTime: string
}

export type ReturnDictDetailList = Response<
  {
    dictType: string
    value: string
    label: string
    colorType: string
    cssClass: string
  }[]
>
