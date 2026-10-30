import type { SxProps, Theme } from '@mui/material'

export const homeWrapperStyles: SxProps<Theme> = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  bgcolor: 'background.default',
  overflowX: 'hidden',
  width: '100%'
}

export const homeContentStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: { xs: 4, sm: 5 },
  px: { xs: 2, sm: 3 },
  py: { xs: 3, sm: 5 }
}

