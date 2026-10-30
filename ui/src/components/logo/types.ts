import type { BoxProps } from '@mui/material'

export type LogoSize = 'small' | 'medium' | 'large' | number | string
export type LogoVariant = 'light' | 'dark' | 'auto'
export type LogoDisplay = 'both' | 'symbol' | 'text' | 'wordmark'

export type BrandAnimation =
  | 'enter'
  | 'flash'
  | 'shutter'
  | 'reveal'
  | 'eye'
  | 'develop'
  | 'live'
  | 'breathe'
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8

export type LoadingAnimation =
  | 'orbit'
  | 'blink'
  | 'dots'
  | 'draw'
  | 'morph'
  | 'l1'
  | 'l2'
  | 'l3'
  | 'l4'
  | 'l9'
  | 'L1'
  | 'L2'
  | 'L3'
  | 'L4'
  | 'L9'

export type LogoAnimation = BrandAnimation | LoadingAnimation

export interface LogoDimensions {
  symbolSize: number | string | Record<string, number | string>
  fontSize: number | string | Record<string, number | string>
  gap: number | string | Record<string, number | string>
}

export interface LogoProps extends Omit<BoxProps, 'display'> {
  size?: LogoSize
  variant?: LogoVariant
  display?: LogoDisplay
  /**
   * Convenience prop for backwards compatibility. Equivalent to display="symbol".
   */
  symbolOnly?: boolean
  /**
   * Convenience prop. Equivalent to display="text".
   */
  textOnly?: boolean
  /**
   * Convenience prop. Equivalent to display="text".
   */
  wordmarkOnly?: boolean
  /**
   * Brand animation (1-8 or by name) or loading animation (l1-l4, l9 or by name).
   */
  animation?: LogoAnimation
  /**
   * Shortcut for loading animation. Can be boolean (defaults to 'orbit'/'l1') or specific loader.
   */
  loading?: boolean | LoadingAnimation
  /**
   * Whether to run non-looping animations (e.g. enter, shutter, reveal, develop). Default: true.
   */
  play?: boolean
  /**
   * Whether the eye animation tracks pointer movement. Default: true.
   */
  interactive?: boolean
}
