import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import welcome from '../components/welcome.vue'
import user from '../components/user/user.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/Login' },
  { path: '/Login', component: Login },
  {
    path: '/Home', 
    component: Home, 
    redirect:'/welcome',
    children: [ { path: '/welcome', component: welcome },
                {path: '/users',component:user}     
              ]
  }

]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //  to将要访问的路径
  // From 代表从哪个路径跳转
  // next函数代表放行 
  // next() 放行  next('/login') 强制跳转

  if (to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login')
  next()

})

export default router
