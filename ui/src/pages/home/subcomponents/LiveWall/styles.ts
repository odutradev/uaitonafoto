import type { SxProps, Theme } from '@mui/material'
import { brandColors } from '@theme'

export const getLiveWallOuterBoxStyles = (isDark: boolean): SxProps<Theme> => ({
  bgcolor: isDark ? brandColors.darkBg : 'background.paper',
  color: 'text.primary',
  borderRadius: '28px',
  p: { xs: 3, md: 4.5 },
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  border: 1,
  borderColor: 'divider',
  boxShadow: isDark ? '0 20px 40px rgba(0, 0, 0, 0.4)' : '0 20px 40px rgba(23, 20, 15, 0.08)'
})

export const liveWallHeaderStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}

export const getLiveWallBadgeStyles = (liveWallAccent: string): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  color: liveWallAccent,
  fontSize: '0.8rem',
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase'
})

export const getLiveWallScreenStyles = (isDark: boolean): SxProps<Theme> => ({
  bgcolor: isDark ? brandColors.darkPaper : brandColors.sand,
  borderRadius: '20px',
  p: { xs: 3, sm: 4 },
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 3,
  textAlign: { xs: 'center', sm: 'left' },
  minHeight: 220,
  border: 1,
  borderColor: 'divider'
})

export const liveWallBrandBoxStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5
}

export const getLiveWallBrandTitleStyles = (liveWallAccent: string): SxProps<Theme> => ({
  fontFamily: "'Bricolage Grotesque', sans-serif",
  fontWeight: 800,
  fontSize: '1.25rem',
  letterSpacing: '-0.04em',
  color: liveWallAccent
})

export const getLiveWallTitleStyles = (liveWallAccent: string): SxProps<Theme> => ({
  color: liveWallAccent,
  fontSize: { xs: '1.75rem', sm: '2.1rem' },
  mb: 1
})

export const liveWallDescriptionStyles: SxProps<Theme> = {
  color: 'text.secondary',
  maxWidth: '420px',
  lineHeight: 1.5
}

export const liveWallQrStackStyles: SxProps<Theme> = {
  flexShrink: 0
}

export const liveWallQrCodeStyles: SxProps<Theme> = {
  fontSize: { xs: 80, sm: 96 },
  color: 'primary.main'
}

export const liveWallQrInstructionStyles: SxProps<Theme> = {
  color: 'text.secondary',
  fontWeight: 700,
  textAlign: 'center',
  maxWidth: 130
}

export const getMosaicTileStyles = (bgcolor: string): SxProps<Theme> => ({
  flex: 1,
  height: 48,
  bgcolor,
  borderRadius: '12px'
})



