import { createRouter, createWebHistory } from 'vue-router'

// 前台用户端布局
import CustomerLayout from '../layouts/CustomerLayout.vue'
// 后台管理端布局
import AdminLayout from '../layouts/AdminLayout.vue'

// 前台用户端页面
import CustomerHome from '../views/customer/Home.vue'
import CustomerOrderCreate from '../views/customer/OrderCreate.vue'
import CustomerMyOrders from '../views/customer/MyOrders.vue'
import CustomerProfile from '../views/customer/Profile.vue'
import CustomerLogin from '../views/customer/Login.vue'
import CustomerRegister from '../views/customer/Register.vue'

// 后台管理端页面
import AdminDashboard from '../views/admin/Dashboard.vue'
import AdminFruitManage from '../views/admin/FruitManage.vue'
import AdminCustomerManage from '../views/admin/CustomerManage.vue'
import AdminOrderManage from '../views/admin/OrderManage.vue'
import AdminSupplierManage from '../views/admin/SupplierManage.vue'

const routes = [
  // 登录/注册页面（不需要布局）
  { path: '/login', name: 'Login', component: CustomerLogin, meta: { title: '登录', public: true } },
  { path: '/register', name: 'Register', component: CustomerRegister, meta: { title: '注册', public: true } },
  
  {
    path: '/',
    component: CustomerLayout,
    redirect: '/home',
    children: [
      { path: 'home', name: 'CustomerHome', component: CustomerHome, meta: { title: '水果商城' } },
      { path: 'order/create', name: 'OrderCreate', component: CustomerOrderCreate, meta: { title: '下单', requireAuth: true } },
      { path: 'my-orders', name: 'MyOrders', component: CustomerMyOrders, meta: { title: '我的订单', requireAuth: true } },
      { path: 'profile', name: 'Profile', component: CustomerProfile, meta: { title: '个人中心', requireAuth: true } }
    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    redirect: '/admin/dashboard',
    meta: { requireAdmin: true },
    children: [
      { path: 'dashboard', name: 'Dashboard', component: AdminDashboard, meta: { title: '仪表盘', requireAdmin: true } },
      { path: 'fruit', name: 'FruitManage', component: AdminFruitManage, meta: { title: '水果管理', requireAdmin: true } },
      { path: 'customer', name: 'CustomerManage', component: AdminCustomerManage, meta: { title: '顾客管理', requireAdmin: true } },
      { path: 'order', name: 'OrderManage', component: AdminOrderManage, meta: { title: '订单管理', requireAdmin: true } },
      { path: 'supplier', name: 'SupplierManage', component: AdminSupplierManage, meta: { title: '供应商管理', requireAdmin: true } }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 导航守卫 - 登录验证
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null')
  
  // 公开页面直接放行
  if (to.meta.public) {
    return next()
  }
  
  // 需要管理员权限的页面
  if (to.meta.requireAdmin || to.matched.some(r => r.meta.requireAdmin)) {
    if (!user) {
      alert('请先登录')
      return next('/login')
    }
    if (user.role !== 'admin') {
      alert('您没有管理员权限')
      return next('/')
    }
    return next()
  }
  
  // 需要登录的页面
  if (to.meta.requireAuth) {
    if (!user) {
      alert('请先登录')
      return next('/login')
    }
    return next()
  }
  
  next()
})

export default router
