import { useTheme } from '@mui/material/styles'

import { baseSvgStyles, getSymbolColors } from './styles'
import type { BrandSymbolProps } from './types'

export const BrandSymbol = ({
  size = 40,
  variant = 'auto',
  style,
  ...rest
}: BrandSymbolProps) => {
  const theme = useTheme()
  const isDark = variant === 'auto' ? theme.palette.mode === 'dark' : variant === 'dark'
  const { rectFill, circleFill } = getSymbolColors(isDark)

  return (
    <svg
      role="img"
      aria-label="Símbolo uai to na foto"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      style={{ ...baseSvgStyles, ...style }}
      {...rest}
    >
      <rect x="4" y="4" width="92" height="92" rx="28" fill={rectFill} />
      <circle cx="59" cy="42" r="18" fill={circleFill} />
    </svg>
  )
}

export type { BrandSymbolProps } from './types'
export default BrandSymbol
