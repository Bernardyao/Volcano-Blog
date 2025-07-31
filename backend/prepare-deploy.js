/**
 * 准备部署脚本 - 清理不需要的文件并准备部署环境
 */
const fs = require('fs');
const path = require('path');

// 要删除的文件列表
const filesToRemove = [
  'check-passwords.js',
  'check-user-roles.js',
  'check-users.js',
  'check-users.ts',
  'create-admin.js',
  'debug-login.js',
  'list-users.js',
  'reset-password.js',
  'test-api.js',
  'test-login.js',
  'prepare-deploy.js', // 最后删除这个脚本自身
  'PROJECT-STRUCTURE.md'
];

// 要删除的目录
const dirsToRemove = [
  'temp'
];

// 确保目标目录存在
const deployDir = path.join(__dirname, 'deploy');
if (!fs.existsSync(deployDir)) {
  fs.mkdirSync(deployDir, { recursive: true });
}

// 1. 复制必要文件到deploy目录
console.log('🚀 开始准备部署...');

// 复制src目录
console.log('📂 复制src目录...');
fs.cpSync(path.join(__dirname, 'src'), path.join(deployDir, 'src'), { recursive: true });

// 删除不必要的源文件
console.log('🗑️ 删除不必要的源文件...');
const srcFilesToRemove = [
  'fixed-server.js',
  'quick-server.js',
  'simple-index.ts'
];

srcFilesToRemove.forEach(file => {
  const filePath = path.join(deployDir, 'src', file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`   删除: ${file}`);
  }
});

// 复制prisma目录
console.log('📂 复制prisma目录...');
fs.cpSync(path.join(__dirname, 'prisma'), path.join(deployDir, 'prisma'), { recursive: true });

// 复制配置文件
console.log('📄 复制配置文件...');
const configFiles = ['package.json', 'package-lock.json', 'tsconfig.json', '.env.example'];
configFiles.forEach(file => {
  fs.copyFileSync(path.join(__dirname, file), path.join(deployDir, file));
});

// 创建新的.env文件 (基于.env.example)
console.log('⚙️ 创建生产环境配置...');
const envExample = fs.readFileSync(path.join(__dirname, '.env.example'), 'utf8');
// 将示例配置转换为生产配置
let prodEnv = envExample
  .replace(/DATABASE_URL=.*/, 'DATABASE_URL="YOUR_PRODUCTION_DB_URL"')
  .replace(/JWT_SECRET=.*/, 'JWT_SECRET="CHANGE_THIS_TO_A_SECURE_RANDOM_STRING"')
  .replace(/PORT=.*/, 'PORT=3001')
  .replace(/NODE_ENV=.*/, 'NODE_ENV=production');

fs.writeFileSync(path.join(deployDir, '.env'), prodEnv);

// 创建README.md文件
console.log('📝 创建部署说明...');
const readme = `# Volcano 博客后端

## 部署方式一: 传统部署

1. 将此目录上传到服务器
2. 编辑 \`.env\` 文件，填入正确的数据库URL和JWT密钥
3. 安装依赖: \`npm install --production\`
4. 生成Prisma客户端: \`npx prisma generate\`
5. 迁移数据库: \`npx prisma migrate deploy\` (如果需要)
6. 启动服务器: \`npm start\` 或 \`node dist/index.js\` (如果已编译TypeScript)

## 部署方式二: 使用Docker

1. 编辑 \`.env\` 文件，填入正确的数据库URL和JWT密钥
2. 使用Docker Compose启动服务:
   \`\`\`
   docker-compose up -d
   \`\`\`
   
   或者直接使用Dockerfile构建和运行:
   \`\`\`
   docker build -t volcano-backend .
   docker run -p 3001:3001 --env-file .env -d volcano-backend
   \`\`\`

## 目录结构
- \`/src\`: 源代码
- \`/prisma\`: 数据库模型和迁移
- \`/node_modules\`: 依赖模块 (通过 npm install 生成)
- \`/Dockerfile\`: Docker容器配置
- \`/docker-compose.yml\`: Docker Compose配置

## 环境变量
- \`DATABASE_URL\`: 数据库连接URL
- \`JWT_SECRET\`: JWT令牌签名密钥
- \`PORT\`: 服务器运行端口 (默认3001)
- \`NODE_ENV\`: 运行环境 (production/development)

## 安全注意事项
1. 确保生产环境中使用强密码和复杂的JWT密钥
2. 设置适当的数据库用户权限
3. 使用HTTPS确保API通信安全
4. 定期备份数据库
`;

fs.writeFileSync(path.join(deployDir, 'README.md'), readme);

// 创建启动脚本
console.log('🚀 创建启动脚本...');
const startScript = `#!/bin/bash
# 启动Volcano博客后端服务

# 加载环境变量
source .env

# 启动服务器
npm start
`;

fs.writeFileSync(path.join(deployDir, 'start.sh'), startScript);
// Windows启动脚本
const winStartScript = `@echo off
:: 启动Volcano博客后端服务
echo 正在启动Volcano博客后端...
npm start
`;
fs.writeFileSync(path.join(deployDir, 'start.bat'), winStartScript);

console.log('✅ 部署文件已准备完成，请在deploy目录中查看!');
console.log('   请记得在部署前配置.env文件中的数据库URL和JWT密钥');
