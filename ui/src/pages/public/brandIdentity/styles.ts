import type { SxProps, Theme } from '@mui/material'
import { brandColors } from '@theme'

export const pageWrapperStyles: SxProps<Theme> = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  bgcolor: 'background.default',
  width: '100%',
  overflowX: 'hidden'
}

export const headerBoxStyles: SxProps<Theme> = {
  py: 2,
  px: { xs: 2, sm: 4 },
  borderBottom: 1,
  borderColor: 'divider',
  bgcolor: (theme) =>
    theme.palette.mode === 'dark' ? 'rgba(18, 16, 12, 0.92)' : 'rgba(251, 248, 241, 0.92)',
  backdropFilter: 'blur(12px)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  width: '100%'
}

export const headerContainerStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 2
}

export const heroBoxStyles: SxProps<Theme> = {
  pt: { xs: 6, sm: 8, md: 10 },
  pb: { xs: 6, sm: 8 },
  borderBottom: 1,
  borderColor: 'divider',
  background: (theme) =>
    theme.palette.mode === 'dark'
      ? 'radial-gradient(ellipse at 50% 0%, rgba(255, 207, 31, 0.08) 0%, transparent 70%)'
      : 'radial-gradient(ellipse at 50% 0%, rgba(255, 207, 31, 0.18) 0%, transparent 70%)'
}

export const badgeStyles: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 1,
  bgcolor: brandColors.flashYellow,
  color: brandColors.ink,
  px: 2,
  py: 0.6,
  borderRadius: '9999px',
  fontWeight: 800,
  fontSize: '0.82rem',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  mb: 3
}

export const heroTitleStyles: SxProps<Theme> = {
  fontFamily: "'Bricolage Grotesque', sans-serif",
  fontWeight: 800,
  fontSize: { xs: '2.5rem', sm: '3.75rem', md: '4.75rem' },
  letterSpacing: '-0.045em',
  lineHeight: 1,
  mb: 2.5
}

export const heroLeadStyles: SxProps<Theme> = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: { xs: '1.15rem', sm: '1.35rem' },
  color: 'text.secondary',
  lineHeight: 1.55,
  maxWidth: '780px',
  mb: 4
}

export const sectionNavStyles: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 1.2,
  mt: 2
}

export const sectionTitleStyles: SxProps<Theme> = {
  fontFamily: "'Bricolage Grotesque', sans-serif",
  fontWeight: 800,
  fontSize: { xs: '2rem', sm: '2.5rem' },
  letterSpacing: '-0.035em',
  lineHeight: 1.15,
  mb: 1.5
}

export const sectionLeadStyles: SxProps<Theme> = {
  color: 'text.secondary',
  fontSize: { xs: '1rem', sm: '1.15rem' },
  lineHeight: 1.6,
  maxWidth: '740px',
  mb: 4
}

export const cardStyles: SxProps<Theme> = {
  p: { xs: 3, sm: 4 },
  borderRadius: 3.5,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
}

export const colorBlockStyles = (hex: string): SxProps<Theme> => ({
  height: 140,
  borderRadius: 2.5,
  bgcolor: hex,
  display: 'flex',
  alignItems: 'flex-end',
  p: 2,
  position: 'relative',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  cursor: 'pointer',
  transition: 'transform 0.15s ease',
  '&:hover': {
    transform: 'scale(1.02)'
  }
})

export const previewCheckerboardStyles: SxProps<Theme> = {
  borderRadius: 3,
  border: 1,
  borderColor: 'divider',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 280,
  p: 4,
  position: 'relative',
  backgroundImage: (theme) =>
    theme.palette.mode === 'dark'
      ? 'linear-gradient(45deg, #1f1b14 25%, transparent 25%), linear-gradient(-45deg, #1f1b14 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1f1b14 75%), linear-gradient(-45deg, transparent 75%, #1f1b14 75%)'
      : 'linear-gradient(45deg, #ebe7dc 25%, transparent 25%), linear-gradient(-45deg, #ebe7dc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ebe7dc 75%), linear-gradient(-45deg, transparent 75%, #ebe7dc 75%)',
  backgroundSize: '20px 20px',
  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
}

export const footerBoxStyles: SxProps<Theme> = {
  py: 5,
  px: { xs: 2, sm: 4 },
  borderTop: 1,
  borderColor: 'divider',
  bgcolor: 'background.paper',
  mt: 'auto',
  textAlign: 'center'
}

