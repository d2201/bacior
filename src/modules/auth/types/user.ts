import { Credentials } from 'google-auth-library'

export type User = {
  id: string
  email: string
}

export type UserOauthToken = {
  userId: string
  token: Credentials
}

export type UserAccessToken = {
  userId: string
  accessToken: string
}

export const ACCESS_TOKEN_COOKIE = 'access_token'
