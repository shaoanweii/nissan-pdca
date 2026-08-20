import { useAppStoreWithOut } from './app'
import { defineStore } from 'pinia'
import { enCrypt } from '@/utils'
import router, { dynamicRoutes, notFoundRoute } from '@/router'
import { cloneDeep, debounce } from 'lodash-es'
import store from '..'
import { login, logout } from '@/service/login'
import {
  findThreshold,
  // findBusinessTag,
  // findCarSeries,
  // findChannel,
  // findQualityTag,
  // findRegion,
  userInfo,
  userPermissions
} from '@/service/common'
import to from 'await-to-js'
import useComQueryStore from './comQuery'
import { Message } from '@arco-design/web-vue'
import { TOKEN_KEY, USER_ID_KEY, USER_NAME_KEY } from '@/constant'

interface UserStore {
  roleId: string
  clientId: string
  clientIds: any[]
  defaultClientId: string
  isAdmin: boolean | null
  menus: any[]
  buttonPerm: any[]
  menusMap: Map<any, any>
  userInfo: Record<string, any>
  menuList: any[]
  homePath: string
  brands: any[]
  exponentialThreshold: any[]
  appTags: any[]
  verbal: Record<any, any>
  // 下钻权限 点击下钻事，判断你定义的那个下钻的key在不在这个集合里面，如果再的话，就代表有权限
  drillDowns: any[]
  // 维护数据
  isExport?: boolean
  // 下载图表
  isDownload?: boolean
  // 是否隐藏品牌
  isHideBrand?: boolean
}

