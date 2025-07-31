import prisma from './database'

export class CategoryService {
  /**
   * 获取所有分类
   */
  static async getCategories() {
    const categories = await prisma.category.findMany({
      include: {
        posts: {
          select: {
            id: true,
            title: true,
            published: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return categories
  }

  /**
   * 根据ID获取分类
   */
  static async getCategoryById(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        posts: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    return category
  }

  /**
   * 创建分类
   */
  static async createCategory(data: { name: string }) {
    const { name } = data

    // 检查分类名是否已存在
    const existing = await prisma.category.findUnique({ where: { name } })
    if (existing) {
      throw new Error('Category name already exists')
    }

    const category = await prisma.category.create({
      data: {
        name
      }
    })

    return category
  }

  /**
   * 更新分类
   */
  static async updateCategory(id: number, data: { name?: string }) {
    const { name } = data

    // 如果更新名称，检查是否与其他分类重复
    if (name) {
      const existing = await prisma.category.findFirst({
        where: { name, id: { not: id } }
      })
      if (existing) {
        throw new Error('Category name already exists')
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name
      }
    })

    return category
  }

  /**
   * 删除分类
   */
  static async deleteCategory(id: number): Promise<boolean> {
    try {
      // 在 Prisma 中，多对多关系会自动处理，直接删除分类即可
      await prisma.category.delete({ where: { id } })
      return true
    } catch (error) {
      return false
    }
  }
}
