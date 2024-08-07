export enum ErrorCode {
  未登录 = 401
}

export enum Dict {
  包厢类型 = 'infra_guest_room_category',
  菜品类型 = 'infra_goods_category'
}

export enum GoodType {
  菜品 = 0,
  商品 = 1
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
  status?: number
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

export type ParamsGoodsList = PageParams & {
  code?: string
  name?: string
  category?: string
}

export type GoodItem = {
  id: number
  code: string
  name: string
  status: number
  category: string
  categoryName: string
  canDiscount: number
  unit: string
  unitName: string
  unitPrice: number
  createTime: string
  updateTime: string
}

export type GoodSetItem = {
  id: number
  code: string
  name: string
  status: number
  category: string
  categoryName: string
  canDiscount: number
  unit: string
  unitName: string
  unitPrice: number
  createTime: string
  updateTime: string
  type: GoodType
}

export type ReturnGoods = Response<GoodItem[]>
export type ReturnGoodsSet = Response<GoodSetItem[]>

export type ParamsAddGood = {
  id: number
  name: string
  category: string
  /**
   * 单位 数据字典infra_goods_unit
   * */
  unit: string
  /**
   * unitPrice
   * */
  unitPrice: number
  /**
   * 菜品类型 0菜品 1商品
   * */
  type: GoodType
  status: number // 0 || 1
  /**
   * 位置 0-吧台 1-厨房
   * */
  position: string
  sort: number
}
