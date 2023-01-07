import { google } from 'googleapis'
import { globalAuth } from '../../config'

export const listAvailableSpreadsheets = async () => {
  const result = await google.drive('v3').files.list({
    q: 'mimeType="application/vnd.google-apps.spreadsheet" and name contains "BACIOR:"',
    auth: globalAuth,
  })

  return result.data
}