const useUserStore = defineStore('user', {
  state: (): UserStore => ({
    // clientId: '',
    roleId: '',
    clientId: '',
    clientIds: [],
    defaultClientId: '',
    isAdmin: null,
    menus: [],
    buttonPerm: [],
    menusMap: new Map(),
    userInfo: {
      // deptName 部门名称
      // employeeId 员工编号
      // username 员工姓名
    },
    // 主菜单
    menuList: [],
    // 首页
    homePath: '/',
    // ----------------- 图表查询选项 start
    // regionOptions: [], // 区域
    // channelOptions: [], // 渠道
    // carSeriesOptions: [], // 车系
    // businessTagOptions: [], // 业务标签
    // qualityTagOptions: [], // 质量标签
    // ----------------- 图表查询选项 end
    // 品牌
    brands: [],
    // 指数阈值
    exponentialThreshold: [],
    appTags: [],
    // ToolTip
    verbal: {},
    // 下钻权限
    drillDowns: [],
    isExport: undefined,
    isDownload: undefined,
    isHideBrand: true
  }),
  getters: {
    getMenus(): Record<any, any>[] {
      return this.menus
    }
  },
  actions: {
    setIsHideBrand(val: boolean) {
      this.isHideBrand = val
    },
    /**
     * @description: 根据品牌名称获取阈值
     * @param {string} brandName
     * @return {*}
     */
    async getFindThreshold(brandName: string) {
      if (!brandName) return
      const [errs, data] = await to(
        findThreshold({
          clientId: this.clientId,
          brandName
        })
      )
      if (errs) {
        Message.error(errs.message)
        this.exponentialThreshold = []
      }
      if (data) {
        this.exponentialThreshold = data.result || []
      }
    },
    setExponentialThreshold(threshold: any[]) {
      this.exponentialThreshold = threshold
    },
    menusMapClear() {
      this.menusMap.clear()
    },
    setCilenId(val: string) {
      this.clientId = val
    },
    /**
     * 登录
     * @param form
     */
    async login(form: Login.LoginReq) {
      try {
        const params = Object.assign({}, form, {
          password: enCrypt(form.password),
          username: enCrypt(form.username)
        })
        const loginRes = await login(params).then(res => res.result)
        localStorage.setItem(TOKEN_KEY, loginRes.access_token)
        localStorage.setItem(USER_NAME_KEY, loginRes.username)
        localStorage.setItem(USER_ID_KEY, loginRes.userid)
        await this.getUserPermissions()
        return Promise.resolve()
      } catch (e) {
        this.clearStorage()
        return Promise.reject(e)
      }
    },
    clearStorage() {
      localStorage.setItem(TOKEN_KEY, '')
      localStorage.setItem(USER_NAME_KEY, '')
      localStorage.setItem(USER_ID_KEY, '')
    },
    linkLogin() {
      this.clearStorage()
      router.replace('/voc/view')
    },
    linkOriginLogin() {
      this.clearStorage()
      router.replace('/voc/view')
    },
    /**
     * 登出
     * // tip: 无法手动跳转到login页面， 需要执行useUserStore().logout() 方法退出
     */
    logout(type?: number) {
      const debounceFn = debounce(async () => {
        try {
          await logout()
        } catch (err: any) {
          return Promise.resolve()
        } finally {
          if (type === 1) {
            this.linkOriginLogin()
          } else {
            this.linkLogin()
          }
        }
      }, 300)
      debounceFn()
    },
    /**
     * 获取用户信息
     */
    async getUserInfo() {
      const [, data] = await to(userInfo())
      if (data?.result) {
        this.userInfo = data.result
      }
    },
    /**
     * @description: 将menus单层结构的数据包装一层
     * @param {any} menus
     */
    transformMenus(menus: any[]) {
      return menus?.map(el => {
        if (el.children) {
          return el
        } else if (el.permissionKey === 'linkUrl') {
          return el
        } else {
          const _pathArray = el.path?.split('/')
          const path = Array.isArray(_pathArray) ? _pathArray[1] : `${el.path}${Date.now()}`
          const permissionKey = Array.isArray(_pathArray)
            ? _pathArray[1]
            : `${el.path}${Date.now()}`
          return {
            ...el,
            path: `/${path}`,
            permissionKey,
            children: [
              {
                ...el
              }
            ]
          }
        }
      })
    },
    /**
     * @description: 过滤路由生成菜单数据
     * @return {*}
     */
    setMenuList(menus: any) {
      const menuRoutes = router
        .getRoutes()
        .filter(el => el.children?.length > 0 && !el.meta?.hidden) as any[]
      const scenarioRouteNames = new Set(['experience', 'userf', 'useri', 'userp'])
      const scenarioRoutes = menuRoutes.filter(route => scenarioRouteNames.has(route.name))
      const scenarioChildren = scenarioRoutes.flatMap(route =>
        route.children.map((child: any) => ({
          ...child,
          meta: {
            ...child.meta,
            icon: child.meta?.icon || route.meta?.icon
          }
        }))
      )
      const groupedMenus: any[] = []
      let scenarioMenuAdded = false
      menuRoutes.forEach(route => {
        if (!scenarioRouteNames.has(route.name)) {
          groupedMenus.push(route)
          return
        }
        if (scenarioMenuAdded || !scenarioChildren.length) return
        groupedMenus.push({
          path: '/scenario-analysis',
          redirect: scenarioChildren[0].path,
          name: 'scenarioAnalysis',
          meta: {
            title: '关注场景分析',
            icon: 'ri-bubble-chart-line'
          },
          children: scenarioChildren
        })
        scenarioMenuAdded = true
      })
      this.menuList = groupedMenus

      const linkUrlMenu = menus.filter((el: any) => el.permissionKey === 'linkUrl')

      if (linkUrlMenu?.length) {
        linkUrlMenu.forEach((el: any) => {
          if (el?.children?.length > 0) {
            el.children.forEach((item: any) => {
              // item.path = item.apiPath
              item.path = `${item.permissionKey}_${item.id}`
              item.meta = {
                title: item.name,
                icon: item.icon
              }
            })
          }
          // 将类型为linkUrl的菜单添加到指定位置
          this.menuList.splice(el.sort - 1, 0, {
            ...el,
            path: el.apiPath,
            meta: {
              title: el.name,
              icon: el.icon
            }
          })
        })
      }
      if (this.menuList[0]?.redirect) {
        // 默认首页
        this.homePath = this.menuList[0]?.redirect
      }
      console.log('this.menuList', this.menuList)
    },
    /**
     * 获取用户权限
     */
    async getUserPermissions() {
      const permissionsRes = (await userPermissions().then(res => res.result)) || {}
      await this.getUserInfo()
      const {
        clientIds,
        menus = [],
        button = [],
        defaultClientId,
        isAdmin,
        roleId,
        systemInfoVo,
        brands,
        // threshold,
        appTags,
        verbal,
        isExport,
        isDownload,
        drillDowns
      } = permissionsRes

      const newMenus = this.transformMenus(menus)

      // 系统默认配置
      useAppStoreWithOut().setSysConfig(systemInfoVo)
      useAppStoreWithOut().setDefSysConfig(systemInfoVo)

      this.clientIds = clientIds?.details
      this.menus = newMenus || []
      this.buttonPerm = button || []
      this.defaultClientId = defaultClientId
      this.isAdmin = isAdmin
      this.roleId = roleId
      this.brands = brands?.details?.sort((a: any, b: any) => a?.sort - b?.sort) || []
      // this.exponentialThreshold = threshold.details || []
      this.appTags = appTags || []
      this.verbal = verbal || []
      this.isExport = isExport
      this.isDownload = isDownload
      this.drillDowns = drillDowns || []
      this.setCilenId(defaultClientId)
      useComQueryStore().setBrandCodeList(this.brands[0]?.value)
      // useComQueryStore().setBrandCode(this.brands[0]?.value)
      useComQueryStore().setForm({ clientId: defaultClientId })

      if (newMenus?.length) {
        this.menusMap = this.menuToMap(newMenus)
        this.generateRoutes()
        this.setMenuList(newMenus)
      }
      return permissionsRes
    },
    /**
     * 将菜单树转成map结构
     * @param tree
     */
    menuToMap(tree: any) {
      const map = new Map()
      if (tree?.length === 0) return map

      function traverse(node: any, order: number) {
        node.order = order + 1
        map.set(node.permissionKey, node) // 使用permissionKey作为键
        if (node.children) {
          node.children.forEach((child: any, index: number) => traverse(child, index)) // 递归遍历子节点
        }
      }

      tree.forEach((root: any, index: number) => traverse(root, index)) // 开始遍历根节点
      return map
    },
    /**
     * 获取后端返回菜单的PermissionKey集合，
     */
    getRemoteMenuPermissionKey() {
      return [...this.menusMap.keys()]
    },
    /**
     * 根据后端返回的菜单, 过滤路由表并修改菜单名称和icon
     * 添加排序字段, 按照后端返回的顺序展示
     * @param remoteMenu
     */
    getAsyncRouter(remoteMenu: string[]) {
      const routers = cloneDeep(dynamicRoutes)
      return routers
        .filter((el: any) => {
          if (remoteMenu.includes(el.name)) {
            const curMenu = this.menusMap.get(el.name)
            el.meta.title = curMenu.name
            el.meta.icon = curMenu.icon
            el.order = curMenu.order
            el.children = el.children
              .filter((j: any) => {
                if (remoteMenu.includes(j.name)) {
                  const curJMenu = this.menusMap.get(j.name)
                  j.meta.title = curJMenu.name
                  j.meta.icon = curJMenu.icon

                  j.order = curJMenu.order
                  return j
                }
              })
              .sort((a: any, b: any) => a.order - b.order)
            return el
          }
        })
        .sort((a: any, b: any) => a.order - b.order)
    },
    /**
     * 生成动态菜单
     */
    generateRoutes() {
      const remoteMenu = this.getRemoteMenuPermissionKey()
      const asyncRouter = this.getAsyncRouter(remoteMenu)
      asyncRouter.forEach(route => {
        router.addRoute(route) // 动态添加可访问路由表
      })
      router.addRoute(notFoundRoute)
    },
    /**
     * 根据客户id 获取客户code
     * @param clientId
     */
    getClientCodeByClientId(clientId: string) {
      return this.clientIds.find((el: any) => el.key === clientId)
    }
  }
})

export default useUserStore
export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
