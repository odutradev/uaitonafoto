import type { EventItem } from '@utils/types/events'

export interface EventScreensProps {
  event: EventItem
  onOpenScreen: () => void
  onAddScreen: (name?: string) => Promise<void>
  onDisconnectScreen: (screenId: string) => Promise<void>
  onUpdateScreen: (screenId: string, name?: string) => Promise<void>
  onToggleBlockScreen?: (screenId: string, blocked: boolean) => Promise<void>
  onRefresh?: () => Promise<void>
  onUnlockLockouts?: () => Promise<void>
}

