import type { IconButtonProps } from '@mui/material'

export interface ThemeToggleProps extends Omit<IconButtonProps, 'onClick'> {
  showTooltip?: boolean
}
