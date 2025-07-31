import { Router } from 'express'
import { body } from 'express-validator'
import { PostController } from '../controllers/postController'
import { validateRequest } from '../middleware/validation'
import { authenticateToken, requireAdmin } from '../middleware/auth'

const router = Router()

/**
 * @route GET /api/posts
 * @desc 获取文章列表
 * @access Public
 */
router.get('/', PostController.getPosts)

/**
 * @route GET /api/posts/:id
 * @desc 根据ID获取文章
 * @access Public
 */
router.get('/:id(\\d+)', PostController.getPostById)

/**
 * @route GET /api/posts/slug/:slug
 * @desc 根据slug获取文章
 * @access Public
 */
router.get('/slug/:slug', PostController.getPostBySlug)

/**
 * @route POST /api/posts
 * @desc 创建文章
 * @access Private (Admin only)
 */
router.post('/',
  authenticateToken,
  requireAdmin,
  validateRequest([
    body('title')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    body('content')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Content is required'),
    body('excerpt')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Excerpt must not exceed 500 characters'),
    body('published')
      .optional()
      .isBoolean()
      .withMessage('Published must be a boolean'),
    body('featuredImage')
      .optional()
      .isURL()
      .withMessage('Featured image must be a valid URL'),
    body('categoryIds')
      .optional()
      .isArray()
      .withMessage('Category IDs must be an array'),
    body('categoryIds.*')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Each category ID must be a positive integer')
  ]),
  PostController.createPost
)

/**
 * @route PUT /api/posts/:id
 * @desc 更新文章
 * @access Private (Admin only)
 */
router.put('/:id',
  authenticateToken,
  requireAdmin,
  validateRequest([
    body('title')
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    body('content')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('Content cannot be empty'),
    body('excerpt')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Excerpt must not exceed 500 characters'),
    body('published')
      .optional()
      .isBoolean()
      .withMessage('Published must be a boolean'),
    body('featuredImage')
      .optional()
      .isURL()
      .withMessage('Featured image must be a valid URL'),
    body('categoryIds')
      .optional()
      .isArray()
      .withMessage('Category IDs must be an array'),
    body('categoryIds.*')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Each category ID must be a positive integer')
  ]),
  PostController.updatePost
)

/**
 * @route DELETE /api/posts/:id
 * @desc 删除文章
 * @access Private (Admin only)
 */
router.delete('/:id',
  authenticateToken,
  requireAdmin,
  PostController.deletePost
)

/**
 * @route PATCH /api/posts/:id/publish
 * @desc 发布文章
 * @access Private (Admin only)
 */
router.patch('/:id/publish',
  authenticateToken,
  requireAdmin,
  PostController.publishPost
)

/**
 * @route PATCH /api/posts/:id/unpublish
 * @desc 取消发布文章
 * @access Private (Admin only)
 */
router.patch('/:id/unpublish',
  authenticateToken,
  requireAdmin,
  PostController.unpublishPost
)

export default router
