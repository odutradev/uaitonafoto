import type { SxProps, Theme } from '@mui/material'
import { brandColors } from '@styles/theme'

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

export const tagBadgeStyles: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.75,
  px: 1.5,
  py: 0.5,
  borderRadius: '12px',
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
  fontSize: '0.8125rem',
  fontWeight: 700,
  color: 'text.primary',
  width: 'fit-content'
}

export const sectionTitleStyles: SxProps<Theme> = {
  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
  letterSpacing: '-0.04em',
  color: 'text.primary'
}

export const sectionSubtitleStyles: SxProps<Theme> = {
  maxWidth: '620px',
  fontSize: { xs: '0.9375rem', sm: '1.05rem', md: '1.1rem' },
  color: 'text.secondary',
  lineHeight: 1.55
}

export const featuresGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
  gap: { xs: 2.5, md: 3 },
  width: '100%'
}

export const getFeatureCardStyles = (isDark: boolean): SxProps<Theme> => ({
  borderRadius: { xs: '20px', sm: '24px' },
  p: { xs: 2.5, sm: 3 },
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: isDark ? 'divider' : 'rgba(0, 0, 0, 0.06)',
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
  height: '100%',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: isDark
      ? '0 12px 28px rgba(0, 0, 0, 0.4)'
      : '0 12px 28px rgba(0, 0, 0, 0.06)'
  }
})

export const getFeatureIconBoxStyles = (isDark: boolean): SxProps<Theme> => ({
  width: 48,
  height: 48,
  borderRadius: '14px',
  bgcolor: isDark ? 'rgba(255, 214, 10, 0.14)' : 'rgba(255, 214, 10, 0.3)',
  color: isDark ? brandColors.flashYellow : brandColors.ink,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
})

export const cardBadgeStyles: SxProps<Theme> = {
  px: 1,
  py: 0.25,
  borderRadius: '8px',
  fontSize: '0.7rem',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  bgcolor: 'primary.main',
  color: 'primary.contrastText',
  width: 'fit-content'
}
