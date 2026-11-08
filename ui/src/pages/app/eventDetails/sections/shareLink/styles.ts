import type { SxProps, Theme } from '@mui/material'

export const shareSectionStackStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5
}

export const shareCardStyles: SxProps<Theme> = {
  p: { xs: 2.5, sm: 3.5 },
  display: 'flex',
  flexDirection: 'column',
  gap: 3
}

export const shareMainRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  alignItems: { xs: 'center', md: 'stretch' },
  gap: { xs: 2.5, md: 3.5 }
}

export const qrBoxStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 1,
  p: 2,
  borderRadius: '20px',
  bgcolor: '#FFFFFF',
  border: 1,
  borderColor: 'divider',
  flexShrink: 0
}

export const shareInfoColumnStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: 2,
  minWidth: 0,
  flex: 1,
  width: '100%'
}

export const linkFieldBoxStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1.5,
  px: 2,
  py: 1.25,
  borderRadius: '14px',
  bgcolor: 'action.hover',
  border: 1,
  borderColor: 'divider',
  minWidth: 0
}

export const linkTextStyles: SxProps<Theme> = {
  fontFamily: 'monospace',
  fontSize: '0.875rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
  flex: 1
}

export const shareActionsRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  flexWrap: 'wrap',
  gap: 1.25
}

export const shareButtonStyles: SxProps<Theme> = {
  minHeight: 42,
  px: 2.25,
  fontSize: '0.875rem',
  width: { xs: '100%', sm: 'auto' }
}

export const summaryGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, minmax(0, 1fr))',
    md: 'repeat(4, minmax(0, 1fr))'
  },
  gap: 1.5,
  pt: 2.5,
  borderTop: 1,
  borderColor: 'divider'
}

export const summaryItemStyles: SxProps<Theme> = {
  p: 1.75,
  borderRadius: '14px',
  bgcolor: 'action.hover',
  display: 'flex',
  flexDirection: 'column',
  gap: 0.5,
  minWidth: 0
}
