import { AuthUser } from '../../../types'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import * as repository from '../repositories'
import { initializeTargets } from './initializeTargets'
import { globalAuth } from '../../../config'
import queue from '../../../utils/queue'
import { isDuplicateError } from '../../../libs/db/isDuplicateError'
import { reseller } from 'googleapis/build/src/apis/reseller'
import { Failure } from '../../../utils/failures'

export class GoogleNotAuthorizedFailure extends Failure {
  constructor() {
    super('Bot has no access to the spreadsheet')
  }
}

export const selectSpreadsheet = async (user: AuthUser, sheetId: string) => {
  const sheet = new GoogleSpreadsheet(sheetId)

  sheet.useOAuth2Client(await globalAuth.getClient())

  try {
    await sheet.loadInfo()
  } catch (e) {
    if (!(e instanceof Error)) {
      throw e
    }
    if (e.message.includes('403')) {
      throw new GoogleNotAuthorizedFailure()
    }
  }
  

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
