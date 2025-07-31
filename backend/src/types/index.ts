// 基础类型定义
export interface BaseEntity {
  id: number
  createdAt: Date
  updatedAt: Date
}

// 用户类型定义（与 Prisma schema 匹配）
export interface User {
  id: number
  email: string
  password: string
  name: string | null
  role: string
  createdAt: Date
  updatedAt: Date
}

export type UserWithoutPassword = Omit<User, 'password'>

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

// 文章类型定义（与 Prisma schema 匹配）
export interface Post extends BaseEntity {
  title: string
  content: string | null
  published: boolean
  authorId: number
  slug?: string
  excerpt?: string
  featuredImage?: string
  viewCount?: number
  author?: UserWithoutPassword
  categories?: PostCategory[]
}

// 分类类型定义（与 Prisma schema 匹配）
export interface Category {
  id: number
  name: string
  description?: string
  slug?: string
  posts?: PostCategory[]
}

// 标签类型定义已删除

// 关联表类型
export interface PostCategory {
  postId: number
  categoryId: number
  post?: Post
  category?: Category
}

// PostTag 接口已删除

// API请求/响应类型
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: UserWithoutPassword
  token: string
  expiresIn: number
}

export interface CreatePostRequest {
  title: string
  content: string
  excerpt?: string
  published?: boolean
  featuredImage?: string
  categoryIds?: number[]
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {}

export interface PostQuery {
  page?: number
  limit?: number
  search?: string
  category?: string
  published?: boolean
  authorId?: number
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'viewCount'
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext?: boolean
  hasPrev?: boolean
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// JWT Payload
export interface JwtPayload {
  userId: number
  email: string
  role: UserRole
  iat?: number
  exp?: number
}

// Express Request 扩展
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export {};
