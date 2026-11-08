import type { EventItem, UpdateEventPayload } from '@actions/events/types'

export interface EventSettingsProps {
  event: EventItem
  onSave: (payload: UpdateEventPayload) => Promise<void>
  onDelete?: () => Promise<void>
}
