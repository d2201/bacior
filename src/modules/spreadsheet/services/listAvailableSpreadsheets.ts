import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

export const listAvailableSpreadsheets = async (oauthClient: OAuth2Client) => {
  const result = await google.drive('v3').files.list({
    q: 'mimeType="application/vnd.google-apps.spreadsheet" and name contains "BACIOR:"',
    auth: oauthClient,
  })

  return result.data
}
