import { Request, Response } from 'express'
import { User } from './auth/types/user'
import { OAuthClient } from './auth/utils'

export type ControllerFunction = (req: Request, res: Response) => Promise<void>

export type AuthUser = {
  me: User
  authClient: OAuthClient
}
