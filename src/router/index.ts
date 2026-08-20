import { createRouter, createWebHashHistory } from 'vue-router'
import Main from '../layouts/Main.vue'
// import Home from '../views/home/Home.vue'
// import vocOverview from '@/views/vocOverview/index.vue'

/**
 * meta字段说明
 * title 菜单名称
 * icon
 * alwaysShow 适用于children只有一个的时候， 不用展示子级
 */

export const notFoundRoute = {
  path: '/:pathMatch(.*)*',
  name: 'notFound',
  redirect: '/404'
}

/**
 * 公共路由
 */
const constantRoutes = [
  {
    path: '/',
    component: Main,
    redirect: '/voc/view',
    name: 'voc',
    meta: {
      title: 'VOC总览',
      icon: 'ri-dashboard-3-fill',
      alwaysShow: true
      // hidden: true
    },
    children: [
      {
        path: '/voc/view',
        name: 'vocView',
        meta: {
          title: 'VOC总览',
          icon: ''
        },
        component: () => import('@/views/vocOverview/index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      hidden: true
    },
    redirect: '/voc/view'
  },
  {
    path: '/403',
    name: '403',
    meta: {
      hidden: true
    },
    component: () => import('@/views/exception/403.vue')
  },
  {
    path: '/404',
    name: '404',
    meta: {
      hidden: true
    },
    component: () => import('@/views/exception/404.vue')
  },
  {
    path: '/500',
    name: '500',
    meta: {
      hidden: true
    },
    component: () => import('@/views/exception/500.vue')
  },
  {
    path: '/redirect',
    name: 'redirect',
    meta: {
      hidden: true
    },
    redirect: '/voc/view'
  }
  // notFoundRoute
]

/**
 * 动态路由
 * 后端配置菜单时，permissionKey 需与 dynamicRoutes[] 中的name 保持一致
 */
export const dynamicRoutes = [
  {
    path: '/',
    component: Main,
    redirect: '/voc/view',
    name: 'voc',
    meta: {
      title: 'VOC总览',
      icon: 'ri-dashboard-3-fill',
      alwaysShow: true
      // hidden: true
    },
    children: [
      {
        path: '/voc/view',
        name: 'vocView',
        meta: {
          title: 'VOC总览',
          icon: ''
        },
        component: () => import('@/views/vocOverview/index.vue')
      }
    ]
  },
  {
    path: '/experience',
    component: Main,
    redirect: '/experience/testing',
    name: 'experience',
    meta: {
      title: '体验指数检测',
      icon: 'ri-line-chart-fill',
      alwaysShow: true
    },
    children: [
      {
        path: '/experience/testing',
        name: 'experienceTesting',
        meta: {
          title: '体验指数检测',
          icon: ''
        },
        component: () => import('@/views/experience/index.vue')
      }
    ]
  },
  {
    path: '/userf',
    component: Main,
    redirect: '/userf/focus',
    name: 'userf',
    meta: {
      title: '用户聚焦关注',
      icon: 'ri-focus-3-fill',
      alwaysShow: true
    },
    children: [
      {
        path: '/userf/focus',
        name: 'userfFocus',
        meta: {
          title: '用户聚焦关注',
          icon: ''
        },
        component: () => import('@/views/user/focus/index.vue')
      }
    ]
  },
  {
    path: '/useri',
    component: Main,
    redirect: '/useri/insights',
    name: 'useri',
    meta: {
      title: '用户期待洞察',
      icon: 'ri-lightbulb-flash-fill',
      alwaysShow: true
    },
    children: [
      {
        path: '/useri/insights',
        name: 'useriInsights',
        meta: {
          title: '用户期待洞察',
          icon: ''
        },
        component: () => import('@/views/user/insights/index.vue')
      }
    ]
  },
  {
    path: '/userp',
    component: Main,
    redirect: '/userp/praise',
    name: 'userp',
    meta: {
      title: '用户好评反馈',
      icon: 'ri-star-smile-fill',
      alwaysShow: true
    },
    children: [
      {
        path: '/userp/praise',
        name: 'userpPraise',
        meta: {
          title: '用户好评反馈',
          icon: 'ri-star-smile-fill',
          hidden: false
        },
        component: () => import('../views/user/praise/index.vue')
      }
    ]
  },
  {
    path: '/risk',
    component: Main,
    redirect: '/risk/warning',
    name: 'risk',
    meta: {
      title: '课题事件闭环',
      icon: 'ri-loop-left-line'
    },
    children: [
      {
        path: '/risk/warning',
        name: 'riskWarning',
        meta: {
          title: '课题管理',
          icon: 'ri-list-check-3'
        },
        component: () => import('@/views/risk/index.vue')
      },
      {
        path: '/risk/statistics',
        name: 'riskStatistics',
        meta: {
          title: '闭环统计',
          icon: 'ri-bar-chart-grouped-line'
        },
        component: () => import('@/views/risk/statistics/index.vue')
      },
      {
        path: '/risk/rules',
        name: 'riskRules',
        meta: {
          title: '规则配置',
          icon: 'ri-equalizer-3-line'
        },
        component: () => import('@/views/risk/rules/index.vue')
      }
    ]
  },
  {
    path: '/report',
    component: Main,
    redirect: '/report/management',
    name: 'report',
    meta: {
      title: '报告管理中心',
      icon: 'ri-file-chart-fill',
      alwaysShow: true
    },
    children: [
      {
        path: '/report/management',
        name: 'reportManagement',
        meta: {
          title: '报告管理中心',
          icon: ''
        },
        component: () => import('@/views/report/index.vue')
      }
    ]
  },
  {
    path: '/settings',
    name: 'settings',
    component: Main,
    redirect: '/settings/sysSettings',
    meta: {
      title: '系统配置',
      icon: 'ri-settings-3-fill',
      alwaysShow: false
    },
    children: [
      {
        path: '/settings/sysSettings',
        name: 'settingsSysSettings',
        meta: {
          title: '系统设置',
          icon: 'ri-tools-fill'
        },
        component: () => import('@/views/settings/sysSettings/index.vue')
      },
      {
        path: '/settings/operationLog',
        name: 'settingsOperationLog',
        meta: {
          title: '操作日志',
          icon: 'ri-file-list-3-fill'
        },
        component: () => import('@/views/settings/operationLog/index.vue')
      },
      {
        path: '/settings/account',
        name: 'settingsAccount',
        meta: {
          title: '账号管理',
          icon: 'ri-account-circle-fill'
        },
        component: () => import('@/views/settings/account/index.vue')
      },
      {
        path: '/settings/role',
        name: 'settingsRole',
        meta: {
          title: '角色管理',
          icon: 'ri-shield-user-fill'
        },
        component: () => import('@/views/settings/sysRole/index.vue')
      }
    ]
  }
]

const routes = [
  ...constantRoutes,
  ...dynamicRoutes.filter(route => route.name !== 'voc'),
  notFoundRoute
]
const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  routes
})

export default router
