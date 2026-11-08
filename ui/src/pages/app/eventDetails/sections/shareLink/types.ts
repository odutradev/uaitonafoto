import type { EventItem, UpdateEventPayload } from '@actions/events/types'

export interface ShareLinkProps {
  event: EventItem
  onSave: (payload: UpdateEventPayload) => Promise<void>
  onOpenScreen?: () => void
}
