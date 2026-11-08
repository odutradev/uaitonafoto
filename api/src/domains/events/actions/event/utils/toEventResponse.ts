import type { EventEntity, EventMemberRole } from '../../../repositories/types'
import type { EventResponse } from '../types'

export const toEventResponse = (entity: EventEntity, myRole: EventMemberRole): EventResponse => ({
  id: entity.id,
  name: entity.name,
  description: entity.description,
  type: entity.type,
  startsAt: entity.startsAt,
  endsAt: entity.endsAt,
  guestToken: entity.guestToken,
  settings: entity.settings,
  members: entity.members,
  myRole,
  createdAt: entity.createdAt,
  updatedAt: entity.updatedAt
})

export default toEventResponse
