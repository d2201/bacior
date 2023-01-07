import { AuthUser } from '../../../types'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import * as repository from '../repositories'
import { initializeTargets } from './initializeTargets'
import { globalAuth } from '../../../config'
import queue from '../../../utils/queue'
import { isDuplicateError } from '../../../libs/db/isDuplicateError'

export const selectSpreadsheet = async (user: AuthUser, sheetId: string) => {
  const sheet = new GoogleSpreadsheet(sheetId)

  sheet.useOAuth2Client(await globalAuth.getClient())

  await sheet.loadInfo()

  try {
    await repository.insertSpreadsheet({ sheetId, userId: user.me.id })
  } catch (e) {
    if (!isDuplicateError(e)) {
      throw e
    }
  }

  queue.enqueue({
    id: `initializeTargets-${sheetId}`,
    handler: () => initializeTargets(sheet),
  })
}
