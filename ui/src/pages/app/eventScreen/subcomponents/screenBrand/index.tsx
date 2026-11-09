import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import {
  Fullscreen as FullscreenIcon,
  SettingsOutlined as SettingsIcon
} from '@mui/icons-material'
import type { EventCustomization } from '@actions/events/types'

interface ScreenBrandProps {
  customization?: EventCustomization
  compact?: boolean
  hideLiveBadge?: boolean
  onFullscreen?: () => void
  onOpenSettings?: () => void
}

export const ScreenBrand = ({
  customization,
  hideLiveBadge = false,
  onFullscreen,
  onOpenSettings
}: ScreenBrandProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        gap: '1.5cqh',
        minWidth: 0,
        userSelect: 'none'
      }}
    >
      {/* Lado esquerdo: Marca uaiToNaFoto + Badge AO VIVO */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.2cqh',
          minWidth: 0,
          flexShrink: 0
        }}
      >
        {/* Marcador de câmera / ícone característico */}
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
      </Box>

      {/* Lado direito: Assessoria + Controles integrados em flexbox (SEM sobreposição) */}
      {(customization?.enabled && customization.agencyName || onFullscreen || onOpenSettings) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '1cqh',
            flexShrink: 0,
            minWidth: 0
          }}
        >
          {customization?.enabled && customization.agencyName && (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.8cqh',
                px: '1.4cqh',
                py: '0.5cqh',
                borderRadius: '9999px',
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                backdropFilter: 'blur(8px)',
                maxWidth: '28cqh'
              }}
            >
              <Typography
                sx={{
                  fontSize: '1.8cqh',
                  fontWeight: 700,
                  color: '#e5e1d8',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {customization.agencyName}
              </Typography>
            </Box>
          )}

          {(onFullscreen || onOpenSettings) && (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4cqh',
                p: '0.3cqh',
                borderRadius: '9999px',
                bgcolor: 'rgba(20, 17, 12, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                backdropFilter: 'blur(8px)',
                transition: 'opacity 0.2s ease',
                opacity: 0.5,
                '&:hover, &:focus-within': {
                  opacity: 1
                }
              }}
            >
              {onFullscreen && (
                <Tooltip title="Alternar tela cheia">
                  <IconButton
                    aria-label="Tela cheia"
                    onClick={onFullscreen}
                    size="small"
                    sx={{
                      color: '#f6f1e4',
                      p: '0.4cqh',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.12)' }
                    }}
                  >
                    <FullscreenIcon sx={{ fontSize: '2.4cqh' }} />
                  </IconButton>
                </Tooltip>
              )}
              {onOpenSettings && (
                <Tooltip title="Configurações do telão">
                  <IconButton
                    aria-label="Configurações do telão"
                    onClick={onOpenSettings}
                    size="small"
                    sx={{
                      color: '#f6f1e4',
                      p: '0.4cqh',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.12)' }
                    }}
                  >
                    <SettingsIcon sx={{ fontSize: '2.4cqh' }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default ScreenBrand
