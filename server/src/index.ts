import './registerEnv'
import express from 'express'
import { router as authRouter } from './auth'
import { router as spreadsheetRouter } from './spreadsheet'
import { connect } from './db/connect'
import { userMiddleware } from './middlewares'
import cookieParser from 'cookie-parser'
import { Settings } from 'luxon'

Settings.defaultZone = 'Europe/Warsaw'

const app = express()
const PORT = 9001

Promise.resolve().then(async () => {
  await connect()
  console.log('connected to db')

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use('/auth', authRouter)

  app.use(userMiddleware)
  app.use('/spreadsheets', spreadsheetRouter)

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
})
