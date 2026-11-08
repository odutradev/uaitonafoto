import type { EventItem, UpdateEventPayload } from '@actions/events/types'

export interface ShareLinkProps {
  event: EventItem
  onOpenScreen: () => void
  onSave: (payload: UpdateEventPayload) => Promise<void>
  onAddScreen: () => Promise<void>
  onDisconnectScreen: (screenId: string) => Promise<void>
}
