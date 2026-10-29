import { Router } from 'express'

import authRoutes from '@routes/auth.routes'

const apiRouter = Router()

apiRouter.use('/auth', authRoutes)

export default apiRouter
