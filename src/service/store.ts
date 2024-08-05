import request from '.'
import {
  ParamsAddStore,
  ParamsStoreList,
  Response,
  ReturnStoreList
} from './typing'

export const storeListRequest = (data: ParamsStoreList) => {
  console.log(data, 'data')
  return request.request<ReturnStoreList>({
    url: '/admin-api/system/store/page',
    method: 'post',
    data
  })
}

export const addStoreREquest = (data: ParamsAddStore) => {
  return request.request<Response<boolean>>({
    url: '/admin-api/system/store/save',
    method: 'post',
    data
  })
}

export const updateStoreREquest = (data: ParamsAddStore & { id: number }) => {
  return request.request<Response<boolean>>({
    url: '/admin-api/system/store/update',
    method: 'post',
    data
  })
}
