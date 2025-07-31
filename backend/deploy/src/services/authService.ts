import prisma from './database'
import { UserWithoutPassword, LoginRequest, UserRole } from '../types'
import { hashPassword, verifyPassword, exclude } from '../utils'

export class AuthService {
  /**
   * 用户登录
   */
  static async login(credentials: LoginRequest): Promise<UserWithoutPassword | null> {
    const { email, password } = credentials

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return null
    }

    // 验证密码
    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return null
    }

    // 排除密码字段
    return exclude(user, ['password'])
  }

  /**
   * 创建用户（注册）
   */
  static async createUser(data: {
    email: string
    password: string
    name: string
    role?: UserRole
  }): Promise<UserWithoutPassword> {
    const { email, password, name, role = UserRole.USER } = data

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw new Error('Email already exists')
    }

    // 哈希密码
    const hashedPassword = await hashPassword(password)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role
      }
    })

    // 排除密码字段
    return exclude(user, ['password'])
  }

  /**
   * 根据ID获取用户信息
   */
  static async getUserById(id: number): Promise<UserWithoutPassword | null> {
    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      return null
    }

    return exclude(user, ['password'])
  }

  /**
   * 更新用户信息
   */
  static async updateUser(
    id: number, 
    data: Partial<Pick<UserWithoutPassword, 'name'>>
  ): Promise<UserWithoutPassword | null> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data
      })

      return exclude(user, ['password'])
    } catch (error) {
      return null
    }
  }

  /**
   * 修改密码
   */
  static async changePassword(
    id: number, 
    currentPassword: string, 
    newPassword: string
  ): Promise<boolean> {
    // 获取用户当前信息
    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      return false
    }

    // 验证当前密码
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return false
    }

    // 哈希新密码
    const hashedNewPassword = await hashPassword(newPassword)

    // 更新密码
    try {
      await prisma.user.update({
        where: { id },
        data: { password: hashedNewPassword }
      })
      return true
    } catch (error) {
      return false
    }
  }
}
