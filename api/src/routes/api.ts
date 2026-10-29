import { Router } from 'express'

import sweepstakesRoutes from '@/routes/sweepstakes.routes'
import lotteriesRoutes from '@/routes/lotteries.routes'
import presetsRoutes from '@/routes/presets.routes'
import usersRoutes from '@/routes/users.routes'
import authRoutes from '@/routes/auth.routes'
import logsRoutes from '@/routes/logs.routes'

const apiRouter = Router()

apiRouter.use('/auth', authRoutes)
apiRouter.use('/users', usersRoutes)
apiRouter.use('/presets', presetsRoutes)
apiRouter.use('/sweepstakes', sweepstakesRoutes)
apiRouter.use('/lotteries', lotteriesRoutes)
apiRouter.use('/logs', logsRoutes)

export default apiRouter