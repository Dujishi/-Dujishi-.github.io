import Vue from 'vue'
import iView from 'iview'
import { router } from './router/index'
import store from './store'
import App from './app.vue'
import 'iview/dist/styles/iview.css'
import VueI18n from 'vue-i18n'
import moment from 'moment'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'babel-polyfill'
// import VueUM from 'vue-umeditor'

Vue.prototype.$moment = moment
Vue.use(VueI18n)
Vue.use(iView)
Vue.use(ElementUI)
// Vue.use(VueUM)
window.vue = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  mounted () {
    this.$store.commit('updateMenulist')
  }
})
