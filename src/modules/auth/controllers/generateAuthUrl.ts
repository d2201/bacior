import { ControllerFunction } from '../../../types'
import * as services from '../services'
import { SheetsScopeStrategy } from '../strategies'
import { ProfileScopeStrategy } from '../strategies/scope/profileScopeStrategy'

export const generateAuthUrl: ControllerFunction = async (req, res) => {
  const url = await services.generateAuthUrl(new ProfileScopeStrategy(), new SheetsScopeStrategy())

  res.redirect(url)
}
