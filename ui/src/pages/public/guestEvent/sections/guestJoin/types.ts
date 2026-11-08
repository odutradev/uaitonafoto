import type { GuestEventInfo } from '@actions/guest/types'

export interface GuestJoinProps {
  event: GuestEventInfo
  onJoin: (name: string) => Promise<void>
}

