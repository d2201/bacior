import { GoogleAuth } from 'google-auth-library'
import { SheetsScopeStrategy } from './modules/auth/strategies'

export const getConfig = () => ({
  app: {
    host: process.env.HOST_URL,
    silentAlert: process.env.USE_SILENT_ALERT === 'true',
  },
  googleOauth: {
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    redirectUrl: process.env.GOOGLE_OAUTH_REDIRECT_URL,
  },
  mongo: {
    uri: process.env.MONGO_URI,
  },
  pagerduty: {
    accessToken: process.env.PAGERDUTY_ACCESS_TOKEN,
    routingKey: process.env.PAGERDUTY_ROUTING_KEY,
  },
})

export const globalAuth = new GoogleAuth({
  scopes: new SheetsScopeStrategy().scopes,
})
