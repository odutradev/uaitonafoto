import dayjs from 'dayjs'

import { generateRandomPin } from '@config/events'
import type { CreateEventPayload, EventCreditType, EventItem } from '@actions/events/types'
import type { EventFormState } from './types'

const DATETIME_INPUT_FORMAT = 'YYYY-MM-DDTHH:mm'

export const buildInitialEventForm = (defaultCreditType: EventCreditType = 'paid'): EventFormState => {
  const start = dayjs().add(1, 'hour').startOf('hour')
  const isFree = defaultCreditType === 'free'
  return {
    name: '',
    type: 'wedding',
    creditType: defaultCreditType,
    startsAt: start.format(DATETIME_INPUT_FORMAT),
    endsAt: '',
    maxPhotosPerGuest: 10,
    photoVisibility: 'during_event',
    uploadWindowHours: 0,
    galleryDurationDays: isFree ? 14 : 90,
    pinEnabled: true,
    pin: generateRandomPin(),
    pinRotate: true,
    pinRotationMinutes: 15
  }
}

export const toEventForm = (event: EventItem): EventFormState => ({
  name: event.name,
  type: event.type,
  creditType: event.creditType ?? 'paid',
  startsAt: dayjs(event.startsAt).format(DATETIME_INPUT_FORMAT),
  endsAt: dayjs(event.endsAt).format(DATETIME_INPUT_FORMAT),
  maxPhotosPerGuest: event.settings.maxPhotosPerGuest,
  photoVisibility: event.settings.photoVisibility,
  uploadWindowHours: event.settings.uploadWindowHours,
  galleryDurationDays: event.settings.galleryDurationDays,
  pinEnabled: event.settings.pinEnabled,
  pin: event.settings.pin,
  pinRotate: event.settings.pinRotate,
  pinRotationMinutes: event.settings.pinRotationMinutes
})

export const isValidEventPeriod = (form: EventFormState): boolean =>
  !form.endsAt || dayjs(form.endsAt).isAfter(dayjs(form.startsAt))

export const isValidEventPin = (form: EventFormState): boolean =>
  !form.pinEnabled || /^\d{4}$/.test(form.pin)

export const toEventPayload = (form: EventFormState): CreateEventPayload => ({
  name: form.name.trim(),
  type: form.type,
  creditType: form.creditType,
  startsAt: dayjs(form.startsAt).toISOString(),
  ...(form.endsAt ? { endsAt: dayjs(form.endsAt).toISOString() } : {}),
  settings: {
    maxPhotosPerGuest: form.maxPhotosPerGuest,
    photoVisibility: form.photoVisibility,
    uploadWindowHours: form.uploadWindowHours,
    galleryDurationDays: form.galleryDurationDays,
    pinEnabled: form.pinEnabled,
    pin: form.pin,
    pinRotate: form.pinRotate,
    pinRotationMinutes: form.pinRotationMinutes
  }
})
