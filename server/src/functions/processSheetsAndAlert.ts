import '../registerEnv'
import { createAlertWrapper } from 'alert-manager'
import createDebugger from 'debug'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { DateTime, Settings } from 'luxon'
import { fetchAllSpreadsheets } from '../spreadsheet/repositories'
import { connect } from '../db/connect'
import {
  AlertBinding,
  CreateAlertPayload,
} from 'alert-manager/dist/alert-bindings'
import { getConfig, globalAuth } from '../config'

Settings.defaultZone = 'Europe/Warsaw'

const debug = createDebugger('bacior:sheets-processing')
const config = getConfig()

class SilentAlert implements AlertBinding {
  async emitAlert(createPayload: CreateAlertPayload) {
    debug('silent alert', createPayload)
  }
}

const getAlertBinding = (): AlertBinding => {
  if (config.app.silentAlert) {
    debug('app running in silence')
    return new SilentAlert()
  }

  return createAlertWrapper({
    pagerduty: {
      accessToken: config.pagerduty.accessToken!,
      routingKey: config.pagerduty.routingKey!,
    },
  })
}

export const processSheetsAndAlert = async () => {
  const alertWrapper = getAlertBinding()

  debug('connecting to db')
  await connect()
  debug('connected')

  debug('processing sheets')

  debug('grabbing all registered sheets')
  const spreadsheets = await fetchAllSpreadsheets()

  if (!spreadsheets.length) {
    debug('no spreadsheets to process -- dying peacefully')
    process.exit(0)
  }

  debug(`${spreadsheets.length} to process`)

  for (const spreadsheet of spreadsheets) {
    const client = await globalAuth.getClient()

    debug('authenticated -- grabbing sheet')

    const gSpreadsheet = new GoogleSpreadsheet(spreadsheet.sheetId)

    gSpreadsheet.useOAuth2Client(client)

    await gSpreadsheet.loadInfo()

    debug('info loaded')

    debug('calculating if needs alert')
    const isNeedForAlert = await shouldAlert(gSpreadsheet)
    debug('needs alert?:', isNeedForAlert)

    if (isNeedForAlert) {
      await alertWrapper.emitAlert({
        title: 'Bacior',
        message: 'Pracuj nad celem',
        severity: 'critical',
        source: 'Bacior',
      })
    }
  }
  process.exit(0)
}

const shouldAlert = async (
  spreadsheet: GoogleSpreadsheet
): Promise<boolean> => {
  const progressSheet = spreadsheet.sheetsByIndex[0]

  debug('loading cells')
  await progressSheet.loadCells()

  debug('loading rows')
  const rows = await progressSheet.getRows()

  for (const row of rows) {
    const dueDate = row.due_date
    const completed = row.zrobione === 'tak'

    const asDate = DateTime.fromSQL(dueDate).toJSDate()

    if (isAppriopriateMomentForAlert() && new Date() >= asDate && !completed) {
      return true
    }
  }

  return false
}

const isAppriopriateMomentForAlert = () => {
  const hour = DateTime.local().get('hour')

  return hour >= 14 && hour <= 23
}

processSheetsAndAlert()
