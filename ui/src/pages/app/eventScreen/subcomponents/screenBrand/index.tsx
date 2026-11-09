import { Avatar, Box, IconButton, Tooltip, Typography } from '@mui/material'
import {
  Fullscreen as FullscreenIcon,
  SettingsOutlined as SettingsIcon
} from '@mui/icons-material'
import { brandColors } from '@theme'
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
          sx={(theme) => ({
            width: '3.4cqh',
            height: '3.4cqh',
            borderRadius: '1cqh',
            bgcolor: brandColors.flashYellow,
            display: 'block',
            position: 'relative',
            flexShrink: 0,
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: '25%',
              borderRadius: '50%',
              bgcolor: theme.palette.mode === 'dark' ? brandColors.darkBg : '#FFFFFF'
            }
          })}
        />

        <Typography
          component="span"
          sx={{
            fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
            fontWeight: 800,
            fontSize: '3cqh',
            lineHeight: 1,
            color: brandColors.flashYellow,
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
                color: '#22c55e',
                bgcolor: 'rgba(34, 197, 94, 0.14)',
                border: '1px solid rgba(34, 197, 94, 0.35)',
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

      {/* Lado direito: Assessoria Whitelabel (Logo + Nome + Subtítulo) + Controles integrados */}
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
              sx={(theme) => {
                const accentColor = customization.primaryColor?.trim()
                const defaultBorder =
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 210, 31, 0.25)'
                    : 'rgba(0, 0, 0, 0.1)'

                return {
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.9cqh',
                  px: '1.2cqh',
                  py: '0.4cqh',
                  borderRadius: '9999px',
                  bgcolor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.04)',
                  border: `1.5px solid ${accentColor || defaultBorder}`,
                  backdropFilter: 'blur(8px)',
                  boxShadow: accentColor
                    ? `0 0 16px ${accentColor}33`
                    : theme.palette.mode === 'dark'
                      ? 'none'
                      : '0 2px 8px rgba(0,0,0,0.04)',
                  maxWidth: '34cqh'
                }
              }}
            >
              {/* Logo do Whitelabel */}
              <Avatar
                src={customization.agencyLogoUrl}
                sx={{
                  width: '3.2cqh',
                  height: '3.2cqh',
                  bgcolor: customization.primaryColor?.trim() || 'primary.main',
                  color: 'primary.contrastText',
                  border: customization.primaryColor?.trim()
                    ? `1.5px solid ${customization.primaryColor.trim()}`
                    : 'none',
                  fontWeight: 900,
                  fontSize: '1.4cqh',
                  flexShrink: 0
                }}
              >
                {(customization.agencyName || 'A')[0].toUpperCase()}
              </Avatar>

              {/* Nome e Subtítulo do Whitelabel */}
              <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, textAlign: 'left' }}>
                <Typography
                  sx={(theme) => ({
                    fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                    fontSize: '1.7cqh',
                    fontWeight: 800,
                    lineHeight: 1.15,
                    color:
                      theme.palette.mode === 'dark'
                        ? brandColors.darkTextPrimary
                        : brandColors.ink,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  })}
                >
                  {customization.agencyName}
                </Typography>
                <Typography
                  sx={(theme) => ({
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: '1.2cqh',
                    lineHeight: 1.1,
                    color:
                      theme.palette.mode === 'dark'
                        ? brandColors.darkTextSecondary
                        : brandColors.textGray,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  })}
                >
                  {customization.agencyTagline || 'Assessoria & Cerimonial'}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Botões de Ação (Tela cheia e Configurações) */}
          {(onFullscreen || onOpenSettings) && (
            <Box
              sx={(theme) => ({
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4cqh',
                p: '0.3cqh',
                borderRadius: '9999px',
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(20, 17, 12, 0.85)'
                    : 'rgba(255, 255, 255, 0.9)',
                border: `1px solid ${
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.14)'
                    : 'rgba(0, 0, 0, 0.12)'
                }`,
                backdropFilter: 'blur(8px)',
                boxShadow:
                  theme.palette.mode === 'dark'
                    ? 'none'
                    : '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'opacity 0.2s ease',
                opacity: 0.6,
                '&:hover, &:focus-within': {
                  opacity: 1
                }
              })}
            >
              {onFullscreen && (
                <Tooltip title="Alternar tela cheia">
                  <IconButton
                    aria-label="Tela cheia"
                    onClick={onFullscreen}
                    size="small"
                    sx={(theme) => ({
                      color:
                        theme.palette.mode === 'dark'
                          ? brandColors.darkTextPrimary
                          : brandColors.ink,
                      p: '0.4cqh',
                      '&:hover': {
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.12)'
                            : 'rgba(0, 0, 0, 0.08)'
                      }
                    })}
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
                    sx={(theme) => ({
                      color:
                        theme.palette.mode === 'dark'
                          ? brandColors.darkTextPrimary
                          : brandColors.ink,
                      p: '0.4cqh',
                      '&:hover': {
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.12)'
                            : 'rgba(0, 0, 0, 0.08)'
                      }
                    })}
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
