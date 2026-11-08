import type { SxProps, Theme } from '@mui/material'

export const pageRootStyles: SxProps<Theme> = {
  minHeight: '100vh',
  py: { xs: 3, sm: 5 }
}

export const containerStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3
}

export const topBarStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
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

