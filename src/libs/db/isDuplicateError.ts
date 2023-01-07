import { MongoError } from 'mongodb'

export const isDuplicateError = (error: unknown): error is MongoError => {
  return error instanceof MongoError && error.code === 11000
}