import dayjs from 'dayjs'

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
    galleryDurationDays: 30
  }
}

export const toEventForm = (event: EventItem): EventFormState => ({
  name: event.name,
  type: event.type,
  startsAt: dayjs(event.startsAt).format(DATETIME_INPUT_FORMAT),
  endsAt: dayjs(event.endsAt).format(DATETIME_INPUT_FORMAT),
  ...event.settings
})

export const isValidEventPeriod = (form: EventFormState): boolean =>
  dayjs(form.endsAt).isAfter(dayjs(form.startsAt))

export const toEventPayload = (form: EventFormState): CreateEventPayload => ({
  name: form.name.trim(),
  type: form.type,
  startsAt: dayjs(form.startsAt).toISOString(),
  endsAt: dayjs(form.endsAt).toISOString(),
  settings: {
    maxPhotosPerGuest: form.maxPhotosPerGuest,
    photoVisibility: form.photoVisibility,
    uploadWindowHours: form.uploadWindowHours,
    galleryDurationDays: form.galleryDurationDays
  }
})
