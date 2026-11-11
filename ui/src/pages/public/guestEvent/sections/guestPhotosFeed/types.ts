import type { PaginationMeta } from '@utils/types/events'
import type { GuestEventInfo, GuestPhoto } from '@utils/types/guest'

export interface GuestPhotosFeedProps {
  event: GuestEventInfo
  photos: GuestPhoto[]
  meta: PaginationMeta | null
  page: number
  onPageChange: (nextPage: number) => void
  onToggleLike: (photoId: string) => Promise<void>
  onRemovePhoto: (photoId: string) => Promise<void>
}

