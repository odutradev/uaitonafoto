import type { SVGProps } from 'react'

export interface BrandSymbolProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  variant?: 'light' | 'dark'
}

/**
 * Símbolo oficial uai to na foto:
 * Um quadro e uma pessoa dentro dele. O ponto fora do centro é o convidado entrando na foto.
 */
export const BrandSymbol = ({
  size = 40,
  variant = 'light',
  style,
  ...rest
}: BrandSymbolProps) => {
  const isDark = variant === 'dark'
  const rectFill = isDark ? '#FFCF1F' : '#17140F'
  const circleFill = isDark ? '#17140F' : '#FFCF1F'

  return (
    <svg
      role="img"
      aria-label="Símbolo uai to na foto"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle', ...style }}
      {...rest}
    >
      <rect x="4" y="4" width="92" height="92" rx="28" fill={rectFill} />
      <circle cx="59" cy="42" r="18" fill={circleFill} />
    </svg>
  )
}

export default BrandSymbol
