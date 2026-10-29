import type { SxProps, Theme } from '@mui/material'
import { brandColors } from '@theme'

export const getThemeToggleButtonStyles = (isDark: boolean): SxProps<Theme> => ({
  width: 42,
  height: 42,
  borderRadius: '50%',
  bgcolor: isDark ? 'rgba(255, 207, 31, 0.12)' : 'rgba(23, 20, 15, 0.06)',
  color: isDark ? brandColors.flashYellow : brandColors.ink,
  border: `1px solid ${isDark ? brandColors.darkBorder : brandColors.lightBorder}`,
  transition: 'all 0.2s ease',
  '&:hover': {
    bgcolor: isDark ? 'rgba(255, 207, 31, 0.22)' : 'rgba(23, 20, 15, 0.12)'
  }
})

export const themeToggleIconStyles: SxProps<Theme> = {
  fontSize: 20
}
