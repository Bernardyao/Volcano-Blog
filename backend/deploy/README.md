# Volcano 博客后端

## 部署方式一: 传统部署

1. 将此目录上传到服务器
2. 编辑 `.env` 文件，填入正确的数据库URL和JWT密钥
3. 安装依赖: `npm install --production`
4. 生成Prisma客户端: `npx prisma generate`
5. 迁移数据库: `npx prisma migrate deploy` (如果需要)
6. 启动服务器: `npm start` 或 `node dist/index.js` (如果已编译TypeScript)

## 部署方式二: 使用Docker

1. 编辑 `.env` 文件，填入正确的数据库URL和JWT密钥
2. 使用Docker Compose启动服务:
   ```
   docker-compose up -d
   ```
   
   或者直接使用Dockerfile构建和运行:
   ```
   docker build -t volcano-backend .
   docker run -p 3001:3001 --env-file .env -d volcano-backend
   ```

## 目录结构
- `/src`: 源代码
- `/prisma`: 数据库模型和迁移
- `/node_modules`: 依赖模块 (通过 npm install 生成)
- `/Dockerfile`: Docker容器配置
- `/docker-compose.yml`: Docker Compose配置

## 环境变量
- `DATABASE_URL`: 数据库连接URL
- `JWT_SECRET`: JWT令牌签名密钥
- `PORT`: 服务器运行端口 (默认3001)
- `NODE_ENV`: 运行环境 (production/development)

## 安全注意事项
1. 确保生产环境中使用强密码和复杂的JWT密钥
2. 设置适当的数据库用户权限
3. 使用HTTPS确保API通信安全
4. 定期备份数据库
