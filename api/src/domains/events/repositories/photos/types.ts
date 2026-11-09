export type PhotoStatus = 'pending' | 'approved' | 'rejected'

export interface PhotoEntity {
  id: string
  eventId: string
  guestId: string
  storagePath: string
  url: string
  contentType: string
  size: number
  likesCount: number
  status: PhotoStatus
  createdAt: string
}

export type CreatePhotoPayload = Omit<PhotoEntity, 'likesCount' | 'createdAt' | 'status'> & {
  status?: PhotoStatus
}

export interface ListPhotosParams {
  eventId: string
  guestId?: string
  status?: PhotoStatus | 'all'
  limit: number
  offset: number
}

export interface ListPhotosSinceParams {
  eventId: string
  since?: string
  status?: PhotoStatus | 'all'
  limit: number
}
