import type { PlanApiItem } from '@actions/payments/types'

export interface CheckoutConfirmationDialogProps {
  plan: PlanApiItem | null
  open: boolean
  isLoading: boolean
  onClose: () => void
  onConfirm: () => void
}
