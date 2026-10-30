import type { SxProps, Theme } from '@mui/material'
import { brandColors } from '@theme'

export const getLiveWallOuterBoxStyles = (isDark: boolean): SxProps<Theme> => ({
  bgcolor: isDark ? brandColors.darkBg : 'background.paper',
  color: 'text.primary',
  borderRadius: { xs: '20px', sm: '28px' },
  p: { xs: 2.25, sm: 3.5, md: 4.5 },
  display: 'flex',
  flexDirection: 'column',
  gap: { xs: 2, sm: 3 },
  border: 1,
  borderColor: 'divider',
  boxShadow: isDark ? '0 20px 40px rgba(0, 0, 0, 0.4)' : '0 20px 40px rgba(23, 20, 15, 0.08)',
  width: '100%',
  boxSizing: 'border-box'
})

export const liveWallHeaderStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 1
}

export const getLiveWallBadgeStyles = (liveWallAccent: string): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  color: liveWallAccent,
  fontSize: { xs: '0.75rem', sm: '0.8rem' },
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase'
})

export const getLiveWallScreenStyles = (isDark: boolean): SxProps<Theme> => ({
  bgcolor: isDark ? brandColors.darkPaper : brandColors.sand,
  borderRadius: { xs: '16px', sm: '20px' },
  p: { xs: 2, sm: 3, md: 4 },
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: { xs: 2, sm: 3 },
  textAlign: { xs: 'center', sm: 'left' },
  minHeight: { xs: 'auto', sm: 200 },
  border: 1,
  borderColor: 'divider',
  width: '100%',
  boxSizing: 'border-box'
})

export const liveWallBrandBoxStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.25
}

export const getLiveWallBrandTitleStyles = (liveWallAccent: string): SxProps<Theme> => ({
  fontFamily: "'Bricolage Grotesque', sans-serif",
  fontWeight: 800,
  fontSize: { xs: '1.1rem', sm: '1.25rem' },
  letterSpacing: '-0.04em',
  color: liveWallAccent
})

export const getLiveWallTitleStyles = (liveWallAccent: string): SxProps<Theme> => ({
  color: liveWallAccent,
  fontSize: { xs: '1.4rem', sm: '1.85rem', md: '2.1rem' },
  letterSpacing: '-0.035em',
  mb: 0.75
})

export const liveWallDescriptionStyles: SxProps<Theme> = {
  color: 'text.secondary',
  maxWidth: '420px',
  lineHeight: 1.5,
  fontSize: { xs: '0.875rem', sm: '1rem' }
}

export const liveWallQrStackStyles: SxProps<Theme> = {
  flexShrink: 0
}

export const liveWallQrCodeStyles: SxProps<Theme> = {
  fontSize: { xs: 64, sm: 80, md: 96 },
  color: 'primary.main'
}

export const liveWallQrInstructionStyles: SxProps<Theme> = {
  color: 'text.secondary',
  fontWeight: 700,
  textAlign: 'center',
  maxWidth: 130,
  fontSize: { xs: '0.75rem', sm: '0.8125rem' }
}

export const getMosaicTileStyles = (bgcolor: string): SxProps<Theme> => ({
  flex: 1,
  height: { xs: 32, sm: 44, md: 48 },
  bgcolor,
  borderRadius: { xs: '8px', sm: '12px' }
})
