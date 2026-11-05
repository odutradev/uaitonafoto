import { Router } from 'express'
import { registerDomainEndpoints } from '@config/domain'

export const createApiRouter = (): Router => {
  const apiRouter = Router()
  registerDomainEndpoints(apiRouter)
  return apiRouter
}

export default createApiRouter
