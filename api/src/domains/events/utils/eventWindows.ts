import type { EventSettings } from '../repositories/events/types'
import type { EventPhase, EventWindows, EventWindowsInput } from './types'

const HOUR_MS = 60 * 60 * 1000
const DAY_MS = 24 * HOUR_MS

const addMs = (iso: string, ms: number): string => new Date(new Date(iso).getTime() + ms).toISOString()

export const computeEventWindows = (endsAt: string, settings: EventSettings): EventWindows => ({
  uploadsCloseAt: addMs(endsAt, settings.uploadWindowHours * HOUR_MS),
  galleryExpiresAt: addMs(endsAt, settings.galleryDurationDays * DAY_MS)
})

export const getEventPhase = (event: EventWindowsInput, now: Date = new Date()): EventPhase => {
  const time = now.getTime()
  if (time < new Date(event.startsAt).getTime()) return 'upcoming'
  if (time <= new Date(event.uploadsCloseAt).getTime()) return 'open'
  if (time <= new Date(event.galleryExpiresAt).getTime()) return 'closed'
  return 'expired'
}

export const canUploadPhotos = (event: EventWindowsInput, now: Date = new Date()): boolean =>
  getEventPhase(event, now) === 'open'

export const arePhotosVisible = (event: EventWindowsInput, now: Date = new Date()): boolean => {
  const phase = getEventPhase(event, now)
  if (phase === 'upcoming' || phase === 'expired') return false
  if (event.settings.photoVisibility === 'during_event') return true
  return now.getTime() >= new Date(event.endsAt).getTime()
}

export const hasEventEnded = (event: Pick<EventWindowsInput, 'endsAt'>, now: Date = new Date()): boolean =>
  now.getTime() >= new Date(event.endsAt).getTime()
