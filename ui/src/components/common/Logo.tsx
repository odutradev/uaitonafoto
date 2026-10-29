import { Box, Typography } from '@mui/material'
import type { BoxProps } from '@mui/material'

import { BrandSymbol } from './BrandSymbol'

export interface LogoProps extends BoxProps {
  size?: 'small' | 'medium' | 'large' | number
  variant?: 'light' | 'dark'
  symbolOnly?: boolean
}

/**
 * Logo oficial uai to na foto:
 * Símbolo + texto tipográfico em Bricolage Grotesque ExtraBold (sempre minúsculo).
 */
export const Logo = ({
  size = 'medium',
  variant = 'light',
  symbolOnly = false,
  sx,
  ...rest
}: LogoProps) => {
  const isDark = variant === 'dark'

  const dimensions =
    typeof size === 'number'
      ? { symbolSize: size, fontSize: size * 0.85, gap: size * 0.25 }
      : size === 'small'
        ? { symbolSize: 28, fontSize: '1.25rem', gap: 1 }
        : size === 'large'
          ? { symbolSize: 52, fontSize: '2.5rem', gap: 2 }
          : { symbolSize: 36, fontSize: '1.75rem', gap: 1.25 }

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: dimensions.gap,
        userSelect: 'none',
        textDecoration: 'none',
        color: isDark ? '#FFCF1F' : '#17140F',
        ...sx
      }}
      {...rest}
    >
      <BrandSymbol size={dimensions.symbolSize} variant={isDark ? 'dark' : 'light'} />
      {!symbolOnly && (
        <Typography
          component="span"
          sx={{
            fontFamily: "'Bricolage Grotesque', 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 800,
            fontSize: dimensions.fontSize,
            letterSpacing: '-0.045em',
            lineHeight: 1,
            color: 'inherit',
            whiteSpace: 'nowrap',
            paddingBottom: '2px'
          }}
        >
          uai to na foto
        </Typography>
      )}
    </Box>
  )
}

export default Logo
