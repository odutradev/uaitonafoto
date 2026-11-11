import type { EventItem, UpdateEventPayload } from '@utils/types/events'
import type { EventDetailsTab } from '@pages/app/eventDetails/types'
import type { AuthUser } from '@stores/auth/types'

export type LockoutScope = 'all' | 'screen' | 'guest'

export interface UseEventDetailsDataReturn {
  event: EventItem | null
  isLoading: boolean
  save: (payload: UpdateEventPayload) => Promise<void>
  remove: () => Promise<void>
  addScreen: (name?: string) => Promise<void>
  disconnectScreen: (screenId: string) => Promise<void>
  updateScreen: (screenId: string, name?: string) => Promise<void>
  toggleBlockScreen: (screenId: string, blocked: boolean) => Promise<void>
  refresh: () => Promise<void>
  start: () => Promise<void>
  close: () => Promise<void>
  reopen: () => Promise<void>
  unlockPin: (scope?: LockoutScope) => Promise<void>
}

export interface UseEventDetailsPageReturn extends UseEventDetailsDataReturn {
  user: AuthUser | null
  currentUserId: string
  activeTab: EventDetailsTab
  handleTabChange: (_: unknown, nextTab: EventDetailsTab) => void
  openScreen: () => void
  handleBackToEvents: () => void
  handleUnlockGuestLockouts: () => Promise<void>
  handleUnlockScreenLockouts: () => Promise<void>
}
