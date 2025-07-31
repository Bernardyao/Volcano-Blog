import { Router } from 'express'
import { body } from 'express-validator'
import { AuthController } from '../controllers/authController'
import { validateRequest } from '../middleware/validation'
import { authenticateToken } from '../middleware/auth'

const router = Router()

/**
 * @route POST /api/auth/login
 * @desc 用户登录
 * @access Public
 */
router.post('/login', 
  validateRequest([
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ]),
  AuthController.login
)

/**
 * @route GET /api/auth/me
 * @desc 获取当前用户信息
 * @access Private
 */
router.get('/me', authenticateToken, AuthController.getMe)

/**
 * @route PUT /api/auth/profile
 * @desc 更新用户信息
 * @access Private
 */
router.put('/profile',
  authenticateToken,
  validateRequest([
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('avatar')
      .optional()
      .isURL()
      .withMessage('Avatar must be a valid URL'),
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Bio must not exceed 500 characters')
  ]),
  AuthController.updateProfile
)

/**
 * @route PUT /api/auth/password
 * @desc 修改密码
 * @access Private
 */
router.put('/password',
  authenticateToken,
  validateRequest([
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
  ]),
  AuthController.changePassword
)

/**
 * @route POST /api/auth/logout
 * @desc 用户登出
 * @access Private
 */
router.post('/logout', authenticateToken, AuthController.logout)

export default router
