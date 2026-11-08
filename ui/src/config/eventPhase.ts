import type { EventPhase } from '@actions/events/types'

export const getEventPhase = (event: { startsAt: string; uploadsCloseAt: string; galleryExpiresAt: string }): EventPhase => {
  const now = Date.now()
  if (now < new Date(event.startsAt).getTime()) return 'upcoming'
  if (now <= new Date(event.uploadsCloseAt).getTime()) return 'open'
  if (now <= new Date(event.galleryExpiresAt).getTime()) return 'closed'
  return 'expired'
}
