import type { SxProps, Theme } from '@mui/material'

export const settingsSectionStackStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2
}

export const settingsCardStyles: SxProps<Theme> = {
  p: { xs: 2, sm: 3 },
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 2.25
}

export const settingsActionsRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column-reverse', sm: 'row' },
  justifyContent: 'flex-end',
  gap: 1,
  pt: 0.5
}

export const settingsButtonStyles: SxProps<Theme> = {
  minHeight: 38,
  px: 2,
  py: 0.75,
  fontSize: '0.8125rem',
  fontWeight: 600,
  borderRadius: '10px',
  borderWidth: '1px',
  width: { xs: '100%', sm: 'auto' },
  '&:hover': {
    borderWidth: '1px'
  }
}

export const syncButtonStyles: SxProps<Theme> = {
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

export const proBadgeStyles: SxProps<Theme> = {
  px: 0.75,
  py: 0.15,
  borderRadius: '5px',
  fontSize: '0.65rem',
  fontWeight: 800,
  bgcolor: 'primary.main',
  color: 'primary.contrastText',
  lineHeight: 1.3
}

export const dangerCardStyles: SxProps<Theme> = {
  p: { xs: 2, sm: 2.5 },
  borderRadius: '16px',
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
  p: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  borderRadius: '12px',
  bgcolor: 'action.hover',
  border: 1,
  borderColor: 'divider'
}

export const customizationSwitchRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1.5,
  pt: 1.5,
  borderTop: 1,
  borderColor: 'divider'
}

export const previewBoxStyles: SxProps<Theme> = {
  p: 2,
  borderRadius: '12px',
  bgcolor: '#0f0f0f',
  border: '1px solid rgba(255, 184, 0, 0.25)',
  display: 'flex',
  flexDirection: 'column',
  gap: 1.25
}

