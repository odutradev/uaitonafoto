import type { SxProps, Theme } from '@mui/material'

export interface PinInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  autoFocus?: boolean
  disabled?: boolean
  mask?: boolean
  showMaskToggle?: boolean
  label?: string
  helperText?: string
  ariaLabelPrefix?: string
  containerSx?: SxProps<Theme>
  slotSx?: SxProps<Theme>
  onComplete?: (pin: string) => void
}

