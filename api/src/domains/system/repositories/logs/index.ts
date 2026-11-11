import notifyAdmins from '@domains/system/utils/notifyAdmins'
import { removeUndefined } from '@utils/object'
import createLogger from '@utils/logger'
import LogModel from './model'

import type { CreateLogPayload, ListLogsPaginatedParams, LogEntity } from './types'
import type { PaginatedData } from '@factories/pagination/types'
import type { LogDocument } from './model'

const logger = createLogger('log-repository')

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const alertAdminsAboutError = (payload: CreateLogPayload): void => {
  if (payload.level !== 'error') return

  void notifyAdmins({
    key: payload.action,
    title: payload.title,
    description: payload.description ?? payload.errorMessage ?? payload.title,
    details: [
      { label: 'Ação', value: payload.action },
      ...(payload.targetName || payload.targetId ? [{ label: 'Alvo', value: payload.targetName ?? payload.targetId ?? '' }] : []),
      ...(payload.userEmail ? [{ label: 'Usuário', value: payload.userEmail }] : []),
      ...(payload.errorMessage ? [{ label: 'Erro', value: payload.errorMessage }] : [])
    ]
  })
}

const toLogEntity = (doc: LogDocument & { id?: string }): LogEntity => ({
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

export const logRepository = {
  create: async (payload: CreateLogPayload): Promise<LogEntity | null> => {
    alertAdminsAboutError(payload)

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
  },

  listPaginated: async ({
    limit,
    offset,
    userId,
    category,
    level,
    action,
    search
  }: ListLogsPaginatedParams): Promise<PaginatedData<LogEntity>> => {
    const baseFilter = removeUndefined({
      userId,
      category,
      level,
      action
    })

    const trimmedSearch = search?.trim()
    const searchRegex = trimmedSearch ? new RegExp(escapeRegex(trimmedSearch), 'i') : null

    const filter = searchRegex
      ? {
          ...baseFilter,
          $or: [
            { title: searchRegex },
            { description: searchRegex },
            { action: searchRegex },
            { userEmail: searchRegex },
            { userName: searchRegex },
            { targetName: searchRegex }
          ]
        }
      : baseFilter

    const [count, docs] = await Promise.all([
      LogModel.countDocuments(filter),
      LogModel.find(filter).sort({ createdAt: -1 }).skip(offset).limit(limit).lean()
    ])

    return {
      count,
      rows: docs.map(toLogEntity)
    }
  }
}

export default logRepository
