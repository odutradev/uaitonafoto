import type { SVGProps } from 'react'

export type BrandSymbolVariant = 'light' | 'dark' | 'auto'

export interface BrandSymbolProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  variant?: BrandSymbolVariant
}
