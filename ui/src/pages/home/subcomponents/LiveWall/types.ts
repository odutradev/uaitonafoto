import type { LiveWallData } from '../../data'

export interface LiveWallProps {
  data: LiveWallData
  isDark: boolean
  liveWallAccent: string
  mosaicTiles: readonly string[]
}
