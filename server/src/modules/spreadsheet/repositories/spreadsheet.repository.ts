import { getDb } from '../../../libs/db/connect'
import { Spreadsheet } from '../types'

const collection = () => getDb().collection<Spreadsheet>('spreadsheets')

export const setSpreadsheetIndexes = async () => {
  await collection().createIndex({ userId: 1, spreadsheetId: 1 }, { unique: true })
}

export const insertSpreadsheet = async (spreadsheet: Spreadsheet) => {
  await collection().insertOne(spreadsheet)
}

export const fetchAllSpreadsheets = () => collection().find().toArray()
