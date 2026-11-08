export interface PhotoEntity {
  id: string
  eventId: string
  guestId: string
  storagePath: string
  url: string
  contentType: string
  size: number
  likesCount: number
  createdAt: string
}

export type CreatePhotoPayload = Omit<PhotoEntity, 'likesCount' | 'createdAt'>

export interface ListPhotosParams {
  eventId: string
  guestId?: string
  limit: number
  offset: number
}

export interface ListPhotosSinceParams {
  eventId: string
  since?: string
  limit: number
}
