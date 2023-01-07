import { NextFunction, Request, Response } from 'express'
import { ACCESS_TOKEN_COOKIE } from '../modules/auth/types/user'
import * as repository from '../modules/auth/repositories'
import { createAuthUser } from '../modules/auth/services/createAuthUser'

export const userMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken =
    req.headers.authorization?.replace(`Bearer `, '') ||
    req.cookies[ACCESS_TOKEN_COOKIE]

  if (!accessToken) {
    return next()
  }

  try {
    const token = await repository.findAccessToken(accessToken)

    const user = await repository.findUserById(token.userId)
    req.user = await createAuthUser(user)

    next()
  } catch (e) {
    next(e)
  }
}
