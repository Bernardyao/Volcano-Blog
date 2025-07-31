import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import dotenv from 'dotenv'

// 导入路由 - 修复编码问题
import authRoutes from './routes/auth'
import postRoutes from './routes/posts'
import categoryTagRoutes from './routes/categoryTag'

// 加载环境变量
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// 基础中间件
app.use(helmet())
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'], // 包含新端口
  credentials: true
}))
app.use(compression())
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 健康检查路由
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// 根路由
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🌋 Volcano Blog Backend API',
    version: '1.0.0',
    documentation: '/api',
    health: '/health',
    environment: process.env.NODE_ENV || 'development'
  })
})

// 简单的API测试路由
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString()
  })
})

// API 路由
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api', categoryTagRoutes) // 包含 /categories

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  })
})

// 错误处理中间件
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error)
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  })
})

// 启动服务器
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
  console.log(`📝 API test: http://localhost:${PORT}/api/test`)
  console.log(`🏥 Health check: http://localhost:${PORT}/health`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})

// 优雅关闭处理
const gracefulShutdown = (signal: string) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`)
  
  server.close(() => {
    console.log('✅ HTTP server closed')
    process.exit(0)
  })
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

export default app
