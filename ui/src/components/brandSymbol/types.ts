import type { LogoAnimation, LogoProps, LogoVariant } from '../logo/types'

export type BrandSymbolVariant = LogoVariant

export interface BrandSymbolProps extends Omit<LogoProps, 'display'> {
  size?: number | string
  variant?: BrandSymbolVariant
  animation?: LogoAnimation
}
