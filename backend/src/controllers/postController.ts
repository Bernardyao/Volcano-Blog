import { Request, Response, NextFunction } from 'express'
import { PostService } from '../services/postService'
import { PostQuery } from '../types'

export class PostController {
  /**
   * 获取文章列表
   */
  static async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const query: PostQuery = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        search: req.query.search as string,
        category: req.query.category as string,
        published: req.query.published ? req.query.published === 'true' : undefined,
        authorId: req.query.authorId ? parseInt(req.query.authorId as string) : undefined,
        sortBy: (req.query.sortBy as any) || 'createdAt',
        sortOrder: (req.query.sortOrder as any) || 'desc'
      }

      const result = await PostService.getPosts(query)

      res.json({
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
          hasNext: result.hasNext,
          hasPrev: result.hasPrev
        }
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * 根据ID获取文章
   */
  static async getPostById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      const post = await PostService.getPostById(id)

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found'
        })
      }

      res.json({
        success: true,
        data: post
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * 根据slug获取文章
   */
  static async getPostBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug
      const post = await PostService.getPostBySlug(slug)

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found'
        })
      }

      res.json({
        success: true,
        data: post
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * 创建文章
   */
  static async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const authorId = req.user!.userId
      const post = await PostService.createPost(req.body, authorId)

      res.status(201).json({
        success: true,
        data: post,
        message: 'Post created successfully'
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * 更新文章
   */
  static async updatePost(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      const post = await PostService.updatePost(id, req.body)

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found'
        })
      }

      res.json({
        success: true,
        data: post,
        message: 'Post updated successfully'
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * 删除文章
   */
  static async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      const success = await PostService.deletePost(id)

      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Post not found'
        })
      }

      res.json({
        success: true,
        message: 'Post deleted successfully'
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * 发布文章
   */
  static async publishPost(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      const post = await PostService.togglePublished(id, true)

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found'
        })
      }

      res.json({
        success: true,
        data: post,
        message: 'Post published successfully'
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * 取消发布文章
   */
  static async unpublishPost(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      const post = await PostService.togglePublished(id, false)

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found'
        })
      }

      res.json({
        success: true,
        data: post,
        message: 'Post unpublished successfully'
      })
    } catch (error) {
      next(error)
    }
  }
}
