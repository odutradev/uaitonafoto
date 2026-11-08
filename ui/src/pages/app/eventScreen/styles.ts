import { brandColors } from '@theme'
import type { SxProps, Theme } from '@mui/material'

export const screenRootStyles: SxProps<Theme> = {
  position: 'fixed',
  inset: 0,
  bgcolor: brandColors.darkBg,
  color: brandColors.darkTextPrimary,
  display: 'flex',
  flexDirection: 'column',
  p: { xs: 2, sm: 3, md: 4 },
  overflow: 'hidden'
}

export const topBarStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 2,
  mb: { xs: 2, md: 3 },
  width: '100%',
  flexShrink: 0
}

export const liveBadgeWrapperStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5
}

export const liveDotStyles: SxProps<Theme> = {
  width: 12,
  height: 12,
  borderRadius: '50%',
  bgcolor: brandColors.flashYellow,
  boxShadow: `0 0 14px ${brandColors.flashYellow}`,
  animation: 'pulseLive 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  '@keyframes pulseLive': {
    '0%, 100%': {
      opacity: 1,
      transform: 'scale(1)'
    },
    '50%': {
      opacity: 0.5,
      transform: 'scale(0.85)'
    }
  }
}

export const liveTextStyles: SxProps<Theme> = {
  fontFamily: "'Bricolage Grotesque', sans-serif",
  fontWeight: 900,
  fontSize: { xs: '1rem', md: '1.25rem' },
  letterSpacing: '0.06em',
  color: '#FFFFFF'
}

export const controlsRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  opacity: 0.45,
  transition: 'opacity 0.2s ease',
  '&:hover': {
    opacity: 1
  }
}

export const iconButtonStyles: SxProps<Theme> = {
  color: '#FFFFFF',
  bgcolor: 'rgba(255, 255, 255, 0.08)',
  '&:hover': {
    bgcolor: 'rgba(255, 255, 255, 0.16)'
  }
}

export const contentGridStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  gap: { xs: 2, md: 3.5 },
  flex: 1,
  minHeight: 0,
  width: '100%'
}

export const leftColumnStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
  height: '100%'
}

export const mainCardStyles: SxProps<Theme> = {
  flex: 1,
  bgcolor: brandColors.darkPaper,
  borderRadius: '28px',
  border: `1px solid ${brandColors.darkBorder}`,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative',
  minHeight: 0
}

export const photoContainerStyles: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  p: { xs: 1.5, md: 2.5 },
  bgcolor: '#0E0C09'
}

export const photoStyles: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  borderRadius: '16px'
}

export const yellowBannerStyles: SxProps<Theme> = {
  bgcolor: brandColors.flashYellow,
  color: brandColors.ink,
  px: { xs: 2.5, md: 4 },
  py: { xs: 1.5, md: 2.25 },
  borderBottomLeftRadius: '26px',
  borderBottomRightRadius: '26px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 2,
  flexShrink: 0
}

export const bannerTextRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'baseline',
  flexWrap: 'wrap',
  minWidth: 0
}

export const bannerAuthorStyles: SxProps<Theme> = {
  fontFamily: "'Bricolage Grotesque', sans-serif",
  fontWeight: 900,
  fontSize: { xs: '1.25rem', md: '2rem' },
  lineHeight: 1.1,
  letterSpacing: '-0.03em',
  color: brandColors.ink
}

export const bannerTextStyles: SxProps<Theme> = {
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 700,
  fontSize: { xs: '1rem', md: '1.4rem' },
  ml: 1.25,
  color: brandColors.ink,
  opacity: 0.95
}

export const bannerLikesStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.75,
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 800,
  fontSize: { xs: '1rem', md: '1.35rem' },
  color: brandColors.ink
}

export const thumbnailsRowStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: 'repeat(6, 1fr)',
  gap: { xs: 1, md: 1.75 },
  mt: { xs: 1.5, md: 2.5 },
  height: { xs: 60, md: 92 },
  flexShrink: 0
}

export const getThumbnailSlotStyles = (isActive: boolean = false): SxProps<Theme> => ({
  borderRadius: '18px',
  bgcolor: brandColors.darkSurface,
  overflow: 'hidden',
  border: isActive ? `3px solid ${brandColors.flashYellow}` : `1.5px solid ${brandColors.darkBorder}`,
  boxShadow: isActive ? '0 0 16px rgba(255, 207, 31, 0.45)' : 'none',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    borderColor: brandColors.flashYellow
  }
})

export const thumbnailImgStyles: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
}

export const rightCardStyles: SxProps<Theme> = {
  width: { xs: '100%', md: 330, lg: 380 },
  bgcolor: '#FFFFFF',
  color: brandColors.ink,
  borderRadius: '28px',
  p: { xs: 2.5, md: 3.5 },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 2.5,
  flexShrink: 0,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)'
}

export const qrFrameStyles: SxProps<Theme> = {
  border: `2px solid ${brandColors.ink}`,
  borderRadius: '24px',
  p: { xs: 1.5, md: 2.5 },
  width: '100%',
  aspectRatio: '1 / 1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  bgcolor: 'transparent'
}

export const qrTextContainerStyles: SxProps<Theme> = {
  width: '100%',
  textAlign: 'left'
}

export const qrTitleStyles: SxProps<Theme> = {
  fontFamily: "'Bricolage Grotesque', sans-serif",
  fontWeight: 900,
  fontSize: { xs: '1.65rem', md: '2.1rem' },
  lineHeight: 1.05,
  letterSpacing: '-0.04em',
  color: brandColors.ink
}

export const qrSubtitleStyles: SxProps<Theme> = {
  fontFamily: "'DM Sans', sans-serif",
  color: brandColors.textGray,
  fontSize: { xs: '0.95rem', md: '1.1rem' },
  fontWeight: 600,
  mt: 0.75
}

export const qrPinBadgeStyles: SxProps<Theme> = {
  mt: 1.75,
  px: 2,
  py: 0.75,
  borderRadius: '12px',
  bgcolor: brandColors.sand,
  border: `1px solid ${brandColors.sandDark}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%'
}

export const qrPinLabelStyles: SxProps<Theme> = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.85rem',
  fontWeight: 700,
  color: brandColors.textGray,
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
}

export const qrPinCodeStyles: SxProps<Theme> = {
  fontFamily: 'monospace',
  fontSize: '1.25rem',
  fontWeight: 900,
  letterSpacing: '0.2em',
  color: brandColors.ink
}

export const waitingEmptyStyles: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  p: 4,
  gap: 2
}

export const activationWrapperStyles: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%'
}

export const activationCardStyles: SxProps<Theme> = {
  width: '100%',
  maxWidth: 440,
  p: { xs: 3.5, sm: 4.5 },
  borderRadius: '28px',
  bgcolor: brandColors.darkPaper,
  border: `1px solid ${brandColors.darkBorder}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: 2.5,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
}
