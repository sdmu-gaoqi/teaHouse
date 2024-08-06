import { Dict, ReturnDictDetailList } from '@/service/typing'
import { SETDICT, SETLOGININFO } from '../actions'

export interface DictState {
  dictMaps: Partial<
    Record<Dict, Record<string, ReturnDictDetailList['data'][0]>>
  >
}

const state: DictState = {
  dictMaps: {}
}

const getters = {
  getDictMap(state: DictState, getters: any, rootState: any) {
    return state.dictMaps
  }
}

const actions = {
  setDict(
    { state, commit }: any,
    payload: { type: string; data: typeof state.loginInfo }
  ) {
    commit(SETDICT, payload.data)
  }
}

const mutations = {
  [SETDICT](state: DictState, data: typeof state.dictMaps) {
    state.dictMaps = {
      ...state.dictMaps,
      ...data
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
