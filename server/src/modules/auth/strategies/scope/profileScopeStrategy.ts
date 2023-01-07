import { AuthScopeStrategy } from '../scopeStrategy'

export class ProfileScopeStrategy implements AuthScopeStrategy {
  readonly scopes: string[] = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ]
}
