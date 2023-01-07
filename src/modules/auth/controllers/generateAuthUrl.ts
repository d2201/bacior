import { ControllerFunction } from '../../../types'
import * as services from '../services'
import { DriveScopeStrategy } from '../strategies/scope/driveScopeStrategy'
import { ProfileScopeStrategy } from '../strategies/scope/profileScopeStrategy'

export const generateAuthUrl: ControllerFunction = async (req, res) => {
  const url = await services.generateAuthUrl(
    new ProfileScopeStrategy(),
    new DriveScopeStrategy()
  )

  res.redirect(url)
}
