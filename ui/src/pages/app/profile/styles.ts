import type { SxProps, Theme } from '@mui/material'

export const profilePageStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: { xs: 3, sm: 4 },
  width: '100%'
}

export const headerBoxStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.75
}

export const pageTitleStyles: SxProps<Theme> = {
  fontSize: { xs: '1.75rem', sm: '2.25rem' }
}

export const footerStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  pt: 1,
  pb: 2
}
