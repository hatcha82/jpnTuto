import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import infiniteScroll from 'vue-infinite-scroll'
import { sync } from 'vuex-router-sync'
import store from '@/store/store'
import BackToTop from 'vue-backtotop'
import moment from 'moment'

Vue.config.productionTip = false

moment.locale('ko')
Vue.use(require('vue-moment'), {
  moment
})
Vue.use(BackToTop)
Vue.use(infiniteScroll)
sync(store, router)

new Vue({
  render: h => h(App),
  router,
  store

}).$mount('#app')
