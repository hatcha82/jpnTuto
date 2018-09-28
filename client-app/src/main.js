import '@babel/polyfill'
import Vue from 'vue'
import VueHead from 'vue-head'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import infiniteScroll from 'vue-infinite-scroll'
import { sync } from 'vuex-router-sync'
import store from '@/store/store'
import BackToTop from 'vue-backtotop'
import moment from 'moment'
import underscore from 'vue-underscore'

Vue.config.productionTip = false
Vue.use(VueHead)
moment.locale('ko')
Vue.use(require('vue-moment'), {
  moment
})
Vue.use(underscore)
Vue.use(BackToTop)
Vue.use(infiniteScroll)
sync(store, router)

new Vue({
  render: h => h(App),
  router,
  store

}).$mount('#app')
