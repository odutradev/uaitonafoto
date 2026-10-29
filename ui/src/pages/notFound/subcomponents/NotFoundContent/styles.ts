import type { SxProps, Theme } from '@mui/material'

export const notFoundWrapperStyles: SxProps<Theme> = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  py: 6
}

export const errorCodeStyles: SxProps<Theme> = {
  fontSize: { xs: '5rem', sm: '7rem' },
  color: 'secondary.main',
  lineHeight: 1
}

export const descriptionStyles: SxProps<Theme> = {
  fontSize: '1.125rem'
}

