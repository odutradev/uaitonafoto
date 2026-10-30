import type { SxProps, Theme } from '@mui/material'
import { brandColors } from '@theme'
import type { LogoDimensions, LogoSize } from './types'

export const getLogoDimensions = (size: LogoSize): LogoDimensions => {
  if (typeof size === 'number') {
    return { symbolSize: size, fontSize: size * 0.85, gap: size * 0.25 }
  }

  switch (size) {
    case 'small':
      return {
        symbolSize: { xs: 24, sm: 28 },
        fontSize: { xs: '1.05rem', sm: '1.25rem' },
        gap: { xs: 0.75, sm: 1 }
      }
    case 'large':
      return {
        symbolSize: { xs: 36, sm: 44, md: 52 },
        fontSize: { xs: '1.625rem', sm: '2.1rem', md: '2.5rem' },
        gap: { xs: 1.25, sm: 1.5, md: 2 }
      }
    case 'medium':
    default:
      return {
        symbolSize: { xs: 28, sm: 36 },
        fontSize: { xs: '1.25rem', sm: '1.75rem' },
        gap: { xs: 1, sm: 1.25 }
      }
  }
}

export const getLogoContainerStyles = (
  isDark: boolean,
  gap: number | string | Record<string, number | string>
): SxProps<Theme> => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap,
  userSelect: 'none',
  textDecoration: 'none',
  color: isDark ? brandColors.flashYellow : brandColors.ink,
  flexShrink: 0
})

export const getLogoTextStyles = (
  fontSize: number | string | Record<string, number | string>
): SxProps<Theme> => ({
  fontFamily: "'Bricolage Grotesque', 'Helvetica Neue', Arial, sans-serif",
  fontWeight: 800,
  fontSize,
  letterSpacing: '-0.045em',
  lineHeight: 1,
  color: 'inherit',
  whiteSpace: 'nowrap',
  paddingBottom: '2px'
})
