import type { SxProps, Theme } from '@mui/material'

export const teamPaperStyles: SxProps<Theme> = {
  p: { xs: 2.5, sm: 3 },
  display: 'flex',
  flexDirection: 'column',
  gap: 2
}

export const addOrganizerRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  gap: 1.5
}

export const memberRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  minWidth: 0
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

export const teamButtonStyles: SxProps<Theme> = {
  minHeight: 48,
  width: { xs: '100%', sm: 'auto' },
  flexShrink: 0
}
