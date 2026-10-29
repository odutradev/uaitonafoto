import { Box, Stack, Typography } from '@mui/material'
import { QrCode2 as QrCodeIcon } from '@mui/icons-material'

import { BrandSymbol } from '@components/index'

import {
  getLiveWallBadgeStyles,
  getLiveWallOuterBoxStyles,
  getLiveWallScreenStyles,
  liveWallHeaderStyles
} from './styles'
import type { LiveWallProps } from './types'

export const LiveWall = ({ data, isDark, liveWallAccent, mosaicTiles }: LiveWallProps) => {
  return (
    <Box sx={getLiveWallOuterBoxStyles(isDark)}>
      <Box sx={liveWallHeaderStyles}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <BrandSymbol size={32} variant="auto" />
          <Typography
            sx={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '-0.04em',
              color: liveWallAccent
            }}
          >
            {data.brandName}
          </Typography>
        </Box>
        <Box sx={getLiveWallBadgeStyles(liveWallAccent)}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: liveWallAccent }} />
          {data.badge}
        </Box>
      </Box>

      <Box sx={getLiveWallScreenStyles(isDark)}>
        <Box>
          <Typography
            variant="h3"
            sx={{
              color: liveWallAccent,
              fontSize: { xs: '1.75rem', sm: '2.1rem' },
              mb: 1
            }}
          >
            {data.title}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: '420px', lineHeight: 1.5 }}>
            {data.description}
          </Typography>
        </Box>

        <Stack spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
          <QrCodeIcon sx={{ fontSize: { xs: 80, sm: 96 }, color: 'primary.main' }} />
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontWeight: 700, textAlign: 'center', maxWidth: 130 }}
          >
            {data.qrInstruction}
          </Typography>
        </Stack>
      </Box>

      <Stack direction="row" spacing={1.5}>
        <Box sx={{ flex: 1, height: 48, bgcolor: mosaicTiles[0], borderRadius: '12px' }} />
        <Box sx={{ flex: 1, height: 48, bgcolor: mosaicTiles[1], borderRadius: '12px' }} />
        <Box sx={{ flex: 1, height: 48, bgcolor: mosaicTiles[2], borderRadius: '12px' }} />
        <Box sx={{ flex: 1, height: 48, bgcolor: mosaicTiles[0], borderRadius: '12px' }} />
      </Stack>
    </Box>
  )
}

export default LiveWall

