import type { SxProps, Theme } from '@mui/material'
import { brandColors } from '@theme/theme'

export const getCtaBoxStyles = (isDark: boolean): SxProps<Theme> => ({
  bgcolor: isDark ? brandColors.darkPaper : brandColors.areia,
  color: 'text.primary',
  borderRadius: '32px',
  p: { xs: 4, sm: 6, md: 8 },
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 3.5,
  border: 1,
  borderColor: 'divider',
  boxShadow: isDark ? '0 20px 40px rgba(0, 0, 0, 0.3)' : '0 20px 40px rgba(23, 20, 15, 0.08)'
})

export const ctaTitleStyles: SxProps<Theme> = {
  color: 'text.primary',
  fontSize: { xs: '2rem', sm: '3rem', md: '3.75rem' },
  maxWidth: '780px'
}

export const ctaDescriptionStyles: SxProps<Theme> = {
  color: 'text.secondary',
  fontSize: { xs: '1.1rem', sm: '1.25rem' },
  maxWidth: '560px'
}

export const ctaButtonStyles: SxProps<Theme> = {
  height: 58,
  px: 5,
  fontSize: '1.2rem',
  fontWeight: 800,
  mt: 1
}
