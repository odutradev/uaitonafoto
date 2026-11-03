import createLogger from '@utils/logger'
import { removeUndefined } from '@utils/object'
import LogModel from './model'
import type { CreateLogPayload, LogEntity } from './types'

const logger = createLogger('log-repository')

const toLogEntity = (doc: any): LogEntity => ({
  id: String(doc._id || doc.id),
  category: doc.category,
  level: doc.level,
  action: doc.action,
  title: doc.title,
  description: doc.description,
  userId: doc.userId,
  userName: doc.userName,
  userEmail: doc.userEmail,
  targetId: doc.targetId,
  targetName: doc.targetName,
  details: doc.details,
  errorMessage: doc.errorMessage,
  errorStack: doc.errorStack,
  ipAddress: doc.ipAddress,
  createdAt: doc.createdAt
})

const logRepository = {
  create: async (payload: CreateLogPayload): Promise<LogEntity | null> => {
    try {
      const entry = {
        ...removeUndefined(payload),
        createdAt: new Date().toISOString()
      }

      const created = await LogModel.create(entry)
      return toLogEntity(created.toObject ? created.toObject() : created)
    } catch (error) {
      logger.warn('Failed to persist audit log entry', error)
      return null
    }
  }
}

export default logRepository
