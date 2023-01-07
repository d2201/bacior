import { getDb } from '../../libs/db/connect'
import { Spreadsheet } from '../types'

const collection = () => getDb().collection<Spreadsheet>('spreadsheets')

export const insertSpreadsheet = async (spreadsheet: Spreadsheet) => {
  await collection().insertOne(spreadsheet)
}

export const fetchAllSpreadsheets = () => collection().find().toArray()
