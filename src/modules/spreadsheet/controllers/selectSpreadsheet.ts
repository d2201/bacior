import { ControllerFunction } from '../../../types'
import * as service from '../services'
import { assertUser } from '../../../assertions'
import { GoogleNotAuthorizedFailure } from '../services'
import { getConfig } from '../../../config'

export const selectSpreadsheet: ControllerFunction = async (req, res) => {
  assertUser(req.user)

  try {
    await service.selectSpreadsheet(req.user, req.body.sheetId)

    res.redirect(
      `https://docs.google.com/spreadsheets/d/${req.body.sheetId}/edit`
    )
  } catch (e) {
    if (!(e instanceof GoogleNotAuthorizedFailure)) {
      throw e
    }

    res.render('spreadsheets/authError', {
      email: getConfig().app.botEmail,
      sheetUrl: `https://docs.google.com/spreadsheets/d/${req.body.sheetId}/edit`,
    })
  }
}
