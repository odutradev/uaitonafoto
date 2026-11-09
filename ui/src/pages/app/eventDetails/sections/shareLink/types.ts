import type { EventItem } from '@actions/events/types'

export interface ShareLinkProps {
  event: EventItem
  onUnlockLockouts?: () => Promise<void>
}

