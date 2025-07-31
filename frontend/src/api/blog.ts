import axios from 'axios'
import type { 
  Post, 
  Category, 
  User, 
  PostQuery, 
  PaginatedResponse, 
  ApiResponse,
  LoginForm,
  PostForm 
} from '@/types'

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:3001',  // 修正端口号
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 如果有token，添加到请求头
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 处理我们的API响应格式: { success: true, data: {...}, message: "..." }
    if (response.data.success) {
      // 如果是分页数据（包含pagination字段），则重新组织数据结构
      if (response.data.pagination) {
        return {
          posts: response.data.data,
          total: response.data.pagination.total,
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
          totalPages: response.data.pagination.totalPages,
          hasNext: response.data.pagination.hasNext,
          hasPrev: response.data.pagination.hasPrev
        }
      }
      // 否则直接返回data字段的内容
      return response.data.data
    } else {
      // 如果success为false，抛出错误
      throw new Error(response.data.error || response.data.message || '请求失败')
    }
  },
  (error) => {
    // 统一错误处理
    if (error.response?.status === 401) {
      // 未授权，清除token并跳转到登录页
      localStorage.removeItem('admin_token')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

// Blog API 模块
export const blogApi = {
  // 文章相关API
  posts: {
    getAll: (query?: PostQuery): Promise<PaginatedResponse<Post>> => 
      api.get('/api/posts', { params: query }),
    
    getById: (id: number): Promise<Post> => 
      api.get(`/api/posts/${id}`),
    
    create: (data: PostForm): Promise<Post> => 
      api.post('/api/posts', data),
    
    update: (id: number, data: Partial<PostForm>): Promise<Post> => 
      api.put(`/api/posts/${id}`, data),
    
    delete: (id: number): Promise<void> => 
      api.delete(`/api/posts/${id}`),
    
    publish: (id: number): Promise<Post> => 
      api.patch(`/api/posts/${id}/publish`),
    
    unpublish: (id: number): Promise<Post> => 
      api.patch(`/api/posts/${id}/unpublish`)
  },

  // 分类相关API
  categories: {
    getAll: (): Promise<Category[]> => 
      api.get('/api/categories'),
    
    getById: (id: number): Promise<Category> => 
      api.get(`/api/categories/${id}`),
    
    create: (data: { name: string; description?: string }): Promise<Category> => 
      api.post('/api/categories', data),
    
    update: (id: number, data: { name?: string; description?: string }): Promise<Category> => 
      api.put(`/api/categories/${id}`, data),
    
    delete: (id: number): Promise<void> => 
      api.delete(`/api/categories/${id}`)
  },

  // 标签相关API已删除

  // 用户相关API
  auth: {
    login: (credentials: LoginForm): Promise<{ user: User; token: string }> => 
      api.post('/api/auth/login', credentials),
    
    logout: (): Promise<void> => 
      api.post('/api/auth/logout'),
    
    me: (): Promise<User> => 
      api.get('/api/auth/me'),
    
    refresh: (): Promise<{ token: string }> => 
      api.post('/api/auth/refresh')
  },

  // 用户管理API
  users: {
    getProfile: (): Promise<User> => 
      api.get('/api/users/profile'),
    
    updateProfile: (data: Partial<User>): Promise<User> => 
      api.put('/api/users/profile', data),
    
    changePassword: (data: { currentPassword: string; newPassword: string }): Promise<void> => 
      api.put('/api/users/password', data)
  }
}

export default api
