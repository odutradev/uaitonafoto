import type { GuestEventInfo, GuestProfile } from '@actions/guest/types'

export interface GuestUploadProps {
  event: GuestEventInfo
  guest: GuestProfile
  photosSent: number
  isUploading: boolean
  onUpload: (file: File) => Promise<void>
}

