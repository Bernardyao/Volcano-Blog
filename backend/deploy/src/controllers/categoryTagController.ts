import { Request, Response, NextFunction } from 'express'
import { CategoryService } from '../services/categoryTagService'

export class CategoryController {
  /**
   * 获取所有分类
   */
  static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryService.getCategories()

      res.json({
        success: true,
        data: categories
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * 根据ID获取分类
   */
  static async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      const category = await CategoryService.getCategoryById(id)

      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Category not found'
        })
      }

      res.json({
        success: true,
        data: category
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * 创建分类
   */
  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryService.createCategory(req.body)

      res.status(201).json({
        success: true,
        data: category,
        message: 'Category created successfully'
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * 更新分类
   */
  static async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      const category = await CategoryService.updateCategory(id, req.body)

      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Category not found'
        })
      }

      res.json({
        success: true,
        data: category,
        message: 'Category updated successfully'
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * 删除分类
   */
  static async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      const success = await CategoryService.deleteCategory(id)

      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Category not found'
        })
      }

      res.json({
        success: true,
        message: 'Category deleted successfully'
      })
    } catch (error) {
      next(error)
    }
  }
}
