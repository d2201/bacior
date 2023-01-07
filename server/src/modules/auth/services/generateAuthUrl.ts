import { AuthScopeStrategy } from '../strategies'
import { createGoogleAuthClient } from '../utils'

export const generateAuthUrl = async (
  ...scopeStrategies: AuthScopeStrategy[]
): Promise<string> => {
  const url = createGoogleAuthClient().generateAuthUrl({
    scope: scopeStrategies.flatMap((strategy) => strategy.scopes),
    access_type: 'offline',
    prompt: 'consent',
  })

  return url
}
