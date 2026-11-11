import type { EventItem } from '@utils/types/events'

export interface EventStatusControlProps {
  event: EventItem
  onStart: () => Promise<void>
  onClose: () => Promise<void>
  onReopen: () => Promise<void>
}

