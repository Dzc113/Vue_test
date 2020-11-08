import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
// 配置根目录
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
// axios请求拦截
axios.interceptors.request.use(config => {
// 为请求头对象添加Authorization字段，用来进行权限校验
  console.log(JSON.stringify(config) + 'is config')
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.config.productionTip = false
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
