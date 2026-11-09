import type { SxProps, Theme } from '@mui/material'

export const uploadPaperStyles: SxProps<Theme> = {
  p: { xs: 2.5, sm: 3 },
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5
}

export const uploadHeaderStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 1
}

export const uploadButtonsRowStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
  gap: 1.5
}

export const uploadButtonStyles: SxProps<Theme> = {
  minHeight: 48,
  width: '100%'
}

export const challengeButtonStyles: SxProps<Theme> = {
  minHeight: 48,
  width: '100%',
  fontWeight: 700,
  bgcolor: '#f59e0b',
  color: '#000',
  '&:hover': {
    bgcolor: '#d97706'
  }
}

export const challengeActiveBadgeStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.2)' : '#fffbeb'),
  border: '1px solid',
  borderColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.4)' : '#fde68a'),
  color: (theme) => (theme.palette.mode === 'dark' ? '#fcd34d' : '#92400e'),
  px: 2,
  py: 1,
  borderRadius: 2,
  gap: 1
}

export const challengeItemCardStyles: SxProps<Theme> = {
  p: 2,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1.5,
  '&:hover': {
    borderColor: 'warning.main',
    bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.04)'),
    transform: 'translateY(-1px)'
  }
}


