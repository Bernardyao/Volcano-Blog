import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error)

  // Prisma错误处理
  if (error.code === 'P2002') {
    return res.status(400).json({
      success: false,
      error: 'Duplicate entry. This record already exists.'
    })
  }

  if (error.code === 'P2025') {
    return res.status(404).json({
      success: false,
      error: 'Record not found.'
    })
  }

  // JWT错误处理
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    })
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired'
    })
  }

  // 默认错误处理
  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  })
}

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  })
}
