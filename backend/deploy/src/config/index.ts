import dotenv from 'dotenv'

// 加载环境变量
dotenv.config()

export const config = {
  // 服务器配置
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // 数据库配置
  database: {
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/volcano_blog'
  },
  
  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  // CORS配置
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
  },
  
  // 文件上传配置
  upload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  },
  
  // 分页配置
  pagination: {
    defaultLimit: 10,
    maxLimit: 100
  },
  
  // 密码配置
  password: {
    minLength: 6,
    maxLength: 128
  }
}

export default config
