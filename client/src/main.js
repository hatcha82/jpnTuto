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
import vueVideo from 'vue-video'
import VueVideoPlayer from 'vue-video-player'

// require videojs style
import 'video.js/dist/video-js.css'
// import 'vue-video-player/src/custom-theme.css'
Vue.use(VueVideoPlayer, /* {
  options: global default options,
  events: global videojs events
} */)

Vue.config.productionTip = false
Vue.use(VueHead)
moment.locale('ko')
Vue.use(require('vue-moment'), {
  moment
})
Vue.use(underscore)
Vue.use(BackToTop)
Vue.use(infiniteScroll)
Vue.use(vueVideo)
sync(store, router)

new Vue({
  render: h => h(App),
  router,
  store

}).$mount('#app')
