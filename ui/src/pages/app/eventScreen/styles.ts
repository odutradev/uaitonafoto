import { brandColors } from '@theme'
import type { SxProps, Theme } from '@mui/material'

export const screenRootStyles: SxProps<Theme> = {
  position: 'fixed',
  inset: 0,
  bgcolor: 'background.default',
  color: 'text.primary',
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

export const controlsChipStyles: SxProps<Theme> = (theme) => ({
  display: 'inline-flex',
  alignItems: 'center',
  p: '4px',
  gap: 0.5,
  borderRadius: '9999px',
  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
  border: `1px solid ${theme.palette.divider}`,
  backdropFilter: 'blur(8px)',
  transition: 'opacity 0.2s ease',
  opacity: 0.75,
  '&:hover': {
    opacity: 1
  }
})

export const iconButtonStyles: SxProps<Theme> = (theme) => ({
  color: 'text.primary',
  width: 34,
  height: 34,
  p: 0,
  borderRadius: '9999px',
  transition: 'all 0.15s ease',
  '&:hover': {
    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'
  }
})

export const screenAgencyBadgeStyles: SxProps<Theme> = (theme) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 1.5,
  px: 2,
  py: 0.6,
  borderRadius: '9999px',
  bgcolor: theme.palette.mode === 'dark' ? 'rgba(26, 26, 26, 0.85)' : 'rgba(255, 255, 255, 0.9)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 184, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)'}`,
  backdropFilter: 'blur(12px)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  maxWidth: { xs: '100%', sm: 'auto' }
})

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

export const getMainCardStyles = (isNew = false): SxProps<Theme> => (theme) => ({
  flex: 1,
  bgcolor: theme.palette.mode === 'dark' ? brandColors.darkPaper : '#FFFFFF',
  borderRadius: '28px',
  border: isNew
    ? `2px solid ${brandColors.flashYellow}`
    : `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative',
  minHeight: 0,
  boxShadow: isNew
    ? '0 0 45px rgba(255, 214, 10, 0.45)'
    : theme.palette.mode === 'dark'
      ? 'none'
      : '0 8px 30px rgba(0, 0, 0, 0.06)',
  transition: 'box-shadow 0.5s ease, border-color 0.5s ease'
})

export const mainCardStyles: SxProps<Theme> = getMainCardStyles(false)

export const photoContainerStyles: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  p: { xs: 1.5, md: 2.5 },
  bgcolor: '#0E0C09',
  position: 'relative'
}

export const photoBackdropStyles: SxProps<Theme> = {
  position: 'absolute',
  inset: -30,
  width: 'calc(100% + 60px)',
  height: 'calc(100% + 60px)',
  objectFit: 'cover',
  objectPosition: 'center',
  filter: 'blur(36px) brightness(0.42) saturate(1.25)',
  transform: 'scale(1.15)',
  pointerEvents: 'none',
  zIndex: 0
}

export const getPhotoStyles = (isNew = false): SxProps<Theme> => ({
  width: '100%',
  height: '100%',
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
  borderRadius: '16px',
  position: 'relative',
  zIndex: 1,
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)',
  animation: isNew ? 'photoEntrance 0.7s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
  transition: 'transform 0.4s ease, opacity 0.4s ease',
  '@keyframes photoEntrance': {
    '0%': {
      opacity: 0,
      transform: 'scale(0.92)'
    },
    '60%': {
      opacity: 1,
      transform: 'scale(1.02)'
    },
    '100%': {
      opacity: 1,
      transform: 'scale(1)'
    }
  }
})

export const photoStyles: SxProps<Theme> = getPhotoStyles(false)

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
  height: { xs: 76, sm: 100, md: 135, lg: 155, xl: 170 },
  flexShrink: 0
}

export const getThumbnailSlotStyles = (isActive: boolean = false): SxProps<Theme> => (theme) => ({
  borderRadius: '18px',
  bgcolor: theme.palette.mode === 'dark' ? brandColors.darkSurface : brandColors.sand,
  overflow: 'hidden',
  border: isActive ? `3px solid ${brandColors.flashYellow}` : `1.5px solid ${theme.palette.divider}`,
  boxShadow: isActive ? '0 0 16px rgba(255, 207, 31, 0.45)' : 'none',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    borderColor: brandColors.flashYellow
  }
})

export const thumbnailImgStyles: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center'
}

