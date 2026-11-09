import { Box, Typography } from '@mui/material'
import type { EventCustomization } from '@actions/events/types'

interface ScreenBrandProps {
  customization?: EventCustomization
  compact?: boolean
  hideLiveBadge?: boolean
}

export const ScreenBrand = ({
  customization,
  hideLiveBadge = false
}: ScreenBrandProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.2cqh',
        minWidth: 0,
        userSelect: 'none'
      }}
    >
      {/* Marcador de câmera / ícone circular característico */}
      <Box
        sx={{
          width: '3.4cqh',
          height: '3.4cqh',
          borderRadius: '1cqh',
          bgcolor: '#ffd21f',
          display: 'block',
          position: 'relative',
          flexShrink: 0,
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: '25%',
            borderRadius: '50%',
            bgcolor: '#14110c'
          }
        }}
      />

      <Typography
        component="span"
        sx={{
          fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
          fontWeight: 800,
          fontSize: '3cqh',
          lineHeight: 1,
          color: '#ffd21f',
          letterSpacing: '-0.02em',
          display: 'flex',
          alignItems: 'center',
          gap: '1cqh',
          whiteSpace: 'nowrap'
        }}
      >
        uaiToNaFoto
        {!hideLiveBadge && (
          <Box
            component="span"
            sx={{
              fontStyle: 'normal',
              fontSize: '1.9cqh',
              fontWeight: 700,
              color: '#4ade80',
              bgcolor: 'rgba(74, 222, 128, 0.14)',
              border: '1px solid rgba(74, 222, 128, 0.3)',
              px: '1.2cqh',
              py: '0.3cqh',
              borderRadius: '2cqh',
              letterSpacing: '0.02em',
              textTransform: 'lowercase'
            }}
          >
            ao vivo
          </Box>
        )}
      </Typography>

      {/* Identificação de assessoria se habilitada */}
      {customization?.enabled && customization.agencyName && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8cqh',
            ml: 'auto',
            px: '1.2cqh',
            py: '0.4cqh',
            borderRadius: '9999px',
            bgcolor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}
        >
          <Typography
            sx={{
              fontSize: '1.8cqh',
              fontWeight: 700,
              color: '#e5e1d8',
              whiteSpace: 'nowrap'
            }}
          >
            {customization.agencyName}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default ScreenBrand

