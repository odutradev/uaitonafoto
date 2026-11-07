import type { LogEntity } from '../../../repositories/types'
import type { LogItemResponse } from '../types'

const replaceLegacyFreeTrialLabel = (text?: string): string | undefined =>
  text ? text.replace(/Modo Degustação/gi, 'Teste Grátis') : text

export const toLogItemResponse = (entity: LogEntity, isAdmin: boolean): LogItemResponse => ({
  id: entity.id,
  category: entity.category,
  level: entity.level,
  action: entity.action,
  title: replaceLegacyFreeTrialLabel(entity.title) ?? entity.title,
  description: replaceLegacyFreeTrialLabel(entity.description) ?? entity.description,
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
