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
import VueAxios from 'vue-axios'
import VueAuthenticate from 'vue-authenticate'
import axios from 'axios';
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
Vue.use(VueAxios, axios)
Vue.use(VueAuthenticate, {
  baseUrl: 'http://localhost:8080', // Your API domain
  
  providers: {
    google: {
      clientId: '101271609028-qt8p60ktp498m87ectb1arhsq1pbvj7f.apps.googleusercontent.com',
      redirectUri: 'http://localhost:8081/auth/google/redirect',
      
    },
    github: {
      clientId: '',
      redirectUri: 'http://localhost:8080/auth/callback' // Your client app URL
    }
  }
})

sync(store, router)
new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
