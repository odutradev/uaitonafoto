import type { EventItem } from '@actions/events/types'

export interface CreateEventDialogProps {
  open: boolean
  onClose: () => void
  onCreated: (event: EventItem) => void
}
