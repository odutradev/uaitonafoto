import type { LiveWallData } from '@pages/public/landingPage/data'

export interface LiveWallProps {
  data: LiveWallData
  isDark: boolean
  liveWallAccent: string
  mosaicTiles: readonly string[]
}

