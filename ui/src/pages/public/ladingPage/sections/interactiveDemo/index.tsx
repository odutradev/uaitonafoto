import { Box, Container } from '@mui/material'
import { brandColors } from '@theme'

import { GuestFeed } from '../../subcomponents/guestFeed'
import { LiveWall } from '../../subcomponents/liveWall'
import { demoContainerStyles, demoGridStyles } from './styles'
import type { InteractiveDemoProps } from './types'

export const InteractiveDemo = ({
  liveWallData,
  guestFeedData,
  isDark
}: InteractiveDemoProps) => {
  const liveWallAccent = isDark ? brandColors.flashYellow : brandColors.ink
  const mosaicTiles = isDark
    ? [brandColors.darkSurface, brandColors.darkBorder, brandColors.darkPaper]
    : [brandColors.sand, brandColors.sandDark, brandColors.lightBorder]

  return (
    <Container maxWidth="lg" sx={demoContainerStyles}>
      <Box sx={demoGridStyles}>
        <LiveWall
          data={liveWallData}
          isDark={isDark}
          liveWallAccent={liveWallAccent}
          mosaicTiles={mosaicTiles}
        />
        <GuestFeed data={guestFeedData} isDark={isDark} />
      </Box>
    </Container>
  )
}

export default InteractiveDemo
