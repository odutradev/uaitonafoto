import type { EventItem } from '@actions/events/types'

export interface EventScreensProps {
  event: EventItem
  onOpenScreen: () => void
  onAddScreen: (name?: string) => Promise<void>
  onDisconnectScreen: (screenId: string) => Promise<void>
  onRefresh?: () => Promise<void>
}
