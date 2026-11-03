import { Router } from 'express'

import { forgotPassword, resetPassword, syncAuthUser, updateMe, getMe, authMiddleware } from '@domains/users'


const authRoutes = Router()

authRoutes.post('/sync', syncAuthUser)
authRoutes.post('/forgot-password', forgotPassword)
authRoutes.post('/reset-password', resetPassword)
authRoutes.get('/me', authMiddleware, getMe)
authRoutes.patch('/me', authMiddleware, updateMe)

export default authRoutes
