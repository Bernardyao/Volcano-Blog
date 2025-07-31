// 基础类型定义
export interface BaseEntity {
  id: number
  createdAt: string
  updatedAt: string
}

// 用户相关类型
export interface User extends BaseEntity {
  name: string
  email: string
  avatar?: string
  bio?: string
}

// 文章相关类型
export interface Post extends BaseEntity {
  title: string
  content: string
  excerpt?: string
  published: boolean
  author: string | User
  authorId?: number
  categories?: Category[]
  category?: string
  featuredImage?: string
  slug?: string
  viewCount?: number
}

// 分类类型
export interface Category extends BaseEntity {
  name: string
  description?: string
  slug: string
  posts?: Post[]
  postCount?: number
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  posts: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// 查询参数类型
export interface PostQuery {
  page?: number
  limit?: number
  category?: string
  search?: string
  published?: boolean
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'viewCount'
  sortOrder?: 'asc' | 'desc'
}

// 表单类型
export interface LoginForm {
  email: string
  password: string
}

export interface PostForm {
  title: string
  content: string
  excerpt?: string
  published: boolean
  categoryId?: number
  categoryIds?: number[]
  featuredImage?: string
}

// 创建和更新文章的数据类型
export interface CreatePostData {
  title: string
  content: string
  excerpt?: string
  published: boolean
  categoryIds?: number[]
  featuredImage?: string
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id?: number
}

// 路由参数类型
export interface RouteParams {
  id?: string
  slug?: string
  page?: string
  category?: string
}

// 组件Props类型
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  disabled?: boolean
}

export interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined'
  hoverable?: boolean
  clickable?: boolean
}

export interface LoadingProps {
  variant?: 'default' | 'large' | 'small'
  text?: string
}

// 状态管理类型
export interface AppState {
  user: User | null
  posts: Post[]
  categories: Category[]
  loading: boolean
  error: string | null
}

export interface UserState {
  currentUser: User | null
  isAuthenticated: boolean
  token: string | null
}

export interface PostState {
  posts: Post[]
  currentPost: Post | null
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
