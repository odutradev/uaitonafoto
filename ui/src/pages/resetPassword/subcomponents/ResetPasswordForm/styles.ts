import type { SxProps, Theme } from '@mui/material'

export const resetWrapperStyles: SxProps<Theme> = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  py: 6,
  position: 'relative'
}

export const themeToggleStyles: SxProps<Theme> = {
  position: 'absolute',
  top: 20,
  right: 0
}

export const cardStyles: SxProps<Theme> = {
  p: { xs: 3, sm: 4 },
  width: '100%',
  bgcolor: 'background.paper'
}

export const titleStyles: SxProps<Theme> = {
  fontWeight: 800,
  textAlign: 'center',
  color: 'text.primary'
}

export const submitButtonStyles: SxProps<Theme> = {
  height: 48,
  fontWeight: 800
}

export const backButtonStyles: SxProps<Theme> = {
  color: 'text.secondary'
}
