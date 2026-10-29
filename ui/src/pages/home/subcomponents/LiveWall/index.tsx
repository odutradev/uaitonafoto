import { Box, Stack, Typography } from '@mui/material'
import { QrCode2 as QrCodeIcon } from '@mui/icons-material'

import { BrandSymbol } from '@components/index'

import {
  getLiveWallBadgeStyles,
  getLiveWallBrandTitleStyles,
  getLiveWallOuterBoxStyles,
  getLiveWallScreenStyles,
  getLiveWallTitleStyles,
  getMosaicTileStyles,
  liveWallBrandBoxStyles,
  liveWallDescriptionStyles,
  liveWallHeaderStyles,
  liveWallQrCodeStyles,
  liveWallQrInstructionStyles,
  liveWallQrStackStyles
} from './styles'
import type { LiveWallProps } from './types'

export const LiveWall = ({ data, isDark, liveWallAccent, mosaicTiles }: LiveWallProps) => {
  return (
    <Box sx={getLiveWallOuterBoxStyles(isDark)}>
      <Box sx={liveWallHeaderStyles}>
        <Box sx={liveWallBrandBoxStyles}>
          <BrandSymbol size={32} variant="auto" />
          <Typography sx={getLiveWallBrandTitleStyles(liveWallAccent)}>
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
          <Typography variant="h3" sx={getLiveWallTitleStyles(liveWallAccent)}>
            {data.title}
          </Typography>
          <Typography variant="body1" sx={liveWallDescriptionStyles}>
            {data.description}
          </Typography>
        </Box>

        <Stack spacing={1} alignItems="center" sx={liveWallQrStackStyles}>
          <QrCodeIcon sx={liveWallQrCodeStyles} />
          <Typography
            variant="caption"
            sx={liveWallQrInstructionStyles}
          >
            {data.qrInstruction}
          </Typography>
        </Stack>
      </Box>

      <Stack direction="row" spacing={1.5}>
        <Box sx={getMosaicTileStyles(mosaicTiles[0])} />
        <Box sx={getMosaicTileStyles(mosaicTiles[1])} />
        <Box sx={getMosaicTileStyles(mosaicTiles[2])} />
        <Box sx={getMosaicTileStyles(mosaicTiles[0])} />
      </Stack>
    </Box>
  )
}

export default LiveWall

