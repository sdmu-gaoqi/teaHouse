import { CHANGEMENUDATA, CHANGESTORES } from '../actions'
import member from '@/assets/svg/member.svg'
import storeIcon from '@/assets/svg/store.svg'
import setIcon from '@/assets/svg/set.svg'
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
    icon: member
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
    icon: storeIcon
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
    icon: setIcon
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
