import { Router } from 'express'
import { registerDomainEndpoints } from '@config/domain'

const apiRouter = Router()

registerDomainEndpoints(apiRouter)

export default apiRouter
