import type { SxProps, Theme } from '@mui/material'

export const shareLinkContentStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'stretch', sm: 'center' },
  gap: 3,
  p: { xs: 2.5, sm: 3 }
}

export const qrWrapperStyles: SxProps<Theme> = {
  alignSelf: 'center',
  bgcolor: '#fff',
  p: 1.5,
  borderRadius: '16px',
  lineHeight: 0,
  flexShrink: 0
}

export const shareInfoStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
  minWidth: 0,
  flex: 1
}

export const linkTextStyles: SxProps<Theme> = {
  fontFamily: 'monospace',
  overflowWrap: 'anywhere'
}

export const shareButtonsStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  flexWrap: 'wrap',
  gap: 1
}

export const shareButtonStyles: SxProps<Theme> = {
  minHeight: 48,
  width: { xs: '100%', sm: 'auto' }
}
