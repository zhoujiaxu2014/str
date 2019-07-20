import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    //请求权限
axios.interceptors.request.use(config => {
        // console.log(config)
        config.headers.Authorization = window.sessionStorage.getItem('token')
            // 在最后必须 return config
        return config
    })
    //挂载到全局
Vue.component('tree-table', TreeTable)
Vue.prototype.$http = axios
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');