import type { EventItem } from '@actions/events/types'

export interface EventsProps {
  events: EventItem[]
  isLoading: boolean
  onCreateEvent: () => void
  onOpenEvent: (eventId: string) => void
}
