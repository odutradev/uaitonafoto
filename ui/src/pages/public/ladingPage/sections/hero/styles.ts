import type { SxProps, Theme } from '@mui/material'
import { brandColors } from '@theme'

export const heroContainerStyles: SxProps<Theme> = {
  pt: { xs: 5, sm: 7, md: 10 },
  pb: { xs: 5, sm: 7, md: 9 },
  px: { xs: 2, sm: 3 }
}

export const heroStackStyles: SxProps<Theme> = {
  maxWidth: '860px',
  mx: 'auto',
  width: '100%'
}

export const getChipStyles = (isDark: boolean): SxProps<Theme> => ({
  bgcolor: isDark ? brandColors.darkSurface : brandColors.sand,
  color: isDark ? brandColors.flashYellow : brandColors.ink,
  fontWeight: 700,
  fontSize: { xs: '0.75rem', sm: '0.875rem' },
  letterSpacing: '0.02em',
  py: { xs: 1.6, sm: 2.2 },
  px: { xs: 1.25, sm: 1 },
  borderRadius: '9999px',
  border: 1,
  borderColor: 'divider',
  maxWidth: '100%',
  height: 'auto',
  '& .MuiChip-label': {
    px: { xs: 1, sm: 1.5 },
    whiteSpace: 'normal',
    textAlign: 'center'
  }
})

export const heroTitleStyles: SxProps<Theme> = {
  fontSize: { xs: '2.15rem', sm: '3.25rem', md: '4.75rem' },
  letterSpacing: { xs: '-0.035em', md: '-0.05em' },
  lineHeight: { xs: 1.12, md: 0.98 },
  color: 'text.primary',
  wordBreak: 'break-word'
}

export const heroDescriptionStyles: SxProps<Theme> = {
  fontSize: { xs: '1rem', sm: '1.15rem', md: '1.3rem' },
  lineHeight: { xs: 1.5, md: 1.55 },
  color: 'text.secondary',
  maxWidth: '680px',
  px: { xs: 0.5, sm: 0 }
}

export const primaryButtonStyles: SxProps<Theme> = {
  height: { xs: 50, sm: 56 },
  px: { xs: 3, sm: 4 },
  fontSize: { xs: '1rem', sm: '1.125rem' },
  fontWeight: 800,
  width: { xs: '100%', sm: 'auto' }
}

export const secondaryButtonStyles: SxProps<Theme> = {
  height: { xs: 50, sm: 56 },
  px: { xs: 3, sm: 4 },
  fontSize: { xs: '1rem', sm: '1.125rem' },
  fontWeight: 700,
  width: { xs: '100%', sm: 'auto' }
}
