import type { App } from 'vue'
import { authDirective } from '@/directives/auth'
import drillDownDirective from '@/directives/drillDown'

export default {
  install(Vue: App) {
    Vue.directive('auth', authDirective)
    Vue.directive('drillDownPerm', drillDownDirective)
  }
}
