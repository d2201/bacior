import './registerEnv'
import express, { Request} from 'express'
import { router as authRouter } from './modules/auth'
import { router as spreadsheetRouter } from './modules/spreadsheet'
import { connect } from './libs/db/connect'
import { userMiddleware } from './middlewares'
import cookieParser from 'cookie-parser'
import { Settings } from 'luxon'
import path from 'path'
import { setSpreadsheetIndexes } from './modules/spreadsheet/repositories'

Settings.defaultZone = 'Europe/Warsaw'

const app = express()
const PORT = 9001

Promise.resolve().then(async () => {
  await connect()
  console.log('connected to db')

  await setSpreadsheetIndexes()

  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, 'views'))

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use('/auth', authRouter)
  app.use(userMiddleware)
  app.use('/spreadsheets', spreadsheetRouter)
  app.get('/', (req: Request, res) => {
    res.render('index', { user: req.user })
  })

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
})
