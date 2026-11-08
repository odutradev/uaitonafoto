import type { SxProps, Theme } from '@mui/material'

export const settingsSectionStackStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5
}

export const settingsCardStyles: SxProps<Theme> = {
  p: { xs: 2.5, sm: 3.5 },
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5
}

export const settingsActionsRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column-reverse', sm: 'row' },
  justifyContent: 'flex-end',
  gap: 1.5,
  pt: 1
}

export const settingsButtonStyles: SxProps<Theme> = {
  minHeight: 46,
  px: 3,
  width: { xs: '100%', sm: 'auto' }
}

export const dangerCardStyles: SxProps<Theme> = {
  p: { xs: 2.5, sm: 3 },
  borderColor: 'error.light'
}

export const dangerRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'stretch', sm: 'center' },
  justifyContent: 'space-between',
  gap: 2
}
