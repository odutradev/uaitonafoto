import type { SxProps, Theme } from '@mui/material'
import { brandColors } from '@styles/theme'

export const getSectionBoxStyles = (isDark: boolean): SxProps<Theme> => ({
  bgcolor: isDark ? brandColors.darkSurface : brandColors.sand,
  py: { xs: 6, sm: 8, md: 10 },
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
  mb: { xs: 4, sm: 5, md: 6 },
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
  maxWidth: '620px',
  fontSize: { xs: '0.9375rem', sm: '1.05rem', md: '1.15rem' },
  color: 'text.secondary',
  lineHeight: 1.6
}

export const plansGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, 1fr)',
    lg: 'repeat(4, 1fr)'
  },
  gap: { xs: 3, sm: 2.5, lg: 2 },
  alignItems: 'stretch',
  width: '100%',
  pt: { xs: 3, sm: 3.5 },
  pb: 1,
  mb: { xs: 5, sm: 6, md: 7 }
}

export const getPlanCardStyles = (highlighted: boolean, isDark: boolean): SxProps<Theme> => ({
  borderRadius: { xs: '22px', sm: '26px' },
  p: { xs: 2.5, sm: 3 },
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'visible !important',
  border: highlighted ? '2px solid' : '1px solid',
  borderColor: highlighted ? brandColors.flashYellow : isDark ? brandColors.darkBorder : brandColors.lightBorder,
  bgcolor: isDark ? brandColors.darkPaper : '#FFFFFF',
  boxShadow: highlighted
    ? isDark
      ? '0 12px 36px rgba(0, 0, 0, 0.55), 0 0 24px rgba(255, 207, 31, 0.2)'
      : '0 12px 36px rgba(23, 20, 15, 0.09), 0 0 24px rgba(255, 207, 31, 0.3)'
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
  boxShadow: '0 4px 14px rgba(255, 207, 31, 0.5)',
  zIndex: 10,
  whiteSpace: 'nowrap',
  lineHeight: 1
}

export const planTagStyles: SxProps<Theme> = {
  fontSize: '0.8125rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'text.secondary',
  mb: 0.5
}

export const planTitleStyles: SxProps<Theme> = {
  fontSize: { xs: '1.4rem', sm: '1.6rem' },
  fontWeight: 800,
  color: 'text.primary',
  mb: 0.5
}

export const priceContainerStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'baseline',
  gap: 1,
  my: 1.5
}

export const priceTextStyles: SxProps<Theme> = {
  fontSize: { xs: '2rem', sm: '2.25rem', lg: '2.4rem' },
  fontFamily: "'Bricolage Grotesque', sans-serif",
  fontWeight: 800,
  letterSpacing: '-0.04em',
  color: 'text.primary',
  lineHeight: 1
}

export const periodTextStyles: SxProps<Theme> = {
  fontSize: '0.875rem',
  color: 'text.secondary',
  fontWeight: 500
}

export const subBadgeContainerStyles: SxProps<Theme> = {
  minHeight: 28,
  display: 'flex',
  alignItems: 'center',
  mb: 2
}

export const costPerEventBadgeStyles: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  bgcolor: 'rgba(255, 207, 31, 0.15)',
  color: 'text.primary',
  px: 1.25,
  py: 0.4,
  borderRadius: '8px',
  fontSize: '0.75rem',
  fontWeight: 700,
  lineHeight: 1.2
}

export const subBadgeNeutralStyles: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  bgcolor: (theme: Theme) =>
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(23, 20, 15, 0.05)',
  color: 'text.secondary',
  px: 1.25,
  py: 0.4,
  borderRadius: '8px',
  fontSize: '0.75rem',
  fontWeight: 600,
  lineHeight: 1.2
}

export const planDescriptionStyles: SxProps<Theme> = {
  fontSize: '0.875rem',
  color: 'text.secondary',
  lineHeight: 1.5,
  minHeight: { xs: 'auto', md: '56px' },
  mb: 2.5
}

export const featureItemStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1,
  fontSize: '0.84rem',
  color: 'text.primary',
  lineHeight: 1.35
}

export const featureInfoButtonStyles: SxProps<Theme> = {
  p: 0.35,
  ml: 'auto',
  color: 'text.secondary',
  opacity: 0.65,
  flexShrink: 0,
  transition: 'all 0.2s ease',
  '&:hover': {
    opacity: 1,
    color: 'primary.main',
    bgcolor: (theme: Theme) =>
      theme.palette.mode === 'dark' ? 'rgba(255, 207, 31, 0.12)' : 'rgba(255, 207, 31, 0.2)'
  }
}

export const checkIconStyles: SxProps<Theme> = {
  fontSize: 17,
  color: brandColors.flashYellow,
  flexShrink: 0
}

export const getPlanCtaButtonStyles = (highlighted: boolean, isDark: boolean): SxProps<Theme> => ({
  mt: 'auto',
  width: '100%',
  height: { xs: 46, sm: 50 },
  borderRadius: '14px',
  fontSize: { xs: '0.875rem', sm: '0.9375rem' },
  fontWeight: 800,
  letterSpacing: '-0.01em',
  whiteSpace: 'nowrap',
  textTransform: 'none',
  transition: 'all 0.25s ease',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  ...(highlighted
    ? {
        bgcolor: brandColors.flashYellow,
        color: brandColors.ink,
        boxShadow: '0 6px 20px rgba(255, 207, 31, 0.35)',
        border: 'none',
        '&:hover': {
          bgcolor: '#EAB308',
          boxShadow: '0 8px 24px rgba(255, 207, 31, 0.45)',
          transform: 'translateY(-2px)'
        }
      }
    : {
        bgcolor: 'transparent',
        color: 'text.primary',
        border: '1.5px solid',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.16)',
        '&:hover': {
          borderColor: brandColors.flashYellow,
          bgcolor: isDark ? 'rgba(255, 207, 31, 0.08)' : 'rgba(255, 207, 31, 0.12)',
          transform: 'translateY(-2px)'
        }
      }),
  '& .MuiButton-endIcon': {
    transition: 'transform 0.2s ease',
    ml: 1,
    '& svg': {
      fontSize: 18
    }
  },
  '&:hover .MuiButton-endIcon': {
    transform: 'translateX(3px)'
  }
})
