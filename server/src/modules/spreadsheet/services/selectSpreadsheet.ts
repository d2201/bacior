import { AuthUser } from '../../../types'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import * as repository from '../repositories'
import { initializeTargets } from './initializeTargets'
import { globalAuth } from '../../../config'

export const selectSpreadsheet = async (user: AuthUser, sheetId: string) => {
  const sheet = new GoogleSpreadsheet(sheetId)

  sheet.useOAuth2Client(await globalAuth.getClient())

  await sheet.loadInfo()

  await initializeTargets(sheet)

  await repository.insertSpreadsheet({ sheetId, userId: user.me.id })
}
