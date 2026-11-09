import type { EventItem } from '@actions/events/types'

export interface EventChallengesProps {
  event: EventItem
  onRefresh?: () => Promise<void>
}
