import request from '.'
import {
  ParamsAddRoom,
  ParamsAddStore,
  ParamsRoomList,
  ParamsStoreList,
  Response,
  ReturnRoomList,
  ReturnStoreList,
  RoomItem
} from './typing'

export const roomListRequest = (data: ParamsRoomList) => {
  return request.request<ReturnRoomList>({
    url: '/admin-api/admin-api/guest-room/page',
    method: 'post',
    data
  })
}

export const addRoomREquest = (data: ParamsAddRoom) => {
  return request.request<Response<boolean>>({
    url: '/admin-api/admin-api/guest-room/save',
    method: 'post',
    data
  })
}

export const updateRoomREquest = (data: ParamsAddRoom & { id: number }) => {
  return request.request<Response<boolean>>({
    url: '/admin-api/admin-api/guest-room/update',
    method: 'post',
    data
  })
}

export const deleteRoomREquest = (id: number) => {
  return request.request<Response<boolean>>({
    url: '/admin-api/admin-api/guest-room/delete',
    method: 'delete',
    data: {
      id
    }
  })
}

export const roomDetailRequest = (id: number) => {
  return request.request<Response<RoomItem>>({
    url: '/admin-api/admin-api/guest-room/detail',
    method: 'post',
    data: {
      id
    }
  })
}
