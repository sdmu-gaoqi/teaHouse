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
import { Store as S } from 'store-request'
import { useStore } from 'vuex'
import { toRaw } from 'vue'
import { transformRoute } from './utils/menu'
import { adminPerm } from './constant'
import { getToken } from './utils'

const baseRouter: any[] = [
  {
    path: 'workbench',
    name: '工作台',
    component: () => import('./pages/workbench/workbench'),
    meta: {
      key: 'workbench'
    }
  },
  {
    path: '/password',
    name: '修改密码',
    component: () => import('./pages/user/password')
  },
  {
    path: '/403',
    name: '403',
    component: () => import('./pages/403/index.vue')
  }
]

// const routes: RouteRecordRaw[] = [
const asyncRouter: any[] = [
  {
    path: '/order',
    name: '订单管理',
    redirect: () => {
      return { path: 'list' }
    },
    children: [
      {
        path: 'list',
        name: '订单列表页',
        component: () => import('./pages/order/list.vue'),
        meta: {
          access: ['orderList'],
          key: 'order-list'
        }
      },
      {
        path: 'create',
        name: '订单创建',
        component: () => import('./pages/order/create'),
        meta: {
          access: ['orderOption'],
          key: 'order-create'
        }
      }
    ]
  },
  {
    path: '/member',
    name: '会员管理',
    redirect: () => {
      return { path: 'list' }
    },
    children: [
      {
        path: 'list',
        name: '会员列表页',
        component: () => import('./pages/member/list.vue'),
        meta: {
          access: ['memberList'],
          key: 'member-list'
        }
      },
      {
        path: 'add',
        name: '新增会员',
        meta: {
          access: ['editMember'],
          key: 'member-list'
        },
        component: () => import('./pages/member/add.vue')
      },
      {
        path: 'edit/:id',
        name: '编辑会员',
        meta: {
          access: ['editMember'],
          key: 'member-list'
        },
        component: () => import('./pages/member/add.vue')
      },
      {
        path: 'type/list',
        name: '会员模式',
        component: () => import('./pages/member/type/list.vue')
      },

      {
        path: 'type/add',
        name: '设置会员模式',
        component: () => import('./pages/member/type/add.vue')
      }
    ]
  },
  {
    path: '/employee',
    name: '员工管理',
    redirect: () => {
      return { path: 'list' }
    },
    children: [
      {
        path: 'list',
        name: '员工列表页',
        component: () => import('./pages/employee/list.vue'),
        meta: {
          access: ['employeeList'],
          key: 'employee-list'
        }
      },
      {
        path: 'add',
        name: '新增员工',
        component: () => import('./pages/employee/add.vue'),
        meta: {
          access: ['editEmployee'],
          key: 'employee-list'
        }
      },
      {
        path: 'edit/:id',
        name: '编辑员工',
        component: () => import('./pages/employee/add.vue'),
        meta: {
          access: ['editEmployee'],
          key: 'employee-list'
        }
      },
      {
        path: 'leave/list',
        name: '员工请假列表',
        component: () => import('./pages/employee/leave-list.vue')
      },
      {
        path: 'leave/add',
        name: '新增请假',
        component: () => import('./pages/employee/leave-add.vue')
      }
    ]
  },
  {
    path: '/role',
    name: '角色',
    redirect: () => {
      return { path: 'list' }
    },
    children: [
      {
        path: 'list',
        name: '角色列表',
        component: () => import('./pages/role/list.vue'),
        meta: {
          access: ['roleList'],
          key: 'role-list'
        }
      },
      {
        path: 'add',
        name: '新增角色',
        component: () => import('./pages/role/add.vue'),
        meta: {
          access: ['editRole'],
          key: 'role-list'
        }
      },
      {
        path: 'edit/:id',
        name: '编辑角色',
        component: () => import('./pages/role/add.vue'),
        meta: {
          access: ['editRole'],
          key: 'role-list'
        }
      }
    ]
  },
  {
    path: 'perm',
    name: '权限',
    redirect: () => {
      return { path: 'list' }
    },
    children: [
      {
        path: 'list',
        name: '权限列表',
        component: () => import('./pages/perm/list'),
        meta: {
          access: ['permSet'],
          key: 'perm-list'
        }
      }
    ]
  },
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
      },
      {
        path: 'updates/list',
        name: '门店动态列表',
        component: () => import('./pages/storeUpdates/list.vue'),
        meta: {
          access: ['cs:storeUpdates:view'],
          key: 'updates-list'
        }
      },
      {
        path: 'updates/add',
        name: '新增门店动态',
        component: () => import('./pages/storeUpdates/edit.vue'),
        meta: {
          access: ['cs:storeUpdates:edit'],
          key: 'updates-list'
        }
      },
      {
        path: 'updates/:type/:id',
        name: '编辑门店动态',
        component: () => import('./pages/storeUpdates/edit.vue'),
        meta: {
          access: ['cs:storeUpdates:edit'],
          key: 'updates-add'
        }
      }
    ]
  },
  {
    path: '/marketing',
    name: '营销管理',
    redirect: () => {
      return { path: 'list' }
    },
    children: [
      {
        path: 'list',
        name: '限时秒杀活动',
        component: () => import('./pages/marketing/list.tsx'),
        meta: {
          access: ['cs:marketing:view'],
          key: 'marketing-list'
        }
      },
      {
        path: 'add',
        name: '新建秒杀活动',
        component: () => import('./pages/marketing/detail.tsx'),
        meta: {
          access: ['cs:marketing:edit'],
          key: 'marketing-list'
        }
      },
      {
        path: 'edit:/:id',
        name: '编辑秒杀活动',
        component: () => import('./pages/marketing/detail.tsx'),
        meta: {
          access: ['cs:marketing:edit'],
          key: 'marketing-list'
        }
      },
      {
        path: 'detail:/:id',
        name: '秒杀活动详情',
        component: () => import('./pages/marketing/detail.tsx')
      }
    ]
  },
  {
    path: '/chart',
    name: '统计报表',
    redirect: () => {
      return { path: 'list' }
    },
    children: [
      {
        path: 'turnover/list',
        name: '营业额统计',
        component: () => import('./pages/operation/list.vue'),
        meta: {
          access: ['chartTurnover'],
          key: 'turnover-list'
        }
      },
      {
        path: 'outstanding/list',
        name: '员工业绩统计',
        component: () => import('./pages/operation/outstanding/list.vue'),
        meta: {
          access: ['chartOutstanding'],
          key: 'outstanding-list'
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
        name: '房间管理',
        children: [
          {
            path: 'add',
            name: '新增房间',
            component: () => import('./pages/setting/room/add.vue'),
            meta: {
              access: ['editRoom'],
              key: 'home-list'
            }
          },
          {
            path: 'list',
            name: '房间列表',
            component: () => import('./pages/setting/room/list.vue'),
            meta: {
              access: ['roomList'],
              key: 'home-list'
            }
          }
        ]
      },
      {
        path: '/room-type',
        name: '房间类型',
        children: [
          {
            path: 'list',
            name: '房间类型列表',
            component: () => import('./pages/setting/room-type/list.vue')
          },
          {
            path: 'add',
            name: '新增房间类型',
            component: () => import('./pages/setting/room-type/add.vue')
          }
        ]
      },
      {
        path: 'project',
        name: '价目表信息',
        children: [
          {
            path: 'list',
            name: '价目表列表',
            component: () => import('./pages/setting/project/list.vue'),
            meta: {
              access: ['projectList'],
              key: 'project-list'
            }
          },
          {
            path: 'add',
            name: '新增项目',
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
      },
      {
        path: 'pay-type',
        name: '支付方式设置',
        children: [
          {
            path: '',
            name: '支付方式设置',
            component: () => import('./pages/setting/pay-type/pay-type.vue'),
            meta: {
              access: ['payTypeManage'],
              key: 'pay-type'
            }
          },
          {
            path: 'add',
            name: '新增支付方式',
            component: () => import('./pages/setting/pay-type/edit.vue'),
            meta: {
              access: ['payTypeManage'],
              key: 'pay-type'
            }
          }
        ]
      },
      {
        path: 'turnover',
        name: '营业额标准设置',
        component: () => import('./pages/setting/turnover/turnover.vue'),
        meta: {
          access: ['turnoverManage'],
          key: 'turnover'
        }
      }
    ]
  },
  {
    path: '/log',
    name: '日志管理',
    redirect: () => {
      return { path: 'login' }
    },
    children: [
      {
        path: 'login',
        name: '系统登录日志',
        component: () => import('./pages/log/login-log'),
        meta: {
          access: ['loginLog'],
          key: 'login-log'
        }
      },
      {
        path: 'operate',
        name: '系统操作日志',
        component: () => import('./pages/log/operate-log'),
        meta: {
          access: ['operateLog'],
          key: 'operate-log'
        }
      }
    ]
  },
  {
    path: 'version/list',
    name: '版本日志',
    component: () => import('./pages/version/list.tsx')
  },
  {
    path: 'richText',
    name: '富文本编辑器',
    component: () => import('./pages/richText/index.tsx')
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
      name: '门店管理系统',
      redirect: () => {
        return { path: '/workbench' }
      },
      children: [...baseRouter, ...asyncRouter]
    },
    {
      path: '/404',
      name: '404',
      component: () => import('./pages/404/index.vue')
    }
    // {
    //   path: '/:pathMatch(.*)',
    //   redirect: '/404'
    // }
  ],
  history: createWebHashHistory()
})

