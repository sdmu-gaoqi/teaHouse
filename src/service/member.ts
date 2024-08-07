import request from '.'
import {
  ParamsAddMember,
  ParamsMembersList,
  Response,
  ReturnMemberList
} from './typing'

export const memberListRequest = (data: ParamsMembersList) => {
  return request.request<ReturnMemberList>({
    url: '/admin-api/member/user/page',
    method: 'post',
    data
  })
}

export const addMemberREquest = (data: Omit<ParamsAddMember, 'id'>) => {
  return request.request<Response<boolean>>({
    url: '/admin-api/member/user/save',
    method: 'post',
    data
  })
}

export const updateMemberREquest = (data: ParamsAddMember) => {
  return request.request<Response<boolean>>({
    url: '/admin-api/member/user/update',
    method: 'post',
    data
  })
}

// export const deleteRoomREquest = (id: number) => {
//   return request.request<Response<boolean>>({
//     url: '/admin-api/admin-api/guest-room/delete',
//     method: 'delete',
//     data: {
//       id
//     }
//   })
// }

// export const roomDetailRequest = (id: number) => {
//   return request.request<Response<RoomItem>>({
//     url: '/admin-api/admin-api/guest-room/detail',
//     method: 'post',
//     data: {
//       id
//     }
//   })
// }
