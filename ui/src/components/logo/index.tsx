import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import BrandSymbol from '../brandSymbol'
import { getLogoContainerStyles, getLogoDimensions, getLogoTextStyles } from './styles'
import type { LogoProps } from './types'

const Logo = ({
  size = 'medium',
  variant = 'auto',
  symbolOnly = false,
  sx,
  ...rest
}: LogoProps) => {
  const theme = useTheme()
  const isDark = variant === 'auto' ? theme.palette.mode === 'dark' : variant === 'dark'
  const dimensions = getLogoDimensions(size)

  return (
    <Box
      sx={[
        getLogoContainerStyles(isDark, dimensions.gap),
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
      {...rest}
    >
      <BrandSymbol size={dimensions.symbolSize} variant={isDark ? 'dark' : 'light'} />
      {!symbolOnly && (
        <Typography
          component="span"
          sx={getLogoTextStyles(dimensions.fontSize)}
        >
          uaiToNaFoto
        </Typography>
      )}
    </Box>
  )
}

export default Logo
