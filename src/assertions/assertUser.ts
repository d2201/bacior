import { AuthUser } from '../types'
import { Failure } from '../utils/failures'

export function assertUser(user?: AuthUser): asserts user is AuthUser {
  if (!user) {
    throw new Failure('User does not exist')
  }
}
