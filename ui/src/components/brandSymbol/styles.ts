import type { CSSProperties } from 'react'
import { brandColors } from '@theme'

export const baseSvgStyles: CSSProperties = {
  flexShrink: 0,
  display: 'inline-block',
  verticalAlign: 'middle'
}

export const getSymbolColors = (isDark: boolean) => ({
  rectFill: isDark ? brandColors.flashYellow : brandColors.ink,
  circleFill: isDark ? brandColors.ink : brandColors.flashYellow
})
