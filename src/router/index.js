import { createRouter, createWebHistory } from 'vue-router'

// 前台用户端布局
import CustomerLayout from '../layouts/CustomerLayout.vue'
// 后台管理端布局
import AdminLayout from '../layouts/AdminLayout.vue'

// 前台用户端页面
import CustomerHome from '../views/customer/Home.vue'
import CustomerOrderCreate from '../views/customer/OrderCreate.vue'
import CustomerMyOrders from '../views/customer/MyOrders.vue'

// 后台管理端页面
import AdminDashboard from '../views/admin/Dashboard.vue'
import AdminFruitManage from '../views/admin/FruitManage.vue'
import AdminCustomerManage from '../views/admin/CustomerManage.vue'
import AdminOrderManage from '../views/admin/OrderManage.vue'
import AdminSupplierManage from '../views/admin/SupplierManage.vue'

const routes = [
  {
    path: '/',
    component: CustomerLayout,
    redirect: '/home',
    children: [
      { path: 'home', name: 'CustomerHome', component: CustomerHome, meta: { title: '水果商城' } },
      { path: 'order/create', name: 'OrderCreate', component: CustomerOrderCreate, meta: { title: '下单' } },
      { path: 'my-orders', name: 'MyOrders', component: CustomerMyOrders, meta: { title: '我的订单' } }
    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    redirect: '/admin/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: AdminDashboard, meta: { title: '仪表盘' } },
      { path: 'fruit', name: 'FruitManage', component: AdminFruitManage, meta: { title: '水果管理' } },
      { path: 'customer', name: 'CustomerManage', component: AdminCustomerManage, meta: { title: '顾客管理' } },
      { path: 'order', name: 'OrderManage', component: AdminOrderManage, meta: { title: '订单管理' } },
      { path: 'supplier', name: 'SupplierManage', component: AdminSupplierManage, meta: { title: '供应商管理' } }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
