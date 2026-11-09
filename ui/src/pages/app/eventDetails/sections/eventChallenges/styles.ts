import type { SxProps, Theme } from '@mui/material'

export const challengesCardStyles: SxProps<Theme> = {
  p: { xs: 2.5, sm: 3.5 },
  display: 'flex',
  flexDirection: 'column',
  gap: 3
}

export const challengesHeaderRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'flex-start', sm: 'center' },
  justifyContent: 'space-between',
  gap: 2
}

export const addChallengeFormRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  gap: 1.5,
  p: 2,
  borderRadius: '16px',
  bgcolor: 'action.hover',
  border: 1,
  borderColor: 'divider',
  alignItems: { xs: 'stretch', sm: 'center' }
}

export const challengeListStackStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5
}

export const challengeItemCardStyles = (active: boolean): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 2,
  p: 2,
  borderRadius: '16px',
  border: 1,
  borderColor: active ? 'divider' : 'action.disabledBackground',
  bgcolor: active ? 'background.paper' : 'action.hover',
  opacity: active ? 1 : 0.65,
  transition: 'all 0.15s ease-in-out'
})

export const challengeActionsRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  flexShrink: 0
}
