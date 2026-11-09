import type { EventEntity, EventMemberRole } from '../../../repositories/events/types'
import type { EventResponse } from '../types'

export const toEventResponse = (entity: EventEntity, myRole: EventMemberRole): EventResponse => ({
  id: entity.id,
  name: entity.name,
  description: entity.description,
  type: entity.type,
  creditType: entity.creditType,
  startsAt: entity.startsAt,
  endsAt: entity.endsAt,
  guestToken: entity.guestToken,
  settings: entity.settings,
  customization: entity.customization,
  uploadsCloseAt: entity.uploadsCloseAt,
  galleryExpiresAt: entity.galleryExpiresAt,
  members: entity.members,
  screens: entity.screens,
  myRole,
  createdAt: entity.createdAt,
  updatedAt: entity.updatedAt
})

export default toEventResponse
