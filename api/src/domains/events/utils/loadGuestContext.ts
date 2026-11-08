import eventRepository from '../repositories/events'
import guestRepository from '../repositories/guests'

import type { GuestContext } from './types'

export const loadGuestContext = async (guestId: string): Promise<GuestContext | null> => {
  const guest = await guestRepository.findById(guestId)
  if (!guest) return null

  const event = await eventRepository.findById(guest.eventId)
  return event ? { guest, event } : null
}
