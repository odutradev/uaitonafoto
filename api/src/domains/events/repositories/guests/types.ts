export interface GuestEntity {
  id: string
  eventId: string
  name: string
  createdAt: string
  isBlocked?: boolean
}

export interface CreateGuestPayload {
  eventId: string
  name: string
}
