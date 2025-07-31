import { PrismaClient } from '@prisma/client'

// 创建Prisma客户端实例
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn'] : ['warn', 'error'],
})

// 优雅关闭处理
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

export default prisma
