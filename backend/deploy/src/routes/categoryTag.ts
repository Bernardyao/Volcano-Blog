import { Router } from 'express'
import { body } from 'express-validator'
import { CategoryController } from '../controllers/categoryTagController'
import { validateRequest } from '../middleware/validation'
import { authenticateToken, requireAdmin } from '../middleware/auth'

const router = Router()

// ==================== 分类路由 ====================

/**
 * @route GET /api/categories
 * @desc 获取所有分类
 * @access Public
 */
router.get('/categories', CategoryController.getCategories)

/**
 * @route GET /api/categories/:id
 * @desc 根据ID获取分类
 * @access Public
 */
router.get('/categories/:id(\\d+)', CategoryController.getCategoryById)

/**
 * @route POST /api/categories
 * @desc 创建分类
 * @access Private (Admin only)
 */
router.post('/categories',
  authenticateToken,
  requireAdmin,
  validateRequest([
    body('name')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Category name must be between 1 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must not exceed 500 characters')
  ]),
  CategoryController.createCategory
)

/**
 * @route PUT /api/categories/:id
 * @desc 更新分类
 * @access Private (Admin only)
 */
router.put('/categories/:id',
  authenticateToken,
  requireAdmin,
  validateRequest([
    body('name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Category name must be between 1 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must not exceed 500 characters')
  ]),
  CategoryController.updateCategory
)

/**
 * @route DELETE /api/categories/:id
 * @desc 删除分类
 * @access Private (Admin only)
 */
router.delete('/categories/:id',
  authenticateToken,
  requireAdmin,
  CategoryController.deleteCategory
)

export default router
