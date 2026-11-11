import type { GuestEventInfo, GuestProfile } from '@utils/types/guest'

export interface GuestUploadProps {
  event: GuestEventInfo
  guest: GuestProfile
  photosSent: number
  completedChallengeIds?: string[]
  isUploading: boolean
  onUpload: (file: File, challengeId?: string, challengeTitle?: string) => Promise<void>
}

