import type { SxProps, Theme } from '@mui/material'

export const welcomeWrapperStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'stretch', sm: 'center' },
  justifyContent: 'space-between',
  gap: { xs: 2.5, sm: 3 }
}

export const titleStyles: SxProps<Theme> = {
  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
  wordBreak: 'break-word'
}

export const subtitleStyles: SxProps<Theme> = {
  mt: 1,
  fontSize: { xs: '0.9375rem', sm: '1rem' }
}

export const createEventButtonStyles: SxProps<Theme> = {
  width: { xs: '100%', sm: 'auto' },
  minHeight: 48,
  flexShrink: 0,
  whiteSpace: 'nowrap'
}

