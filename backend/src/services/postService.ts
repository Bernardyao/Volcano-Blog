import prisma from './database'

export class PostService {
  /**
   * 获取文章列表
   */
  static async getPosts(query: any = {}) {
    const { page = 1, limit = 10, search, category, published, authorId } = query
    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}

    if (published !== undefined) {
      where.published = published
    }

    if (authorId) {
      where.authorId = authorId
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category) {
      where.categories = {
        some: {
          name: category
        }
      }
    }

    try {
      // 获取文章列表
      const posts = await prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          categories: true
        }
      })

      // 获取总数
      const total = await prisma.post.count({ where })

      return {
        data: posts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    } catch (error) {
      throw new Error(`Failed to fetch posts: ${error}`)
    }
  }

  /**
   * 根据ID获取文章
   */
  static async getPostById(id: number) {
    try {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          categories: true
        }
      })

      return post
    } catch (error) {
      return null
    }
  }

  /**
   * 根据slug获取文章
   */
  static async getPostBySlug(slug: string) {
    try {
      const post = await prisma.post.findFirst({
        where: { title: { contains: slug } },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          categories: true
        }
      })

      return post
    } catch (error) {
      return null
    }
  }

  /**
   * 创建文章
   */
  static async createPost(data: any, authorId: number) {
    const { title, content, published = false, categoryIds = [] } = data

    try {
      const post = await prisma.post.create({
        data: {
          title,
          content,
          published,
          authorId,
          categories: {
            connect: categoryIds.map((id: number) => ({ id }))
          }
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          categories: true
        }
      })

      return post
    } catch (error) {
      throw new Error(`Failed to create post: ${error}`)
    }
  }

  /**
   * 更新文章
   */
  static async updatePost(id: number, data: any) {
    const { title, content, published, categoryIds } = data

    try {
      const updateData: any = {}
      
      if (title !== undefined) updateData.title = title
      if (content !== undefined) updateData.content = content
      if (published !== undefined) updateData.published = published

      // 处理分类关联
      if (categoryIds !== undefined) {
        updateData.categories = {
          set: categoryIds.map((id: number) => ({ id }))
        }
      }

      // 执行更新
      const post = await prisma.post.update({
        where: { id },
        data: updateData,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          categories: true
        }
      })

      return post
    } catch (error) {
      return null
    }
  }

  /**
   * 删除文章
   */
  static async deletePost(id: number) {
    try {
      await prisma.post.delete({ 
        where: { id }
      })
      
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * 发布/取消发布文章
   */
  static async togglePublished(id: number, published: boolean) {
    try {
      const post = await prisma.post.update({
        where: { id },
        data: { published },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          categories: true
        }
      })

      return post
    } catch (error) {
      return null
    }
  }
}