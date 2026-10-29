import type { SxProps, Theme } from '@mui/material'
import { brandColors } from '@theme/theme'

export const heroContainerStyles: SxProps<Theme> = {
  pt: { xs: 6, md: 10 },
  pb: { xs: 6, md: 9 }
}

export const heroStackStyles: SxProps<Theme> = {
  maxWidth: '860px',
  mx: 'auto'
}

export const getChipStyles = (isDark: boolean): SxProps<Theme> => ({
  bgcolor: isDark ? brandColors.darkSurface : brandColors.areia,
  color: isDark ? brandColors.amareloFlash : brandColors.tinta,
  fontWeight: 700,
  fontSize: '0.875rem',
  letterSpacing: '0.02em',
  py: 2.2,
  px: 1,
  borderRadius: '9999px',
  border: 1,
  borderColor: 'divider'
})

export const heroTitleStyles: SxProps<Theme> = {
  fontSize: { xs: '2.5rem', sm: '3.75rem', md: '4.75rem' },
  letterSpacing: '-0.05em',
  lineHeight: { xs: 1.08, md: 0.98 },
  color: 'text.primary'
}

export const heroDescriptionStyles: SxProps<Theme> = {
  fontSize: { xs: '1.125rem', md: '1.3rem' },
  lineHeight: 1.55,
  color: 'text.secondary',
  maxWidth: '680px'
}

export const primaryButtonStyles: SxProps<Theme> = {
  height: 56,
  px: 4,
  fontSize: '1.125rem',
  fontWeight: 800
}

export const secondaryButtonStyles: SxProps<Theme> = {
  height: 56,
  px: 4,
  fontSize: '1.125rem',
  fontWeight: 700
}

