import type { SxProps, Theme } from '@mui/material'
import { brandColors } from '@theme'

export const getSectionBoxStyles = (isDark: boolean): SxProps<Theme> => ({
  bgcolor: isDark ? brandColors.darkSurface : brandColors.sand,
  py: { xs: 6, sm: 8, md: 10 },
  borderTop: 1,
  borderBottom: 1,
  borderColor: 'divider',
  transition: 'background-color 0.3s ease',
  width: '100%'
})

export const sectionHeaderStyles: SxProps<Theme> = {
  textAlign: 'center',
  alignItems: 'center',
  mb: { xs: 4, sm: 5, md: 6 },
  px: { xs: 1, sm: 0 }
}

export const sectionTitleStyles: SxProps<Theme> = {
  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
  letterSpacing: '-0.04em',
  color: 'text.primary'
}

export const sectionSubtitleStyles: SxProps<Theme> = {
  maxWidth: '540px',
  fontSize: { xs: '0.9375rem', sm: '1.05rem', md: '1.1rem' },
  color: 'text.secondary',
  lineHeight: 1.55
}

export const stepsGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
  gap: { xs: 2.5, md: 3.5 },
  width: '100%'
}

export const stepCardStyles: SxProps<Theme> = {
  borderRadius: { xs: '20px', sm: '24px' },
  p: { xs: 1, sm: 1.5 },
  display: 'flex',
  flexDirection: 'column'
}

export const getStepIconBoxStyles = (isStep2: boolean, isDark: boolean): SxProps<Theme> => {
  const iconBg = isStep2
    ? isDark
      ? brandColors.flashYellow
      : brandColors.ink
    : brandColors.flashYellow
  const iconColor = isStep2
    ? isDark
      ? brandColors.ink
      : brandColors.flashYellow
    : brandColors.ink

  return {
    width: { xs: 48, sm: 56 },
    height: { xs: 48, sm: 56 },
    borderRadius: { xs: '14px', sm: '16px' },
    bgcolor: iconBg,
    color: iconColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  }
}