export const rightCardStyles: SxProps<Theme> = (theme) => ({
  width: { xs: '100%', md: 330, lg: 380 },
  bgcolor: theme.palette.mode === 'dark' ? brandColors.darkPaper : '#FFFFFF',
  color: theme.palette.mode === 'dark' ? brandColors.darkTextPrimary : brandColors.ink,
  borderRadius: '28px',
  border: `1px solid ${theme.palette.divider}`,
  p: { xs: 2.5, md: 3.5 },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 2.5,
  flexShrink: 0,
  boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 8px 30px rgba(0, 0, 0, 0.08)'
})

export const qrFrameStyles: SxProps<Theme> = (theme) => ({
  border: `2px solid ${theme.palette.mode === 'dark' ? 'transparent' : brandColors.ink}`,
  borderRadius: '24px',
  p: { xs: 1.5, md: 2.5 },
  width: '100%',
  aspectRatio: '1 / 1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  bgcolor: '#FFFFFF'
})

export const qrTextContainerStyles: SxProps<Theme> = {
  width: '100%',
  textAlign: 'left'
}

export const qrTitleStyles: SxProps<Theme> = (theme) => ({
  fontFamily: "'Bricolage Grotesque', sans-serif",
  fontWeight: 900,
  fontSize: { xs: '1.65rem', md: '2.1rem' },
  lineHeight: 1.05,
  letterSpacing: '-0.04em',
  color: theme.palette.mode === 'dark' ? brandColors.darkTextPrimary : brandColors.ink
})

export const qrSubtitleStyles: SxProps<Theme> = (theme) => ({
  fontFamily: "'DM Sans', sans-serif",
  color: theme.palette.mode === 'dark' ? brandColors.darkTextSecondary : brandColors.textGray,
  fontSize: { xs: '0.95rem', md: '1.1rem' },
  fontWeight: 600,
  mt: 0.75
})

export const qrPinBadgeStyles: SxProps<Theme> = (theme) => ({
  mt: 1.75,
  px: 2,
  py: 0.75,
  borderRadius: '12px',
  bgcolor: theme.palette.mode === 'dark' ? brandColors.darkSurface : brandColors.sand,
  border: `1px solid ${theme.palette.mode === 'dark' ? brandColors.darkBorder : brandColors.sandDark}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%'
})

export const qrPinLabelStyles: SxProps<Theme> = (theme) => ({
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.85rem',
  fontWeight: 700,
  color: theme.palette.mode === 'dark' ? brandColors.darkTextSecondary : brandColors.textGray,
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
})

export const qrPinCodeStyles: SxProps<Theme> = (theme) => ({
  fontFamily: 'monospace',
  fontSize: '1.25rem',
  fontWeight: 900,
  letterSpacing: '0.2em',
  color: theme.palette.mode === 'dark' ? brandColors.darkTextPrimary : brandColors.ink
})

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

export const activationCardStyles: SxProps<Theme> = (theme) => ({
  width: '100%',
  maxWidth: 440,
  p: { xs: 3.5, sm: 4.5 },
  borderRadius: '28px',
  bgcolor: theme.palette.mode === 'dark' ? brandColors.darkPaper : '#FFFFFF',
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: 2.5,
  boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.5)' : '0 8px 32px rgba(0, 0, 0, 0.08)'
})

// Novos estilos para os layouts: Painel Lateral (side-hub) e Feed Social (social-feed)
export const sideHubRightStyles: SxProps<Theme> = {
  width: { xs: '100%', md: 360, lg: 420 },
  display: 'flex',
  flexDirection: 'column',
  gap: { xs: 1.5, md: 2.5 },
  height: '100%',
  minHeight: 0,
  flexShrink: 0
}

export const sideHubQrCardStyles: SxProps<Theme> = (theme) => ({
  bgcolor: theme.palette.mode === 'dark' ? brandColors.darkPaper : '#FFFFFF',
  borderRadius: '26px',
  border: `1px solid ${theme.palette.divider}`,
  p: { xs: 2, md: 2.5 },
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 2,
  flexShrink: 0,
  boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 6px 24px rgba(0, 0, 0, 0.06)'
})

export const sideHubQrTitleStyles: SxProps<Theme> = (theme) => ({
  fontFamily: "'Bricolage Grotesque', sans-serif",
  fontWeight: 900,
  fontSize: { xs: '1.2rem', md: '1.45rem' },
  lineHeight: 1.05,
  letterSpacing: '-0.04em',
  color: theme.palette.mode === 'dark' ? brandColors.darkTextPrimary : brandColors.ink
})

export const sideHubQrSubtitleStyles: SxProps<Theme> = (theme) => ({
  fontFamily: "'DM Sans', sans-serif",
  color: theme.palette.mode === 'dark' ? brandColors.darkTextSecondary : brandColors.textGray,
  fontSize: '0.85rem',
  fontWeight: 600,
  mt: 0.25
})

export const sideHubPinBadgeStyles: SxProps<Theme> = (theme) => ({
  mt: 1,
  px: 1.25,
  py: 0.5,
  borderRadius: '10px',
  bgcolor: theme.palette.mode === 'dark' ? brandColors.darkSurface : brandColors.sand,
  border: `1px solid ${theme.palette.mode === 'dark' ? brandColors.darkBorder : brandColors.sandDark}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%'
})

