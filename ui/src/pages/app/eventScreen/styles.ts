import type { SxProps, Theme } from '@mui/material'

export const screenRootStyles: SxProps<Theme> = {
  position: 'fixed',
  inset: 0,
  bgcolor: '#000',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden'
}

export const photoStyles: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  objectFit: 'contain'
}

export const topBarStyles: SxProps<Theme> = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1,
  p: { xs: 1.5, sm: 3 },
  background: 'linear-gradient(rgba(0,0,0,0.7), transparent)',
  zIndex: 1
}

export const eventNameStyles: SxProps<Theme> = {
  fontWeight: 700,
  fontSize: { xs: '1.125rem', md: '2rem' },
  minWidth: 0,
  overflowWrap: 'anywhere'
}

export const iconButtonStyles: SxProps<Theme> = {
  color: '#fff'
}

export const captionStyles: SxProps<Theme> = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  p: { xs: 2, md: 4 },
  fontSize: { xs: '1rem', md: '1.75rem' },
  background: 'linear-gradient(transparent, rgba(0,0,0,0.75))'
}

export const waitingStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  textAlign: 'center',
  px: 3
}

export const qrBoxStyles: SxProps<Theme> = {
  bgcolor: '#fff',
  p: 1.5,
  borderRadius: '16px',
  lineHeight: 0
}
