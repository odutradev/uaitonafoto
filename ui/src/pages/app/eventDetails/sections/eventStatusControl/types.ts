import type { EventItem } from '@actions/events/types'

export interface EventStatusControlProps {
  event: EventItem
  onStart: () => Promise<void>
  onClose: () => Promise<void>
  onReopen: () => Promise<void>
}

