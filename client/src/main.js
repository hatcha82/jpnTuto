// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import { sync } from 'vuex-router-sync'
import 'vuetify/dist/vuetify.min.css'
import store from '@/store/store'
import VueYouTubeEmbed from 'vue-youtube-embed'
import Panel from '@/components/globals/Panel'
import PanelPadding from '@/components/globals/PanelPadding'
import moment from 'moment'
Vue.config.productionTip = false

Vue.use(Vuetify)
moment.locale('ko')
Vue.use(require('vue-moment'), {
  moment
})
Vue.use(VueYouTubeEmbed)
Vue.component('panel', Panel)
Vue.component('PanelPadding', PanelPadding)

sync(store, router)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
