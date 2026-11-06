import type { SxProps, Theme } from '@mui/material'
import { brandColors } from '@theme'

export const getSectionBoxStyles = (isDark: boolean): SxProps<Theme> => ({
  bgcolor: isDark ? brandColors.darkSurface : brandColors.sand,
  py: { xs: 8, sm: 10, md: 12 },
  borderTop: 1,
  borderBottom: 1,
  borderColor: 'divider',
  transition: 'background-color 0.3s ease',
  width: '100%',
  position: 'relative'
})

export const sectionHeaderStyles: SxProps<Theme> = {
  textAlign: 'center',
  alignItems: 'center',
  mb: { xs: 5, sm: 6, md: 8 },
  px: { xs: 1, sm: 0 }
}

export const tagBadgeStyles: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 1,
  px: 2,
  py: 0.75,
  borderRadius: '9999px',
  bgcolor: 'background.paper',
  border: 1,
  borderColor: 'divider',
  fontSize: '0.875rem',
  fontWeight: 600,
  letterSpacing: '-0.01em',
  color: 'text.secondary'
}

export const sectionTitleStyles: SxProps<Theme> = {
  fontSize: { xs: '2rem', sm: '2.5rem', md: '3.25rem' },
  letterSpacing: '-0.04em',
  color: 'text.primary',
  maxWidth: '780px'
}

export const sectionSubtitleStyles: SxProps<Theme> = {
  maxWidth: '600px',
  fontSize: { xs: '0.9375rem', sm: '1.05rem', md: '1.15rem' },
  color: 'text.secondary',
  lineHeight: 1.6
}

export const plansGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
  gap: { xs: 3, md: 3.5 },
  alignItems: 'stretch',
  width: '100%',
  mb: { xs: 5, sm: 6, md: 8 }
}

export const getPlanCardStyles = (highlighted: boolean, isDark: boolean): SxProps<Theme> => ({
  borderRadius: { xs: '24px', sm: '28px' },
  p: { xs: 3, sm: 3.5 },
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  border: highlighted ? '2px solid' : '1px solid',
  borderColor: highlighted ? brandColors.flashYellow : isDark ? brandColors.darkBorder : brandColors.lightBorder,
  bgcolor: highlighted
    ? isDark
      ? brandColors.darkPaper
      : '#FFFFFF'
    : isDark
      ? brandColors.darkPaper
      : '#FFFFFF',
  boxShadow: highlighted
    ? isDark
      ? '0 12px 36px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 207, 31, 0.15)'
      : '0 12px 36px rgba(23, 20, 15, 0.08), 0 0 20px rgba(255, 207, 31, 0.25)'
    : 'none',
  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
  '&:hover': {
    transform: 'translateY(-4px)'
  }
})

export const popularBadgeStyles: SxProps<Theme> = {
  position: 'absolute',
  top: -14,
  left: '50%',
  transform: 'translateX(-50%)',
  bgcolor: brandColors.flashYellow,
  color: brandColors.ink,
  px: 2,
  py: 0.5,
  borderRadius: '9999px',
  fontSize: '0.75rem',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  boxShadow: '0 4px 12px rgba(255, 207, 31, 0.4)'
}

export const planTagStyles: SxProps<Theme> = {
  fontSize: '0.8125rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'text.secondary'
}

export const planTitleStyles: SxProps<Theme> = {
  fontSize: { xs: '1.5rem', sm: '1.75rem' },
  fontWeight: 800,
  color: 'text.primary',
  mb: 1
}

export const priceContainerStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'baseline',
  gap: 1,
  my: 1.5
}

export const priceTextStyles: SxProps<Theme> = {
  fontSize: { xs: '2.25rem', sm: '2.75rem' },
  fontFamily: "'Bricolage Grotesque', sans-serif",
  fontWeight: 800,
  letterSpacing: '-0.04em',
  color: 'text.primary'
}

export const periodTextStyles: SxProps<Theme> = {
  fontSize: '0.9375rem',
  color: 'text.secondary',
  fontWeight: 500
}

export const costPerEventBadgeStyles: SxProps<Theme> = {
  display: 'inline-block',
  bgcolor: 'rgba(255, 207, 31, 0.15)',
  color: 'text.primary',
  px: 1.5,
  py: 0.5,
  borderRadius: '8px',
  fontSize: '0.8125rem',
  fontWeight: 700,
  mb: 2,
  width: 'fit-content'
}

export const planDescriptionStyles: SxProps<Theme> = {
  fontSize: '0.9375rem',
  color: 'text.secondary',
  lineHeight: 1.55,
  mb: 3
}

export const featureItemStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 1.25,
  fontSize: '0.875rem',
  color: 'text.primary',
  lineHeight: 1.45
}

export const checkIconStyles: SxProps<Theme> = {
  fontSize: 18,
  color: brandColors.flashYellow,
  flexShrink: 0,
  mt: 0.25
}

export const upsellCardStyles = (isDark: boolean): SxProps<Theme> => ({
  borderRadius: { xs: '20px', sm: '24px' },
  p: { xs: 2.5, sm: 3.5 },
  bgcolor: isDark ? brandColors.darkPaper : '#FFFFFF',
  border: '1px dashed',
  borderColor: isDark ? brandColors.darkBorder : brandColors.sandDark,
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  alignItems: { xs: 'flex-start', md: 'center' },
  justifyContent: 'space-between',
  gap: 2.5
})
