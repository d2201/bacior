import './registerEnv'
import express, { NextFunction, Request, Response} from 'express'
import { router as authRouter } from './modules/auth'
import { router as spreadsheetRouter } from './modules/spreadsheet'
import { connect } from './libs/db/connect'
import { userMiddleware } from './middlewares'
import cookieParser from 'cookie-parser'
import { Settings } from 'luxon'
import path from 'path'
import { setSpreadsheetIndexes } from './modules/spreadsheet/repositories'
import { createDebugger } from './utils'
import queue from './utils/queue'

Settings.defaultZone = 'Europe/Warsaw'

const debug = createDebugger('app')

const app = express()
const PORT = 9001

Promise.resolve().then(async () => {
  debug('Connecting to database...')
  await connect()
  debug('Connected to database')

  debug('Setting indexes...')
  await setSpreadsheetIndexes()

  debug('Setting up queue')
  queue.setupProcessor(500)

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

  app.use(express.static(path.join(__dirname, 'assets')))

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(err)
    }

    res.send(err.message)
  })

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
})
