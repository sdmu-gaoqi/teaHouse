import { UserInfo } from '@/service/typing'
import { SETUSERINFO } from '../actions'

export interface UserState {
  userInfo: Partial<UserInfo['data']>
}

const state: UserState = {
  userInfo: {}
}

const getters = {
  loginInfo(state: UserState, getters: any, rootState: any) {
    return state.userInfo
  }
}

const actions = {
  changeUser(
    { state, commit }: any,
    payload: { type: string; data: typeof state.userInfo }
  ) {
    commit(SETUSERINFO, payload.data)
  }
}

const mutations = {
  [SETUSERINFO](state: UserState, data: typeof state.userInfo) {
    state.userInfo = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
