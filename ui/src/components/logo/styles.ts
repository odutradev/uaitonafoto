import type { SxProps, Theme } from '@mui/material'
import { brandColors } from '@theme/theme'
import type { LogoDimensions, LogoSize } from './types'

export const getLogoDimensions = (size: LogoSize): LogoDimensions => {
  if (typeof size === 'number') {
    return { symbolSize: size, fontSize: size * 0.85, gap: size * 0.25 }
  }

  switch (size) {
    case 'small':
      return { symbolSize: 28, fontSize: '1.25rem', gap: 1 }
    case 'large':
      return { symbolSize: 52, fontSize: '2.5rem', gap: 2 }
    case 'medium':
    default:
      return { symbolSize: 36, fontSize: '1.75rem', gap: 1.25 }
  }
}

export const getLogoContainerStyles = (isDark: boolean, gap: number | string): SxProps<Theme> => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap,
  userSelect: 'none',
  textDecoration: 'none',
  color: isDark ? brandColors.amareloFlash : brandColors.tinta
})

export const getLogoTextStyles = (fontSize: number | string): SxProps<Theme> => ({
  fontFamily: "'Bricolage Grotesque', 'Helvetica Neue', Arial, sans-serif",
  fontWeight: 800,
  fontSize,
  letterSpacing: '-0.045em',
  lineHeight: 1,
  color: 'inherit',
  whiteSpace: 'nowrap',
  paddingBottom: '2px'
})
