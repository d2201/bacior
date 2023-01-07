import { assertUser } from '../../../assertions'
import { ControllerFunction } from '../../../types'
import * as services from '../services'

export const listAvailableSpreadsheets: ControllerFunction = async (
  req,
  res
) => {
  assertUser(req.user)

  const data = await services.listAvailableSpreadsheets(req.user.authClient)

  res.render('spreadsheets/listSheets', { sheets: data.files ?? [] })
}
