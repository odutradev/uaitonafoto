import type { SxProps, Theme } from '@mui/material'

export const dialogPaperStyles: SxProps<Theme> = {
  borderRadius: '24px',
  maxWidth: 680,
  width: 'calc(100% - 32px)',
  m: { xs: 2, sm: 3 },
  p: { xs: 0.5, sm: 1.5 }
}

export const dialogActionsStyles: SxProps<Theme> = {
  px: 3,
  pb: 2.5,
  gap: 1,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: { xs: 'column-reverse', sm: 'row' }
}

export const dialogButtonStyles: SxProps<Theme> = {
  minHeight: 48,
  width: { xs: '100%', sm: 'auto' }
}
