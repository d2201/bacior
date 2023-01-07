import { DateTime } from 'luxon'
import { ControllerFunction } from '../../types'
import { Failure } from '../../utils/failures'
import { signInClientByCode } from '../services'
import { ACCESS_TOKEN_COOKIE } from '../types/user'

export const handleGoogleAuthCallback: ControllerFunction = async (
  req,
  res
) => {
  const code = req.query.code

  if (!code) {
    throw new Failure('No code in query')
  }

  const { accessToken } = await signInClientByCode(code as string)

  res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
    expires: DateTime.local().plus({ hour: 1 }).toJSDate(),
  })

  res.json({ accessToken })
}
