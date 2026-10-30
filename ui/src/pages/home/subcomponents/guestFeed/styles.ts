import type { SxProps, Theme } from '@mui/material'
import { brandColors } from '@theme'

export const guestFeedContainerStyles: SxProps<Theme> = {
  bgcolor: 'background.paper',
  borderRadius: { xs: '20px', sm: '28px' },
  p: { xs: 2.25, sm: 3.5, md: 4 },
  border: 1,
  borderColor: 'divider',
  display: 'flex',
  flexDirection: 'column',
  gap: { xs: 2, sm: 2.5 },
  width: '100%',
  boxSizing: 'border-box'
}

export const getGuestFeedChipStyles = (isDark: boolean): SxProps<Theme> => ({
  alignSelf: 'flex-start',
  bgcolor: isDark ? brandColors.darkSurface : brandColors.sand,
  color: 'text.primary',
  fontWeight: 700,
  fontSize: { xs: '0.75rem', sm: '0.8125rem' }
})

export const getActivityBoxStyles = (isDark: boolean): SxProps<Theme> => ({
  bgcolor: isDark ? brandColors.darkSurface : brandColors.paper,
  p: { xs: 2, sm: 2.5 },
  borderRadius: { xs: '16px', sm: '20px' },
  border: 1,
  borderColor: 'divider',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1.5,
  width: '100%',
  boxSizing: 'border-box'
})

export const heartIconBoxStyles: SxProps<Theme> = {
  width: { xs: 38, sm: 44 },
  height: { xs: 38, sm: 44 },
  borderRadius: '50%',
  bgcolor: brandColors.flashYellow,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: brandColors.ink,
  flexShrink: 0
}

export const guestFeedButtonStyles: SxProps<Theme> = {
  height: { xs: 48, sm: 52 },
  fontWeight: 800,
  fontSize: { xs: '1rem', sm: '1.05rem' }
}
