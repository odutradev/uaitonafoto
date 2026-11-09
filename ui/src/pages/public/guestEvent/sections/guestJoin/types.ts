import type { GuestEventInfo } from '@actions/guest/types'
import type { PinLockoutState } from '@hooks/usePinLockout/types'

export interface GuestJoinProps {
  event: GuestEventInfo
  onJoin: (name: string, pin?: string) => Promise<void>
  lockout?: PinLockoutState
}
