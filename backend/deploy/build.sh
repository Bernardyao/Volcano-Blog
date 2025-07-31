#!/bin/bash
# 编译TypeScript代码并准备生产环境

# 移动到backend根目录
cd ..

echo "=== 开始编译TypeScript代码 ==="
# 安装TypeScript (如果需要)
if ! command -v tsc &> /dev/null
then
    echo "正在安装TypeScript..."
    npm install -g typescript
fi

# 编译TypeScript
echo "编译中..."
tsc

# 创建dist目录的软链接
if [ -d "dist" ]; then
    echo "dist目录已存在"
else
    echo "创建dist目录..."
    mkdir -p dist
fi

echo "=== 编译完成 ==="
echo "您可以使用 'npm start' 或 'node dist/index.js' 启动服务器"
