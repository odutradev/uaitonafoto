import type { EventItem } from '@actions/events/types'

export interface EventTeamProps {
  event: EventItem
  currentUserId: string
}
