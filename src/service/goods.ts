import request from '.'
import {
  ParamsAddGood,
  ParamsRoomList,
  Response,
  ReturnRoomList
} from './typing'

/**
 * 点单搜索场景使用
 * */
export const goodsListRequest = (data: ParamsRoomList) => {
  return request.request<ReturnRoomList>({
    url: '/admin-api/admin-api/goods/search',
    method: 'post',
    data
  })
}

/**
 * 管理菜品场景使用
 * */
export const goodsListRequestBySet = (data: ParamsRoomList) => {
  return request.request<ReturnRoomList>({
    url: '/admin-api/admin-api/goods/page',
    method: 'post',
    data
  })
}

export const addGoodREquest = (data: ParamsAddGood) => {
  return request.request<Response<boolean>>({
    url: '/admin-api/admin-api/guest-room/save',
    method: 'post',
    data
  })
}

export const updateGOodREquest = (data: ParamsAddGood & { id: number }) => {
  return request.request<Response<boolean>>({
    url: '/admin-api/admin-api/goods/update',
    method: 'post',
    data
  })
}
