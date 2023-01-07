import { getDb } from '../../libs/db/connect'
import { UserAccessToken } from '../types/user'
import { NotFoundFailure } from '../../utils/failures'

const collection = () => getDb().collection<UserAccessToken>('user.tokens')

export const findUserAccessTokens = async (
  userId: string
): Promise<UserAccessToken[]> => {
  return collection().find({ userId }).toArray()
}

export const createAccessTokenForUser = async (
  userId: string,
  accessToken: string
): Promise<UserAccessToken> => {
  const token: UserAccessToken = {
    userId,
    accessToken,
  }

  await collection().insertOne(token)

  return token
}

export const findAccessToken = async (
  token: string
): Promise<UserAccessToken> => {
  const result = await collection().findOne({ accessToken: token })

  if (!result) {
    throw new NotFoundFailure('Access token does not exist')
  }

  return result
}
