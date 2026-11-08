import type { SxProps, Theme } from '@mui/material'

export const uploadPaperStyles: SxProps<Theme> = {
  p: { xs: 2.5, sm: 3 },
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5
}

export const uploadHeaderStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 1
}

export const uploadButtonStyles: SxProps<Theme> = {
  minHeight: 48,
  width: '100%'
}

