import type { SxProps, Theme } from '@mui/material'

export const teamSectionStackStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5
}

export const teamCardStyles: SxProps<Theme> = {
  p: { xs: 2.5, sm: 3.5 },
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5
}

export const membersListStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.25
}

export const memberRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.75,
  p: 1.75,
  borderRadius: '16px',
  bgcolor: 'action.hover',
  border: 1,
  borderColor: 'divider',
  minWidth: 0
}

export const memberAvatarStyles: SxProps<Theme> = {
  width: 42,
  height: 42,
  fontWeight: 800,
  fontSize: '1rem',
  bgcolor: 'primary.main',
  color: 'primary.contrastText',
  flexShrink: 0
}

export const memberTextStyles: SxProps<Theme> = {
  minWidth: 0,
  flex: 1
}

export const ellipsisStyles: SxProps<Theme> = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
}

export const addOrganizerSectionStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
  pt: 2.5,
  borderTop: 1,
  borderColor: 'divider'
}

export const addOrganizerRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'stretch', sm: 'center' },
  gap: 1.5
}

export const teamButtonStyles: SxProps<Theme> = {
  minHeight: 48,
  px: 3,
  width: { xs: '100%', sm: 'auto' },
  flexShrink: 0
}
