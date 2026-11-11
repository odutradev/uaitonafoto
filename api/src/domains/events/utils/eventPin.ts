import { randomInt } from 'crypto'

import eventRepository from '@domains/events/repositories/events'
import { broadcastEvent } from '@realtime'

import type { EventEntity, EventSettings } from '@domains/events/repositories/events/types'

const drawRandomPin = (): string => randomInt(0, 10000).toString().padStart(4, '0')

const drawPinOutside = (excluded: string[]): string => {
  const pin = drawRandomPin()
  return excluded.includes(pin) ? drawPinOutside(excluded) : pin
}

export const generatePin = (excludePin?: string | string[]): string => {
  const excluded = Array.isArray(excludePin) ? excludePin : excludePin ? [excludePin] : []
  return drawPinOutside(excluded)
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

  broadcastEvent(event.id, 'pin:change', {
    pin: event.settings.pinEnabled ? pin : null
  })

  return updated ?? {
    ...event,
    settings: { ...event.settings, pin, pinUpdatedAt }
  }
}

