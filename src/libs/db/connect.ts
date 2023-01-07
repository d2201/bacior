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
  
  const connection = await MongoClient.connect(config.mongo.uri!)

  db = connection.db('bacior')

  return connection
}
