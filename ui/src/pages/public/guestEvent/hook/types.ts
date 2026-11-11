import type { GuestEventInfo, GuestPhoto, GuestProfile } from '@utils/types/guest'
import type { PinLockoutState } from '@hooks/usePinLockout/types'
import type { PaginationMeta } from '@utils/types/events'

export interface UseGuestEventPageReturn {
  event: GuestEventInfo | null
  guest: GuestProfile | null
  photosSent: number
  completedChallengeIds: string[]
  photos: GuestPhoto[]
  meta: PaginationMeta | null
  page: number
  isLoading: boolean
  isUploading: boolean
  notFound: boolean
  lockout: PinLockoutState
  setPage: (page: number) => void
  join: (name: string, pin?: string) => Promise<void>
  upload: (file: File, challengeId?: string, challengeTitle?: string) => Promise<void>
  toggleLike: (photoId: string) => Promise<void>
  removePhoto: (photoId: string) => Promise<void>
}
