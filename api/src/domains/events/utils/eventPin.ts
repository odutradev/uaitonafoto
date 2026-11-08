import { randomInt } from 'crypto'
import eventRepository from '../repositories/events'
import type { EventEntity, EventSettings } from '../repositories/events/types'

export const generatePin = (excludePin?: string): string => {
  let pin = randomInt(0, 10000).toString().padStart(4, '0')
  while (excludePin && pin === excludePin) {
    pin = randomInt(0, 10000).toString().padStart(4, '0')
  }
  return pin
}

export const isPinExpired = (settings: EventSettings, now = new Date()): boolean => {
  if (!settings.pinEnabled || !settings.pinRotate) return false

  const updatedAtMs = Date.parse(settings.pinUpdatedAt)
  if (Number.isNaN(updatedAtMs)) return true

  return now.getTime() - updatedAtMs >= settings.pinRotationMinutes * 60_000
}

export const ensureCurrentEventPin = async (event: EventEntity): Promise<EventEntity> => {
  if (!isPinExpired(event.settings)) return event

  const pin = generatePin(event.settings.pin)
  const pinUpdatedAt = new Date().toISOString()

  const updated = await eventRepository.update(event.id, {
    settings: { pin, pinUpdatedAt }
  })

  return updated ?? {
    ...event,
    settings: { ...event.settings, pin, pinUpdatedAt }
  }
}
