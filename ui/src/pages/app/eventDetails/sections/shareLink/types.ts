import type { EventItem } from '@actions/events/types'

export interface ShareLinkProps {
  event: EventItem
  onGoToSettings?: () => void
  onUnlockLockouts?: () => Promise<void>
}
