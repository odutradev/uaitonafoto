import type { EventItem, UpdateEventPayload } from '@utils/types/events'

export interface EventSettingsProps {
  event: EventItem
  onSave: (payload: UpdateEventPayload) => Promise<void>
  onDelete?: () => Promise<void>
}
