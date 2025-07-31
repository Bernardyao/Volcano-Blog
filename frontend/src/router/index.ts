import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 静态导入主要组件
import Home from '../views/Home.vue'
import PostList from '../views/PostList.vue'
import PostDetail from '../views/PostDetail.vue'
import CategoryPosts from '../views/CategoryPosts.vue'
import About from '../views/About.vue'
import AdminLogin from '../views/admin/Login.vue'
import AdminDashboard from '../views/admin/Dashboard.vue'
import AdminEditor from '../views/admin/Editor.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/posts',
    name: 'PostList',
    component: PostList
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: PostDetail,
    props: true
  },
  {
    path: '/category/:id',
    name: 'CategoryPosts',
    component: CategoryPosts,
    props: true
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/editor/:id?',
    name: 'AdminEditor',
    component: AdminEditor,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // 检查是否已登录
    const token = localStorage.getItem('admin_token')
    if (!token) {
      next('/admin/login')
      return
    }
  }
  next()
})

export default router
