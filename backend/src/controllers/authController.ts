import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/authService'
import { generateToken } from '../utils'
import { UserRole } from '../types'

export class AuthController {
  /**
   * 用户登录
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body

      // 验证用户凭据
      const user = await AuthService.login({ email, password })
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        })
      }

      // 生成JWT token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      })

      res.json({
        success: true,
        data: {
          user,
          token,
          expiresIn: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        },
        message: 'Login successful'
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * 获取当前用户信息
   */
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const user = await AuthService.getUserById(userId)

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        })
      }

      res.json({
        success: true,
        data: user
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * 更新用户信息
   */
  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const { name, avatar, bio } = req.body

      const user = await AuthService.updateUser(userId, {
        name
      })

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        })
      }

      res.json({
        success: true,
        data: user,
        message: 'Profile updated successfully'
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * 修改密码
   */
  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const { currentPassword, newPassword } = req.body

      const success = await AuthService.changePassword(userId, currentPassword, newPassword)

      if (!success) {
        return res.status(400).json({
          success: false,
          error: 'Current password is incorrect'
        })
      }

      res.json({
        success: true,
        message: 'Password changed successfully'
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * 登出（客户端处理，服务端只返回成功消息）
   */
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        success: true,
        message: 'Logout successful'
      })
    } catch (error) {
      next(error)
    }
  }
}
