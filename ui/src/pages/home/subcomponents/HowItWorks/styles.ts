import type { SxProps, Theme } from '@mui/material'
import { brandColors } from '@theme/theme'

export const getSectionBoxStyles = (isDark: boolean): SxProps<Theme> => ({
  bgcolor: isDark ? brandColors.darkSurface : brandColors.areia,
  py: { xs: 8, md: 10 },
  borderTop: 1,
  borderBottom: 1,
  borderColor: 'divider',
  transition: 'background-color 0.3s ease'
})

export const sectionHeaderStyles: SxProps<Theme> = {
  textAlign: 'center',
  alignItems: 'center',
  mb: 6
}

export const sectionTitleStyles: SxProps<Theme> = {
  fontSize: { xs: '2rem', md: '2.75rem' },
  color: 'text.primary'
}

export const sectionSubtitleStyles: SxProps<Theme> = {
  maxWidth: '540px',
  fontSize: '1.1rem',
  color: 'text.secondary'
}

export const stepsGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
  gap: 3.5
}

export const stepCardStyles: SxProps<Theme> = {
  borderRadius: '24px',
  p: 2,
  display: 'flex',
  flexDirection: 'column'
}

export const getStepIconBoxStyles = (isStep2: boolean, isDark: boolean): SxProps<Theme> => {
  const iconBg = isStep2
    ? isDark
      ? brandColors.amareloFlash
      : brandColors.tinta
    : brandColors.amareloFlash
  const iconColor = isStep2
    ? isDark
      ? brandColors.tinta
      : brandColors.amareloFlash
    : brandColors.tinta

  return {
    width: 56,
    height: 56,
    borderRadius: '16px',
    bgcolor: iconBg,
    color: iconColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}
