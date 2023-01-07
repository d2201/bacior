import { Router } from 'express'
import expressAsyncHandler from 'express-async-handler'
import * as controllers from './controllers'

export const router = Router()

router.get('/', expressAsyncHandler(controllers.listAvailableSpreadsheets))
router.post('/select', expressAsyncHandler(controllers.selectSpreadsheet))
