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

export const customizationCardStyles: SxProps<Theme> = {
  p: { xs: 2.5, sm: 3.5 },
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5,
  borderRadius: '24px',
  background: 'linear-gradient(180deg, rgba(255, 184, 0, 0.04) 0%, rgba(26, 26, 26, 0.6) 100%)',
  border: '1px solid rgba(255, 184, 0, 0.2)'
}

export const customizationSwitchRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 2,
  p: 2,
  borderRadius: '16px',
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider'
}

export const previewBoxStyles: SxProps<Theme> = {
  p: 2.5,
  borderRadius: '16px',
  bgcolor: '#0f0f0f',
  border: '1px dashed rgba(255, 184, 0, 0.3)',
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5
}
