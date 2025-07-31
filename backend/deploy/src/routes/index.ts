import { Router } from 'express'
import authRoutes from './auth'
import postRoutes from './posts'
import categoryTagRoutes from './categoryTag'

const router = Router()

// API路由
router.use('/auth', authRoutes)
router.use('/posts', postRoutes)
router.use('/', categoryTagRoutes) // 包含 /categories

// 健康检查路由
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// API根路径
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Volcano Blog API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      posts: '/api/posts',
      categories: '/api/categories',
      health: '/api/health'
    }
  })
})

export default router
