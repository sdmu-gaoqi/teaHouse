import request from '.'
import { ReturnDictDetailList } from './typing'

export const dictDetailListRequest = (params: { dictType: string }) => {
  return request.request<ReturnDictDetailList>({
    url: '/admin-api/system/dict-data/list-all-simple',
    params
  })
}
