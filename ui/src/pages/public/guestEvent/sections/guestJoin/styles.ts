import type { SxProps, Theme } from '@mui/material'

export const joinPaperStyles: SxProps<Theme> = {
  p: { xs: 2.5, sm: 3.5 },
  display: 'flex',
  flexDirection: 'column',
  gap: 2
}

export const joinButtonStyles: SxProps<Theme> = {
  minHeight: 48,
  width: '100%'
}

