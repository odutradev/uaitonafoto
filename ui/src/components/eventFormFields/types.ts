import type { EventCreditType, EventCustomization, EventItem, PinRotationMinutes } from '@actions/events/types'

export interface EventFormState {
  name: string
  type: EventItem['type']
  creditType: EventCreditType
  startsAt: string
  endsAt: string
  maxPhotosPerGuest: number
  photoVisibility: EventItem['settings']['photoVisibility']
  uploadWindowHours: number
  galleryDurationDays: number
  pinEnabled: boolean
  pin: string
  pinRotate: boolean
  pinRotationMinutes: PinRotationMinutes
  customization?: EventCustomization
}

export interface EventFormFieldsProps {
  form: EventFormState
  onChange: <K extends keyof EventFormState>(key: K, value: EventFormState[K]) => void
  isCreate?: boolean
  step?: number
  paidCredits?: number
  freeCredits?: number
}
