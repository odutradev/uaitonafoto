import Logo from '../logo'
import type { BrandSymbolProps } from './types'

const BrandSymbol = ({
  size = 40,
  variant = 'auto',
  ...rest
}: BrandSymbolProps) => {
  return (
    <Logo
      display="symbol"
      size={size}
      variant={variant}
      {...rest}
    />
  )
}

export default BrandSymbol
