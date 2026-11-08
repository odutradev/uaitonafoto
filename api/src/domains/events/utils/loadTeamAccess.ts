import eventRepository from '../repositories/events'
import findMemberRole from '../actions/event/utils/findMemberRole'

import type { TeamAccess } from './types'

export const loadTeamAccess = async (eventId: string, userId: string): Promise<TeamAccess> => {
  const event = await eventRepository.findById(eventId)
  if (!event) return { error: 'not_found' }

  const role = findMemberRole(event, userId)
  return role ? { event, role } : { error: 'forbidden' }
}
