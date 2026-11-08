import type { SxProps, Theme } from '@mui/material'

export const screenSectionStackStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5
}

export const screenCardStyles: SxProps<Theme> = {
  p: { xs: 2.5, sm: 3.5 },
  display: 'flex',
  flexDirection: 'column',
  gap: 3
}

export const screenHeaderRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  alignItems: { xs: 'flex-start', md: 'center' },
  justifyContent: 'space-between',
  gap: 2
}

export const screenHeaderActionsStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 1.25,
  width: { xs: '100%', md: 'auto' }
}

export const screenActionButtonStyles: SxProps<Theme> = {
  minHeight: 42,
  px: 2.25,
  fontSize: '0.875rem',
  width: { xs: '100%', sm: 'auto' }
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

export const screenSlotsGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    md: 'repeat(2, minmax(0, 1fr))'
  },
  gap: 2
}

export const screenSlotCardStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.75,
  p: 2.25,
  borderRadius: '18px',
  bgcolor: 'action.hover',
  border: 1,
  borderColor: 'divider'
}

export const screenSlotHeaderStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 1.5
}

export const pinCodeTextStyles: SxProps<Theme> = {
  fontFamily: 'monospace',
  fontWeight: 800,
  fontSize: '1.75rem',
  letterSpacing: '0.25em',
  lineHeight: 1.2
}

export const screenSlotFooterStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.25,
  mt: 'auto',
  pt: 1
}

