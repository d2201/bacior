import { AuthUser } from '../types'

declare module 'express' {
  interface Request {
    user?: AuthUser
  }
}

export * from './userMiddleware'
