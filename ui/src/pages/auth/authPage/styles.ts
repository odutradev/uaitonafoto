import type { SxProps, Theme } from '@mui/material'

export const authWrapperStyles: SxProps<Theme> = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  px: 2,
  py: { xs: 4, sm: 6 },
  bgcolor: 'background.default'
}

export const themeToggleWrapperStyles: SxProps<Theme> = {
  position: 'fixed',
  top: { xs: 12, sm: 20 },
  right: { xs: 12, sm: 20 },
  zIndex: 10
}

export const authCardStyles: SxProps<Theme> = {
  p: { xs: 2.75, sm: 4 },
  width: '100%',
  maxWidth: 420,
  borderRadius: { xs: '20px', sm: '24px' }
}

export const logoWrapperStyles: SxProps<Theme> = {
  display: 'inline-flex',
  justifyContent: 'center',
  textDecoration: 'none',
  color: 'inherit',
  '&:hover': {
    textDecoration: 'none'
  }
}

export const forgotPasswordBoxStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'flex-end',
  mt: -1
}

export const submitButtonStyles: SxProps<Theme> = {
  height: 48,
  fontWeight: 800,
  fontSize: '1rem'
}

export const googleButtonStyles: SxProps<Theme> = {
  height: 48,
  fontWeight: 700
}

export const switchLinkBoxStyles: SxProps<Theme> = {
  textAlign: 'center',
  pt: 0.5
}

export const backButtonStyles: SxProps<Theme> = {
  color: 'text.secondary',
  alignSelf: 'center'
}
