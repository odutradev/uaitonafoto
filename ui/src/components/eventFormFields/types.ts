import type { EventItem } from '@actions/events/types'

export interface EventFormState {
  name: string
  type: EventItem['type']
  startsAt: string
  endsAt: string
  maxPhotosPerGuest: number
  photoVisibility: EventItem['settings']['photoVisibility']
  uploadWindowHours: number
  galleryDurationDays: number
}

export interface EventFormFieldsProps {
  form: EventFormState
  onChange: <K extends keyof EventFormState>(key: K, value: EventFormState[K]) => void
}
