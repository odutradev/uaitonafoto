import { Router } from 'express'

import { forgotPassword, resetPassword, syncAuthUser, updateMe, getMe } from '@domains/users/actions/auth'
import authMiddleware from '@domains/users/middlewares/auth'

const authRoutes = Router()

authRoutes.post('/sync', syncAuthUser)
authRoutes.post('/forgot-password', forgotPassword)
authRoutes.post('/reset-password', resetPassword)
authRoutes.get('/me', authMiddleware, getMe)
authRoutes.patch('/me', authMiddleware, updateMe)

export default authRoutes
