import { firestore } from '@database/connection'
import { removeUndefined } from '@utils/object'
import createLogger from '@utils/logger'

import type { CreateLogPayload, LogEntity } from './types'

const COLLECTION_NAME = 'logs'
const logger = createLogger('log-repository')

const logRepository = {
  create: async (payload: CreateLogPayload): Promise<LogEntity | null> => {
    try {
      const docRef = firestore.collection(COLLECTION_NAME).doc()
      const entry: LogEntity = {
        ...removeUndefined(payload),
        id: docRef.id,
        createdAt: new Date().toISOString()
      }

      await docRef.set(entry)

      return entry
    } catch (error) {
      logger.warn('Failed to persist audit log entry', error)
      return null
    }
  }
}

export default logRepository
