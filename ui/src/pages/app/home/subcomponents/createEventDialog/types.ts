import type { EventItem } from '@utils/types/events'

export interface CreateEventDialogProps {
  open: boolean
  onClose: () => void
  onCreated: (event: EventItem) => void
}
