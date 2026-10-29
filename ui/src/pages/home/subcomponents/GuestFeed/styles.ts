import type { SxProps, Theme } from '@mui/material'
import { brandColors } from '@theme/theme'

export const guestFeedContainerStyles: SxProps<Theme> = {
  bgcolor: 'background.paper',
  borderRadius: '28px',
  p: { xs: 3, sm: 4 },
  border: 1,
  borderColor: 'divider',
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5
}

export const getGuestFeedChipStyles = (isDark: boolean): SxProps<Theme> => ({
  alignSelf: 'flex-start',
  bgcolor: isDark ? brandColors.darkSurface : brandColors.areia,
  color: 'text.primary',
  fontWeight: 700
})

export const getActivityBoxStyles = (isDark: boolean): SxProps<Theme> => ({
  bgcolor: isDark ? brandColors.darkSurface : brandColors.papel,
  p: 2.5,
  borderRadius: '20px',
  border: 1,
  borderColor: 'divider',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})

export const heartIconBoxStyles: SxProps<Theme> = {
  width: 44,
  height: 44,
  borderRadius: '50%',
  bgcolor: brandColors.amareloFlash,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: brandColors.tinta
}

export const guestFeedButtonStyles: SxProps<Theme> = {
  height: 52,
  fontWeight: 800
}

