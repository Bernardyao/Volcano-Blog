import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { JwtPayload } from '../types'
import config from '../config'

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    })
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token'
    })
  }
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    })
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required'
    })
  }

  next()
}
