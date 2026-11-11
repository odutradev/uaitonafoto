import type { EventItem } from '@utils/types/events'

export interface EventChallengesProps {
  event: EventItem
  onRefresh?: () => Promise<void>
}
