const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  console.log('======== Volcano 博客管理员创建工具 ========');
  
  rl.question('请输入管理员邮箱: ', async (email) => {
    rl.question('请输入管理员密码: ', async (password) => {
      rl.question('请输入管理员名称: ', async (name) => {
        try {
          // 检查邮箱是否已存在
          const existingUser = await prisma.user.findUnique({
            where: { email }
          });
          
          if (existingUser) {
            console.log(`错误: 邮箱 ${email} 已被使用`);
            rl.close();
            return;
          }
          
          // 创建新管理员用户
          const hashedPassword = await bcrypt.hash(password, 10);
          const user = await prisma.user.create({
            data: {
              email,
              password: hashedPassword,
              name,
              role: 'ADMIN'
            }
          });
          
          console.log('✅ 管理员创建成功!');
          console.log(`邮箱: ${user.email}`);
          console.log(`名称: ${user.name}`);
          console.log(`角色: ${user.role}`);
        } catch (error) {
          console.error('创建管理员时出错:', error);
        } finally {
          await prisma.$disconnect();
          rl.close();
        }
      });
    });
  });
}

main();