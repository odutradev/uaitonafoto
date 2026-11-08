import type { PaginationMeta } from '@actions/events/types'
import type { GuestEventInfo, GuestPhoto } from '@actions/guest/types'

export interface GuestPhotosFeedProps {
  event: GuestEventInfo
  photos: GuestPhoto[]
  meta: PaginationMeta | null
  page: number
  onPageChange: (nextPage: number) => void
  onToggleLike: (photoId: string) => Promise<void>
  onRemovePhoto: (photoId: string) => Promise<void>
}

