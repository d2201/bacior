import { Request, Response } from 'express'
import { User } from './modules/auth/types/user'
import { OAuthClient } from './modules/auth/utils'

export type ControllerFunction = (req: Request, res: Response) => Promise<void>

export type AuthUser = {
  me: User
  authClient: OAuthClient
}
