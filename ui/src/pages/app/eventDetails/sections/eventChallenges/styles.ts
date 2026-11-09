import type { SxProps, Theme } from '@mui/material'

export const challengesCardStyles: SxProps<Theme> = {
  p: { xs: 2, sm: 3 },
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5
}

export const challengesHeaderRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'flex-start', sm: 'center' },
  justifyContent: 'space-between',
  gap: 1.5
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

export const resetButtonStyles: SxProps<Theme> = {
  minHeight: 36,
  px: 1.5,
  py: 0.5,
  fontSize: '0.8125rem',
  fontWeight: 600,
  borderRadius: '10px',
  borderWidth: '1px',
  borderColor: 'divider',
  color: 'text.secondary',
  whiteSpace: 'nowrap',
  '&:hover': {
    borderWidth: '1px',
    color: 'text.primary'
  }
}

export const addChallengeFormRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  gap: 1,
  alignItems: { xs: 'stretch', sm: 'center' }
}

export const addChallengeButtonStyles: SxProps<Theme> = {
  minHeight: 40,
  px: 2,
  py: 0.75,
  fontSize: '0.8125rem',
  fontWeight: 600,
  borderRadius: '10px',
  whiteSpace: 'nowrap',
  flexShrink: 0
}

export const challengeListStackStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1
}

export const challengeItemCardStyles = (active: boolean): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1.5,
  px: 1.75,
  py: 1.25,
  borderRadius: '10px',
  border: 1,
  borderColor: active ? 'divider' : 'action.disabledBackground',
  bgcolor: active ? 'action.hover' : 'transparent',
  opacity: active ? 1 : 0.6,
  transition: 'all 0.15s ease-in-out'
})

export const challengeActionsRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
  flexShrink: 0
}

