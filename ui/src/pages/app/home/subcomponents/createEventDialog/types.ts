import type { EventItem } from '@actions/events/types'

export interface CreateEventDialogProps {
  open: boolean
  onClose: () => void
  onCreated: (event: EventItem) => void
}

export interface CreateEventFormState {
  name: string
  type: EventItem['type']
  startsAt: string
  endsAt: string
  maxPhotosPerGuest: number
  photoVisibility: EventItem['settings']['photoVisibility']
  uploadWindowHours: number
  galleryDurationDays: number
}