export const sideHubPinLabelStyles: SxProps<Theme> = (theme) => ({
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.72rem',
  fontWeight: 700,
  color: theme.palette.mode === 'dark' ? brandColors.darkTextSecondary : brandColors.textGray,
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
})

export const sideHubPinCodeStyles: SxProps<Theme> = (theme) => ({
  fontFamily: 'monospace',
  fontSize: '1.05rem',
  fontWeight: 900,
  letterSpacing: '0.15em',
  color: theme.palette.mode === 'dark' ? brandColors.darkTextPrimary : brandColors.ink
})

export const getSideHubThumbnailSlotStyles = (isActive: boolean = false): SxProps<Theme> => (theme) => ({
  borderRadius: '16px',
  bgcolor: theme.palette.mode === 'dark' ? brandColors.darkSurface : brandColors.sand,
  overflow: 'hidden',
  border: isActive ? `3px solid ${brandColors.flashYellow}` : `1.5px solid ${theme.palette.divider}`,
  boxShadow: isActive ? '0 0 16px rgba(255, 207, 31, 0.45)' : 'none',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 90,
  height: '100%',
  '&:hover': {
    borderColor: brandColors.flashYellow
  }
})

export const sideHubRecentCardStyles: SxProps<Theme> = (theme) => ({
  flex: 1,
  bgcolor: theme.palette.mode === 'dark' ? brandColors.darkPaper : '#FFFFFF',
  borderRadius: '26px',
  border: `1px solid ${theme.palette.divider}`,
  p: { xs: 2, md: 2.5 },
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 6px 24px rgba(0, 0, 0, 0.06)'
})

export const sideHubRecentGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 1.5,
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  pr: 0.5
}

export const socialFeedLeftColumnStyles: SxProps<Theme> = (theme) => ({
  width: { xs: '100%', md: 280, lg: 320 },
  bgcolor: theme.palette.mode === 'dark' ? brandColors.darkPaper : '#FFFFFF',
  borderRadius: '26px',
  border: `1px solid ${theme.palette.divider}`,
  p: { xs: 2.5, md: 3 },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 2,
  height: '100%',
  minHeight: 0,
  flexShrink: 0,
  boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 6px 24px rgba(0, 0, 0, 0.06)'
})

export const socialFeedQrTitleStyles: SxProps<Theme> = (theme) => ({
  fontFamily: "'Bricolage Grotesque', sans-serif",
  fontWeight: 900,
  fontSize: { xs: '1.4rem', md: '1.75rem' },
  lineHeight: 1.05,
  letterSpacing: '-0.04em',
  color: theme.palette.mode === 'dark' ? brandColors.darkTextPrimary : brandColors.ink
})

export const socialFeedCenterStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
  height: '100%',
  minHeight: 0
}

export const socialFeedRightColumnStyles: SxProps<Theme> = (theme) => ({
  width: { xs: '100%', md: 280, lg: 320 },
  bgcolor: theme.palette.mode === 'dark' ? brandColors.darkPaper : '#FFFFFF',
  borderRadius: '26px',
  border: `1px solid ${theme.palette.divider}`,
  p: { xs: 2, md: 2.5 },
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
  flexShrink: 0,
  boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 6px 24px rgba(0, 0, 0, 0.06)'
})

export const socialFeedListStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  pr: 0.5
}

export const socialFeedCardStyles = (isActive = false): SxProps<Theme> => (theme) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  p: 1.25,
  borderRadius: '16px',
  cursor: 'pointer',
  bgcolor: isActive
    ? theme.palette.mode === 'dark'
      ? 'rgba(255, 207, 31, 0.1)'
      : 'rgba(255, 207, 31, 0.15)'
    : theme.palette.mode === 'dark'
      ? brandColors.darkSurface
      : brandColors.sand,
  border: isActive
    ? `2px solid ${brandColors.flashYellow}`
    : `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease',
  boxShadow: isActive ? '0 0 12px rgba(255, 207, 31, 0.3)' : 'none',
  '&:hover': {
    borderColor: brandColors.flashYellow
  }
})
