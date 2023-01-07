import { getDb } from '../../libs/db/connect'
import { NotFoundFailure } from '../../utils/failures'
import { User } from '../types/user'
import { v4 as uuid } from 'uuid'

const collection = () => getDb().collection<User>('users')

export const findUserByEmail = async (email: string): Promise<User> => {
  const user = await collection().findOne({ email })

  if (!user) {
    throw new NotFoundFailure('Not found user')
  }

  return user
}

export const upsertUserWithEmail = async (email: string): Promise<User> => {
  const user = await collection().findOneAndUpdate(
    { email },
    { $setOnInsert: { email, id: uuid() } },
    { upsert: true, returnDocument: 'after' }
  )

  return user.value!
}

export const findUserById = async (id: string): Promise<User> => {
  const user = await collection().findOne({ id })

  if (!user) {
    throw new NotFoundFailure(`User with ${id} not found`)
  }

  return user
}
