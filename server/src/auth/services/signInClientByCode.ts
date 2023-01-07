import { createGoogleAuthClient } from '../utils'
import { google } from 'googleapis'
import { Failure } from '../../utils/failures'
import * as repository from '../repositories'
import { v4 as uuid } from 'uuid'

export const signInClientByCode = async (
  code: string
): Promise<{ accessToken: string }> => {
  const { tokens } = await createGoogleAuthClient().getToken(code)

  if (!tokens.access_token) {
    throw new Error('No access token')
  }

  const authClient = createGoogleAuthClient().setCredentials(tokens)

  const result = await google.people('v1').people.get({
    resourceName: 'people/me',
    auth: authClient,
    personFields: 'emailAddresses',
  })

  const email = result.data.emailAddresses?.[0]?.value

  if (!email) {
    throw new Failure('Email not found')
  }

  const user = await repository.upsertUserWithEmail(email)

  const userAccessTokens = await repository.findUserAccessTokens(user.id)
  await repository.upsertOauthTokenForUser(user.id, tokens)

  if (userAccessTokens.length) {
    return userAccessTokens[0]
  }

  return repository.createAccessTokenForUser(user.id, uuid())
}
