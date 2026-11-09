import type { SxProps, Theme } from '@mui/material'

export const shareSectionStackStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2
}

export const shareCardStyles: SxProps<Theme> = {
  p: { xs: 2, sm: 3 },
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5
}

export const shareMainRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  alignItems: { xs: 'center', md: 'center' },
  gap: { xs: 2, md: 3 }
}

export const qrBoxStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 0.75,
  p: 1.75,
  borderRadius: '14px',
  bgcolor: '#FFFFFF',
  border: 1,
  borderColor: 'divider',
  flexShrink: 0
}

export const shareInfoColumnStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
  minWidth: 0,
  flex: 1,
  width: '100%'
}

export const linkFieldBoxStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1,
  px: 1.5,
  py: 0.75,
  borderRadius: '10px',
  bgcolor: 'action.hover',
  border: 1,
  borderColor: 'divider',
  minWidth: 0
}

export const linkTextStyles: SxProps<Theme> = {
  fontFamily: 'monospace',
  fontSize: '0.8125rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
  flex: 1
}

export const linkIconActionsStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.25,
  flexShrink: 0
}

export const compactIconButtonStyles: SxProps<Theme> = {
  p: 0.6,
  borderRadius: '8px',
  color: 'text.secondary',
  '&:hover': {
    color: 'text.primary',
    bgcolor: 'action.selected'
  }
}

export const shareButtonStyles: SxProps<Theme> = {
  alignSelf: { xs: 'stretch', sm: 'flex-start' },
  minHeight: 36,
  px: 1.75,
  py: 0.75,
  fontSize: '0.8125rem',
  fontWeight: 600,
  borderRadius: '10px',
  borderWidth: '1px',
  borderColor: 'divider',
  '&:hover': {
    borderWidth: '1px'
  }
}

export const pinBannerStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'flex-start', sm: 'center' },
  justifyContent: 'space-between',
  gap: 1.5,
  px: 2,
  py: 1.5,
  borderRadius: '12px',
  bgcolor: 'action.hover',
  border: 1,
  borderColor: 'divider'
}

export const pinCodeTextStyles: SxProps<Theme> = {
  fontFamily: 'monospace',
  fontWeight: 800,
  fontSize: '1.25rem',
  letterSpacing: '0.2em',
  lineHeight: 1.2
}

export const unlockButtonStyles: SxProps<Theme> = {
  minHeight: 32,
  px: 1.5,
  py: 0.5,
  fontSize: '0.78rem',
  fontWeight: 600,
  borderRadius: '8px',
  borderWidth: '1px',
  borderColor: 'divider',
  color: 'text.secondary',
  '&:hover': {
    borderWidth: '1px',
    color: 'text.primary'
  }
}

