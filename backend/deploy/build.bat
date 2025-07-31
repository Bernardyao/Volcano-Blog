@echo off
:: 编译TypeScript代码并准备生产环境

:: 移动到backend根目录
cd ..

echo === 开始编译TypeScript代码 ===
:: 检查是否安装了TypeScript
where tsc >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo 正在安装TypeScript...
    npm install -g typescript
)

:: 编译TypeScript
echo 编译中...
call tsc

:: 创建dist目录
if not exist "dist" (
    echo 创建dist目录...
    mkdir dist
)

echo === 编译完成 ===
echo 您可以使用 'npm start' 或 'node dist/index.js' 启动服务器
