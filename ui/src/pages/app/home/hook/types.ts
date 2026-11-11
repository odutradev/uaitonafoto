import type { AuthUser } from '@stores/auth/types'
import type { EventItem } from '@utils/types/events'

export interface UseHomePageReturn {
  user: AuthUser | null
  firstName: string
  events: EventItem[]
  isLoading: boolean
  isCreateOpen: boolean
  reload: () => Promise<void>
  handleOpenCreate: () => void
  handleCloseCreate: () => void
  handleOpenEvent: (eventId: string) => void
  handleEventCreated: (event: EventItem) => void
}
