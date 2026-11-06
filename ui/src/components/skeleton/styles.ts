import type { SxProps, Theme } from '@mui/material'

export const getSkeletonStyles = (
  isDark: boolean,
  borderRadius?: number | string
): SxProps<Theme> => ({
  bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(23, 20, 15, 0.08)',
  borderRadius: borderRadius ?? '8px',
  '&::after': {
    background: isDark
      ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)'
  }
})
