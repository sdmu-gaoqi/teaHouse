// @ts-nocheck

import type { RouteRecordRaw } from 'vue-router'
import {
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router'
import Layout from './components/layout/layout.vue'
import { isEmpty } from 'wa-utils'
import user from './servers/user'
import { useStore } from 'vuex'
import { toRaw } from 'vue'
import { transformRoute } from './utils/menu'
import { adminPerm } from './constant'
import { getToken } from './utils'
import request from './service'
import { userInfoRequest } from './service/user'

const baseRouter: any[] = [
  {
    path: 'home',
    name: '首页',
    component: () => import('./pages/home/home.vue'),
    meta: {
      key: 'home'
    }
  },
  {
    path: '/403',
    name: '403',
    component: () => import('./pages/403/index.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('./pages/404/index.vue')
  }
]

const asyncRouter: any[] = [
  {
    path: '/stores',
    name: '门店管理',
    redirect: () => {
      return { path: 'list' }
    },
    children: [
      {
        path: 'list',
        name: '门店列表',
        component: () => import('./pages/stores/list.vue'),
        meta: {
          access: ['storeList'],
          key: 'stores-list'
        }
      }
    ]
  },
  {
    path: '/',
    name: '系统管理',
    redirect: () => {
      return { path: 'room' }
    },
    children: [
      {
        path: '/room',
        name: '包厢管理',
        children: [
          {
            path: 'add',
            name: '新增包厢',
            component: () => import('./pages/setting/room/add.vue'),
            meta: {
              access: ['editRoom'],
              key: 'home-list'
            }
          },
          {
            path: 'edit/:id',
            name: '编辑包厢',
            component: () => import('./pages/setting/room/add.vue'),
            meta: {
              access: ['editRoom'],
              key: 'home-list'
            }
          },
          {
            path: 'list',
            name: '包厢列表',
            component: () => import('./pages/setting/room/list.vue'),
            meta: {
              access: ['roomList'],
              key: 'home-list'
            }
          }
        ]
      },
      {
        path: 'project',
        name: '菜品信息',
        children: [
          {
            path: 'list',
            name: '菜品列表',
            component: () => import('./pages/setting/project/list.vue'),
            meta: {
              access: ['projectList'],
              key: 'project-list'
            }
          },
          {
            path: 'add',
            name: '新增菜品',
            component: () => import('./pages/setting/project/add.vue'),
            meta: {
              access: ['editProject'],
              key: 'project-list'
            }
          },
          {
            path: 'edit/:id',
            name: '编辑菜品',
            component: () => import('./pages/setting/project/add.vue'),
            meta: {
              access: ['editProject'],
              key: 'project-list'
            }
          },
          {
            path: 'edit/:id',
            name: '编辑项目',
            component: () => import('./pages/setting/project/add.vue'),
            meta: {
              access: ['editProject'],
              key: 'project-list'
            }
          }
        ]
      }
    ]
  }
]

const route = createRouter({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('./pages/login/login.vue')
    },
    {
      path: '',
      component: Layout,
      name: '沐茗茶舍',
      redirect: () => {
        return { path: '/home' }
      },
      children: [...baseRouter, ...asyncRouter]
    }
  ],
  history: createWebHashHistory()
})

const initUserInfo = async () => {
  const store = useStore()
  const { dispatch, state } = store
  const res = await userInfoRequest()
  dispatch('userInfo/changeUser', {
    data: {
      ...res.data
    }
  })
  return res
}

route.beforeEach(async (to, from, next) => {
  if (to?.path.includes('login')) {
    next()
    return
  }
  await initUserInfo()
  next()
  return
})

export default route