const initUserInfo = async () => {
  const s = new S()
  const store = useStore()
  const { dispatch, state } = store
  if (!isEmpty(state.userInfo.perms)) {
    return toRaw(state.userInfo)
  }
  const res = await user.getUserInfo()
  const urlSearch = new URLSearchParams(location.search)
  if (!res?.user?.storeHeadquartersCode) {
    return
  }
  urlSearch.set('storeHeadquartersCode', res?.user?.storeHeadquartersCode)
  urlSearch.set('storeCode', res?.user?.currentStoreCode)
  location.search = urlSearch.toString()
  const storeList = await s.loginList({})
  const currentStoreCode = res?.user?.currentStoreCode
  const currentStoreName = storeList?.rows?.find(
    (item) => item.code == currentStoreCode
  )?.name
  dispatch('userInfo/changeUser', {
    data: {
      ...res.user,
      currentStoreName
    }
  })
  dispatch('userInfo/setPerms', { data: res.permissions })
  dispatch('common/changeMenus', { data: res.permissions })
  transformRoute(res.permissions)
  return {
    perms: res.permissions,
    userInfo: res.user
  }
}

route.beforeEach(async (to, from, next) => {
  const toPath = to?.path
  if (getToken() && ['/login'].includes(toPath)) {
    next('/workbench')
    return
  }
  if (!['/login', '/test'].includes(toPath) && !getToken()) {
    next('/login')
    return
  }
  if (['/login', '/404', '/'].includes(toPath) || !getToken()) {
    next()
    return
  }
  let { perms = [] } = await initUserInfo()
  const menuHasPerm = !isEmpty(to?.meta?.access)
  if (menuHasPerm) {
    const hasPerm =
      to?.meta?.access?.some((item) => perms?.includes(item)) ||
      perms.some((item) => item === adminPerm)
    if (!hasPerm) {
      next('/404')
      return
    }
  }
  next()
})

export default route
