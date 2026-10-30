import type { SxProps, Theme } from '@mui/material'
import { brandColors } from '@theme'

export const getCtaBoxStyles = (isDark: boolean): SxProps<Theme> => ({
  bgcolor: isDark ? brandColors.darkPaper : brandColors.sand,
  color: 'text.primary',
  borderRadius: { xs: '24px', sm: '32px' },
  p: { xs: 3, sm: 5, md: 8 },
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: { xs: 2.5, sm: 3.5 },
  border: 1,
  borderColor: 'divider',
  boxShadow: isDark ? '0 20px 40px rgba(0, 0, 0, 0.3)' : '0 20px 40px rgba(23, 20, 15, 0.08)',
  width: '100%',
  boxSizing: 'border-box'
})

export const ctaTitleStyles: SxProps<Theme> = {
  color: 'text.primary',
  fontSize: { xs: '1.75rem', sm: '2.75rem', md: '3.75rem' },
  letterSpacing: { xs: '-0.035em', md: '-0.045em' },
  maxWidth: '780px',
  wordBreak: 'break-word'
}

export const ctaDescriptionStyles: SxProps<Theme> = {
  color: 'text.secondary',
  fontSize: { xs: '0.9375rem', sm: '1.15rem', md: '1.25rem' },
  lineHeight: 1.55,
  maxWidth: '560px'
}

export const ctaButtonStyles: SxProps<Theme> = {
  height: { xs: 50, sm: 58 },
  px: { xs: 3, sm: 5 },
  fontSize: { xs: '1.05rem', sm: '1.2rem' },
  fontWeight: 800,
  mt: 1,
  width: { xs: '100%', sm: 'auto' }
}
