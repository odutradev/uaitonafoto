import type { GuestEventInfo } from '@utils/types/guest'
import type { PinLockoutState } from '@hooks/usePinLockout/types'

export interface GuestJoinProps {
  event: GuestEventInfo
  onJoin: (name: string, pin?: string) => Promise<void>
  lockout?: PinLockoutState
}
