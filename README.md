# Volcano 博客系统

Volcano是一个现代化的博客平台，采用前后端分离架构，提供文章发布、分类管理、标签系统和用户认证等功能。

## 技术栈

### 前端
- Vue 3
- TypeScript
- Vite
- Vue Router
- Axios
- TailwindCSS

### 后端
- Node.js
- Express
- TypeScript
- Prisma ORM
- MySQL
- JWT认证

## 项目结构

```
volcano/
├── frontend/               # 前端Vue应用
│   ├── src/                # 源代码
│   │   ├── api/            # API客户端
│   │   ├── assets/         # 静态资源
│   │   ├── components/     # Vue组件
│   │   ├── router/         # 路由配置
│   │   ├── store/          # 状态管理
│   │   └── views/          # 页面视图
│   └── deploy/             # 部署相关文件
│
└── backend/                # 后端Express应用
    ├── src/                # 源代码
    │   ├── config/         # 配置文件
    │   ├── controllers/    # 控制器
    │   ├── middleware/     # 中间件
    │   ├── routes/         # 路由定义
    │   └── services/       # 业务服务
    ├── prisma/             # Prisma模型和迁移
    └── scripts/            # 实用脚本
```

## 功能特性

- 响应式设计，支持移动设备
- 文章CRUD操作
- 分类和标签管理
- 用户认证与授权
- 管理员仪表板
- Markdown支持
- 评论系统
- 搜索功能

## 安装与运行

### 前提条件
- Node.js v16+
- MySQL 8.0+
- Git

### 后端设置

1. 克隆仓库:
   ```bash
   git clone https://github.com/Bernardyao/Volcano-Blog.git
   cd Volcano-Blog/backend
   ```

2. 安装依赖:
   ```bash
   npm install
   ```

3. 配置环境变量:
   ```bash
   cp .env.example .env
   # 编辑.env文件设置数据库连接等
   ```

4. 设置数据库:
   ```bash
   npx prisma migrate dev
   ```

5. 创建管理员账户:
   ```bash
   node scripts/create-admin.js
   ```

6. 启动开发服务器:
   ```bash
   npm run dev
   ```

### 前端设置

1. 进入前端目录:
   ```bash
   cd ../frontend
   ```

2. 安装依赖:
   ```bash
   npm install
   ```

3. 配置环境变量:
   ```bash
   cp .env.example .env.local
   # 编辑.env.local设置API URL
   ```

4. 启动开发服务器:
   ```bash
   npm run dev
   ```

## 部署指南

### 后端部署
1. 构建项目:
   ```bash
   cd backend
   npm run build
   ```

2. 在服务器上设置环境变量

3. 启动服务:
   ```bash
   npm start
   ```

### 前端部署
1. 构建项目:
   ```bash
   cd frontend
   npm run build
   ```

2. 将`dist`目录部署到Web服务器

## 贡献指南

1. Fork项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

[MIT](LICENSE)
