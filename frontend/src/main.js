import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
import Axios from 'axios'
import vueDebounce from 'vue-debounce'
import VueGtag from "vue-gtag"

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.prototype.$http = Axios;

Vue.config.productionTip = false

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.use(vueDebounce, {
  listenTo: 'input'
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
