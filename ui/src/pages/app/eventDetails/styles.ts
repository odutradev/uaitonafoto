import type { SxProps, Theme } from '@mui/material'

export const pageStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: { xs: 2.5, sm: 3 },
  width: '100%',
  minWidth: 0
}

export const headerStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1
}

export const titleStyles: SxProps<Theme> = {
  fontWeight: 700,
  fontSize: { xs: '1.5rem', sm: '2rem' },
  overflowWrap: 'anywhere'
}

export const chipsStyles: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 1
}

export const backButtonStyles: SxProps<Theme> = {
  alignSelf: 'flex-start',
  minHeight: 48
}

export const dangerButtonStyles: SxProps<Theme> = {
  alignSelf: { xs: 'stretch', sm: 'flex-start' },
  minHeight: 48
}
