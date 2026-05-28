import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PackagesView from '../views/PackagesView.vue'
import PackageDetailView from '../views/PackageDetailView.vue'
import CartView from '../views/CartView.vue'
import BlogView from '../views/BlogView.vue'
import BlogDetailView from '../views/BlogDetailView.vue'
import AdminLogin from '../views/admin/AdminLogin.vue'
import AdminLayout from '../views/admin/AdminLayout.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AdminPackages from '../views/admin/AdminPackages.vue'
import AdminOrders from '../views/admin/AdminOrders.vue'
import AdminBlog from '../views/admin/AdminBlog.vue'

const routes = [
  // PUBLIC
  { path: '/', name: 'home', component: HomeView },
  { path: '/packages', name: 'packages', component: PackagesView },
  { path: '/packages/:slug', name: 'package-detail', component: PackageDetailView },
  { path: '/cart', name: 'cart', component: CartView },

  { path: '/blog', name: 'blog', component: BlogView },
  { path: '/blog/:slug', name: 'blog-detail', component: BlogDetailView },

  // ADMIN
  { path: '/admin', name: 'admin-login', component: AdminLogin },
  {
    path: '/admin/panel',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'admin-dashboard', component: AdminDashboard },
      { path: 'packages', name: 'admin-packages', component: AdminPackages },
      { path: 'orders', name: 'admin-orders', component: AdminOrders },
      { path: 'blog', name: 'admin-blog', component: AdminBlog },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard: redirect ke login kalau belum auth
router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('admin_token')
    if (!token) return { name: 'admin-login' }
  }
})

export default router
