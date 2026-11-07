export type EventModerationOption = 'AUTO' | 'MANUAL_PIN'
export type EventTierOption = 'PRO_UNLOCKED' | 'FREE_TRIAL'

export interface CreateEventDialogProps {
  open: boolean
  paidCredits: number
  freeCredits: number
  onClose: () => void
  onGoToBilling: () => void
}
