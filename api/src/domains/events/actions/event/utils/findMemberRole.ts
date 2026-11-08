import type { EventEntity, EventMemberRole } from '../../../repositories/types'

export const findMemberRole = (event: EventEntity, userId: string): EventMemberRole | undefined =>
  event.members.find((member) => member.userId === userId)?.role

export default findMemberRole
