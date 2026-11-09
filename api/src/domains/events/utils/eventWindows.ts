import type { EventCreditType, EventSettings } from '../repositories/events/types'
import type { EventPhase, EventWindows, EventWindowsInput } from './types'

const HOUR_MS = 60 * 60 * 1000
const DAY_MS = 24 * HOUR_MS

const addMs = (iso: string, ms: number): string => new Date(new Date(iso).getTime() + ms).toISOString()

export const computeEventWindows = (endsAt: string, settings: EventSettings): EventWindows => ({
  uploadsCloseAt: addMs(endsAt, settings.uploadWindowHours * HOUR_MS),
  galleryExpiresAt: addMs(endsAt, settings.galleryDurationDays * DAY_MS)
})

export const getEventMaxDurationHours = (creditType: EventCreditType = 'paid'): number =>
  creditType === 'free' ? 4 : 8

export const getEventMaxEndsAt = (startsAt: string, creditType: EventCreditType = 'paid'): string => {
  const durationHours = getEventMaxDurationHours(creditType)
  return new Date(new Date(startsAt).getTime() + durationHours * HOUR_MS).toISOString()
}

export const canReopenEvent = (
  event: { startsAt: string; closedAt?: string; creditType?: EventCreditType },
  now: Date = new Date()
): boolean => {
  if (!event.closedAt) return false
  const maxEndsAt = getEventMaxEndsAt(event.startsAt, event.creditType)
  return now.getTime() < new Date(maxEndsAt).getTime()
}

export const getEventPhase = (event: EventWindowsInput, now: Date = new Date()): EventPhase => {
  const time = now.getTime()
  if (time < new Date(event.startsAt).getTime()) return 'upcoming'
  if (time > new Date(event.galleryExpiresAt).getTime()) return 'expired'
  if (event.closedAt) return 'closed'
  if (time <= new Date(event.uploadsCloseAt).getTime()) return 'open'
  return 'closed'
}

export const canUploadPhotos = (event: EventWindowsInput, now: Date = new Date()): boolean =>
  getEventPhase(event, now) === 'open'

export const arePhotosVisible = (event: EventWindowsInput, now: Date = new Date()): boolean => {
  const phase = getEventPhase(event, now)
  if (phase === 'upcoming' || phase === 'expired') return false
  if (event.closedAt) return true
  if (event.settings.photoVisibility === 'during_event') return true
  return now.getTime() >= new Date(event.endsAt).getTime()
}

export const hasEventEnded = (
  event: Pick<EventWindowsInput, 'endsAt'> & { closedAt?: string },
  now: Date = new Date()
): boolean => Boolean(event.closedAt) || now.getTime() >= new Date(event.endsAt).getTime()
