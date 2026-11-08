import dayjs from 'dayjs'

import { generateRandomPin } from '@config/events'
import type { CreateEventPayload, EventItem } from '@actions/events/types'
import type { EventFormState } from './types'

const DATETIME_INPUT_FORMAT = 'YYYY-MM-DDTHH:mm'

export const buildInitialEventForm = (): EventFormState => {
  const start = dayjs().add(1, 'hour').startOf('hour')
  return {
    name: '',
    type: 'wedding',
    startsAt: start.format(DATETIME_INPUT_FORMAT),
    endsAt: start.add(6, 'hour').format(DATETIME_INPUT_FORMAT),
    maxPhotosPerGuest: 10,
    photoVisibility: 'during_event',
    uploadWindowHours: 24,
    galleryDurationDays: 30,
    pinEnabled: true,
    pin: generateRandomPin(),
    pinRotate: true,
    pinRotationMinutes: 15
  }
}

export const toEventForm = (event: EventItem): EventFormState => ({
  name: event.name,
  type: event.type,
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
  dayjs(form.endsAt).isAfter(dayjs(form.startsAt))

export const isValidEventPin = (form: EventFormState): boolean =>
  !form.pinEnabled || /^\d{4}$/.test(form.pin)

export const toEventPayload = (form: EventFormState): CreateEventPayload => ({
  name: form.name.trim(),
  type: form.type,
  startsAt: dayjs(form.startsAt).toISOString(),
  endsAt: dayjs(form.endsAt).toISOString(),
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
