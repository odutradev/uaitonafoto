export interface GuestEntity {
  id: string
  eventId: string
  name: string
  createdAt: string
}

export interface CreateGuestPayload {
  eventId: string
  name: string
}
