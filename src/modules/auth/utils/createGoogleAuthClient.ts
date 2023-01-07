import { Credentials, OAuth2ClientOptions } from 'google-auth-library'
import { google } from 'googleapis'
import { getConfig } from '../../../config'
import { AuthUser } from '../../../types'

const config = getConfig()

export class OAuthClient extends google.auth.OAuth2 {
  constructor(opts: OAuth2ClientOptions) {
    super(opts)
  }

  override setCredentials(credentials: Credentials) {
    super.setCredentials(credentials)

    return this
  }

  public override isTokenExpiring(): boolean {
    return super.isTokenExpiring()
  }
}

export const createGoogleAuthClient = () =>
  new OAuthClient({
    clientId: config.googleOauth.clientId,
    clientSecret: config.googleOauth.clientSecret,
    redirectUri: config.googleOauth.redirectUrl,
  })
