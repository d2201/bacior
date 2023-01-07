import { ControllerFunction } from '../../../types'
import * as services from '../services'
import { ProfileScopeStrategy } from '../strategies/scope/profileScopeStrategy'

export const generateAuthUrl: ControllerFunction = async (req, res) => {
  const url = await services.generateAuthUrl(new ProfileScopeStrategy())

  res.redirect(url)
}
