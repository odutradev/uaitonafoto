import type { SxProps, Theme } from '@mui/material'

export const loginWrapperStyles: SxProps<Theme> = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  px: 2,
  py: 6,
  bgcolor: 'background.default'
}

export const themeToggleWrapperStyles: SxProps<Theme> = {
  position: 'fixed',
  top: 20,
  right: 20
}

export const loginCardStyles: SxProps<Theme> = {
  p: { xs: 3, sm: 4 },
  width: '100%',
  maxWidth: 420
}

export const logoWrapperStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center'
}

export const submitButtonStyles: SxProps<Theme> = {
  height: 48,
  fontWeight: 800
}

export const googleButtonStyles: SxProps<Theme> = {
  height: 48,
  fontWeight: 700
}

export const backButtonStyles: SxProps<Theme> = {
  color: 'text.secondary',
  alignSelf: 'center'
}

