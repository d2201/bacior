import { Router } from 'express'
import expressAsyncHandler from 'express-async-handler'
import * as controllers from './controllers'

export const router = Router()

router.get('/google-oauth', expressAsyncHandler(controllers.generateAuthUrl))
router.get(
  '/google-oauth/callback',
  expressAsyncHandler(controllers.handleGoogleAuthCallback)
)
