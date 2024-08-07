import { CHANGEMENUDATA, CHANGESTORES } from '../actions'
import 会员 from '@/assets/会员.svg'
import 门店 from '@/assets/门店.svg'
import 设置 from '@/assets/设置.svg'
import type { UserState } from './userInfo'
import { transformMenuByPerms } from '@/utils/menu'

interface State {
  menus: Record<string, any>[]
  stores: any[]
}

const defaultMenu = [
  {
    title: '会员管理',
    key: 'member',
    access: ['memberList'],
    children: [
      {
        title: '会员列表',
        path: '/member/list',
        key: 'member-list',
        access: ['memberList']
      }
      // { title: '会员模式', path: '/member/type/list', key: 'member-type-list' }
    ],
    path: '/member',
    icon: 会员
  },
  {
    title: '门店管理',
    key: 'stores',
    children: [
      {
        title: '门店信息',
        path: '/stores/list',
        key: 'stores-list'
      }
    ],
    path: '/stores',
    icon: 门店
  },
  {
    title: '系统管理',
    key: 'setting',
    access: [
      'roomList',
      'projectList',
      'payTypeManage',
      'turnoverManage',
      'permSet'
    ],
    children: [
      {
        title: '包厢管理',
        path: '/room/list',
        key: 'home-list',
        access: ['roomList']
      },
      {
        title: '菜品信息',
        path: '/project/list',
        key: 'project-list',
        access: ['projectList']
      }
    ],
    path: '/operation',
    icon: 设置
  }
]

const state: State = {
  menus: defaultMenu,
  stores: []
}

const getters = {
  menus(state: State) {
    return state.menus
  }
}

const actions = {}

const mutations = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
