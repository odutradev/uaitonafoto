export interface LikeEntity {
  id: string
  eventId: string
  photoId: string
  guestId: string
  createdAt: string
}

export type CreateLikePayload = Pick<LikeEntity, 'eventId' | 'photoId' | 'guestId'>
