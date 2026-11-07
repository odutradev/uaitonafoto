import type { ReactNode } from 'react'
import type { Breakpoint } from '@mui/material'

export type ModalVariant = 'danger' | 'warning' | 'info' | 'default'

export interface ModalActionProps {
  label: string
  onClick: () => void | Promise<void>
  loading?: boolean
  disabled?: boolean
  variant?: 'contained' | 'outlined' | 'text'
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
}

export interface ModalSecondaryActionProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: ReactNode
  icon?: ReactNode
  variant?: ModalVariant
  maxWidth?: Breakpoint | false
  fullWidth?: boolean
  showCloseButton?: boolean
  primaryAction?: ModalActionProps
  secondaryAction?: ModalSecondaryActionProps
  children?: ReactNode
  actions?: ReactNode
}

