import { MongoClient, Db } from 'mongodb'
import { getConfig } from '../../config'

let db: Db

export const getDb = () => {
  if (!db) {
    throw new Error('no connection')
  }

  return db
}

export const connect = async () => {
  const config = getConfig()

  console.log('connecting on', config.mongo.uri)
  const connection = await MongoClient.connect(config.mongo.uri!)

  db = connection.db('bacior')

  return connection
}
