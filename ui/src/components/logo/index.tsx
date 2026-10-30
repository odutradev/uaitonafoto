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
      <Box
        sx={{
          width: dimensions.symbolSize,
          height: dimensions.symbolSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <BrandSymbol size="100%" variant={isDark ? 'dark' : 'light'} />
      </Box>
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
