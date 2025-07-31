import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JwtPayload, UserRole } from '../types'
import config from '../config'

/**
 * 生成密码哈希
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

/**
 * 验证密码
 * 支持明文密码和加密密码
 */
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  // 如果存储的是明文密码（长度较短且不包含bcrypt特征）
  if (hashedPassword.length < 30 && !hashedPassword.startsWith('$2')) {
    return password === hashedPassword
  }
  
  // 否则使用bcrypt验证
  return bcrypt.compare(password, hashedPassword)
}

/**
 * 生成JWT Token
 */
export const generateToken = (payload: { userId: number; email: string; role: string }): string => {
  return (jwt as any).sign(payload, config.jwt.secret, { expiresIn: '7d' })
}

/**
 * 验证JWT Token
 */
export const verifyToken = (token: string): JwtPayload => {
  return (jwt as any).verify(token, config.jwt.secret) as JwtPayload
}

/**
 * 生成URL友好的slug
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 替换空格和下划线为连字符
    .replace(/^-+|-+$/g, '') // 移除开头和结尾的连字符
}

/**
 * 生成唯一slug（如果重复则添加数字后缀）
 */
export const generateUniqueSlug = async (
  text: string, 
  checkExistence: (slug: string) => Promise<boolean>
): Promise<string> => {
  let baseSlug = generateSlug(text)
  let slug = baseSlug
  let counter = 1

  while (await checkExistence(slug)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

/**
 * 生成文章摘要
 */
export const generateExcerpt = (content: string, maxLength: number = 160): string => {
  // 移除Markdown语法
  const plainText = content
    .replace(/[#*`_~\[\]]/g, '') // 移除markdown符号
    .replace(/\n+/g, ' ') // 替换换行为空格
    .trim()

  if (plainText.length <= maxLength) {
    return plainText
  }

  // 在单词边界截断
  const truncated = plainText.substr(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  return lastSpace > 0 
    ? truncated.substr(0, lastSpace) + '...'
    : truncated + '...'
}

/**
 * 分页计算
 */
export const calculatePagination = (page: number = 1, limit: number = 10) => {
  const normalizedPage = Math.max(1, page)
  const normalizedLimit = Math.min(Math.max(1, limit), config.pagination.maxLimit)
  const skip = (normalizedPage - 1) * normalizedLimit

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    skip,
    take: normalizedLimit
  }
}

/**
 * 格式化分页响应
 */
export const formatPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) => {
  const totalPages = Math.ceil(total / limit)
  
  return {
    data,
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  }
}

/**
 * 排除对象中的字段
 */
export const exclude = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}
