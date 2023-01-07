import { User } from '../types/user'
import * as repository from '../repositories'
import { createGoogleAuthClient } from '../utils'
import { AuthUser } from '../../../types'

export const createAuthUser = async (user: User): Promise<AuthUser> => {
  const oauthToken = await repository.findOauthTokenForUser(user.id)

  const authClient = createGoogleAuthClient().setCredentials(oauthToken.token)

  if (authClient.isTokenExpiring()) {
    const refreshed = await authClient.refreshAccessToken()
    await repository.upsertOauthTokenForUser(user.id, {
      ...oauthToken.token,
      ...refreshed.credentials,
    })
    authClient.setCredentials(refreshed.credentials)
  }

  return {
    me: user,
    authClient,
  }
}
