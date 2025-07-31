FROM node:20-alpine

WORKDIR /app

# 复制项目文件
COPY ../package*.json ./
COPY ../prisma ./prisma/
COPY ../.env.example ./.env
COPY ../tsconfig.json ./
COPY ../src ./src/

# 安装依赖
RUN npm install --production
RUN npx prisma generate

# 编译TypeScript
RUN npm install -g typescript
RUN tsc

# 暴露端口
EXPOSE 3001

# 启动应用
CMD ["node", "dist/index.js"]
