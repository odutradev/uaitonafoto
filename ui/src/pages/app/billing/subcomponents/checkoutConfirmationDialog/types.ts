import type { PlanApiItem } from '@utils/types/payments'

export interface CheckoutConfirmationDialogProps {
  plan: PlanApiItem | null
  open: boolean
  isLoading: boolean
  onClose: () => void
  onConfirm: () => void
}
