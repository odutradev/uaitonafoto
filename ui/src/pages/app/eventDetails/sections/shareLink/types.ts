import type { EventItem } from '@utils/types/events'

export interface ShareLinkProps {
  event: EventItem
  onUnlockLockouts?: () => Promise<void>
}

