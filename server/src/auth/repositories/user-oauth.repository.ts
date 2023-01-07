import { getDb } from '../../db/connect'
import { UserOauthToken } from '../types/user'
import { Credentials } from 'google-auth-library'
import { Failure, NotFoundFailure } from '../../utils/failures'

const collection = () => getDb().collection<UserOauthToken>('user.oauth-tokens')

export const upsertOauthTokenForUser = async (
  userId: string,
  token: Credentials
): Promise<UserOauthToken> => {
  const oauthToken = await collection().findOneAndReplace(
    { userId },
    { userId, token },
    { upsert: true, returnDocument: 'after' }
  )

  if (!oauthToken.value) {
    throw new Failure('Cant upsert')
  }

  return oauthToken.value
}

export const findOauthTokenForUser = async (
  userId: string
): Promise<UserOauthToken> => {
  const oauth = await collection().findOne({ userId })

  if (!oauth) {
    throw new NotFoundFailure(`No oauth token for ${userId}`)
  }

  return oauth
}
