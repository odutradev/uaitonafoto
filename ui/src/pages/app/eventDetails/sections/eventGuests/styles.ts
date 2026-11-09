import type { SxProps, Theme } from '@mui/material'

export const guestsSectionStackStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2
}

export const guestsCardStyles: SxProps<Theme> = {
  p: { xs: 2, sm: 3 },
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5
}

export const guestsHeaderRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  alignItems: { xs: 'flex-start', md: 'center' },
  justifyContent: 'space-between',
  gap: 1.5
}

export const guestsHeaderActionsStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 1,
  width: { xs: '100%', md: 'auto' }
}

export const countBadgeStyles: SxProps<Theme> = {
  px: 0.85,
  py: 0.2,
  borderRadius: '6px',
  fontSize: '0.72rem',
  fontWeight: 700,
  border: '1px solid',
  borderColor: 'divider',
  color: 'text.secondary'
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

export const guestsGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, minmax(0, 1fr))',
    md: 'repeat(3, minmax(0, 1fr))'
  },
  gap: 1.5
}

export const guestCardStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: 1.5,
  p: 2,
  borderRadius: '12px',
  bgcolor: 'action.hover',
  border: 1,
  borderColor: 'divider'
}

export const guestHeaderStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1
}

export const guestStatusPillStyles = (isBlocked: boolean): SxProps<Theme> => ({
  px: 0.85,
  py: 0.2,
  borderRadius: '6px',
  fontSize: '0.7rem',
  fontWeight: 700,
  border: '1px solid',
  ...(isBlocked
    ? {
        bgcolor: 'rgba(239, 68, 68, 0.12)',
        color: 'error.main',
        borderColor: 'rgba(239, 68, 68, 0.3)'
      }
    : {
        bgcolor: 'rgba(34, 197, 94, 0.12)',
        color: '#22c55e',
        borderColor: 'rgba(34, 197, 94, 0.3)'
      })
})

