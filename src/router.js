import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login'
import Home from './components/Home.vue'
Vue.use(Router)
Vue.config.productionTip = false

const router = new Router({
    routes: [
        //重定向
        { path: '/', redirect: '/login' },
        //登录
        { path: '/login', component: Login },
        { path: '/home', component: Home }
    ]
});
//挂载导航守卫
router.beforeEach((to, from, next) => {
        //如果是访问登录页面,直接放行
        if (to.path === '/login') return next();
        //根据token来判断用户是否登录
        //1.获取到token值
        const tokenStr = window.sessionStorage.getItem('token')
            //2.判断
        if (!tokenStr) return next('/login')
            //3.都通过,直接放行
        next()
    })
    //暴露出去
export default router;