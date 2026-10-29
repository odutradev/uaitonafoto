import type { CSSProperties } from 'react'
import { brandColors } from '@theme/theme'

export const baseSvgStyles: CSSProperties = {
  flexShrink: 0,
  display: 'inline-block',
  verticalAlign: 'middle'
}

export const getSymbolColors = (isDark: boolean) => ({
  rectFill: isDark ? brandColors.amareloFlash : brandColors.tinta,
  circleFill: isDark ? brandColors.tinta : brandColors.amareloFlash
})
