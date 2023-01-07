import { ControllerFunction } from '../../../types'
import * as service from '../services'
import { assertUser } from '../../../assertions'

export const selectSpreadsheet: ControllerFunction = async (req, res) => {
  assertUser(req.user)

  await service.selectSpreadsheet(req.user, req.body.sheetId)

  res.redirect(`https://docs.google.com/spreadsheets/d/${req.body.sheetId}/edit`)
}