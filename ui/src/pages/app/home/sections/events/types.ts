import type { EventItem } from '@utils/types/events'

export interface EventsProps {
  events: EventItem[]
  isLoading: boolean
  onCreateEvent: () => void
  onOpenEvent: (eventId: string) => void
}
