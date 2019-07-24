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
});
//时间过滤器
//Vue.filter 注册全局过滤器
Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
        //当数值为个位数的时候,补全,因为月份是从0开始所以加1
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')
    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
        //使用模板格式
        //return `yyyy-mm-dd hh:mm:ss` 不知道为什么写成了下面这种~
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}}`

});
//挂载到全局
Vue.component('tree-table', TreeTable)
Vue.prototype.$http = axios
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');