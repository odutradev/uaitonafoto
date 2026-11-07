import type { LogEntity } from '../../../repositories/types'
import type { LogItemResponse } from '../types'

export const toLogItemResponse = (entity: LogEntity, isAdmin: boolean): LogItemResponse => ({
  id: entity.id,
  category: entity.category,
  level: entity.level,
  action: entity.action,
  title: entity.title,
  description: entity.description,
  userId: entity.userId,
  userName: entity.userName,
  userEmail: entity.userEmail,
  targetId: entity.targetId,
  targetName: entity.targetName,
  details: entity.details,
  errorMessage: isAdmin ? entity.errorMessage : undefined,
  ipAddress: isAdmin ? entity.ipAddress : undefined,
  createdAt: entity.createdAt
})

export default toLogItemResponse
