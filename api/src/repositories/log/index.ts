import { firebaseDb } from '@database'
import { removeUndefined } from '@utils/object'
import createLogger from '@utils/logger'

import type { CreateLogPayload, LogEntity } from './types'

const REF_PATH = 'logs'
const logger = createLogger('log-repository')

const logRepository = {
  create: async (payload: CreateLogPayload): Promise<LogEntity | null> => {
    try {
      const ref = firebaseDb.ref(REF_PATH).push()
      const id = ref.key as string

      const entry: LogEntity = {
        ...removeUndefined(payload),
        id,
        createdAt: new Date().toISOString()
      }

      await ref.set(entry)

      return entry
    } catch (error) {
      logger.warn('Failed to persist audit log entry', error)
      return null
    }
  }
}

export default logRepository

