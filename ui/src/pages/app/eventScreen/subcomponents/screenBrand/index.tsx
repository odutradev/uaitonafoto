import { Avatar, Box, IconButton, Tooltip, Typography } from '@mui/material'
import { Fullscreen as FullscreenIcon, SettingsOutlined as SettingsIcon } from '@mui/icons-material'
import Logo from '@components/logo'
import { brandColors } from '@styles/theme'
import type { EventCustomization } from '@utils/types/events'

interface ScreenBrandProps {
  customization?: EventCustomization
  compact?: boolean
  hideLiveBadge?: boolean
  pin?: string | null
  showPin?: boolean
  onFullscreen?: () => void
  onOpenSettings?: () => void
}

export const ScreenBrand = ({
  customization,
  hideLiveBadge = false,
  pin,
  showPin = true,
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
        <Logo
          variant="auto"
          animation="live"
          size={{ symbolSize: '3.4cqh', fontSize: '3cqh', gap: '1cqh' }}
        />

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
              textTransform: 'lowercase',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1
            }}
          >
            ao vivo
          </Box>
        )}

        {pin && showPin && (
          <Box
            component="span"
            sx={(theme) => ({
              fontStyle: 'normal',
              fontSize: '1.9cqh',
              fontWeight: 800,
              bgcolor:
                theme.palette.mode === 'dark'
                  ? brandColors.darkBg
                  : brandColors.sand,
              color:
                theme.palette.mode === 'dark'
                  ? brandColors.flashYellow
                  : brandColors.ink,
              border: `1px solid ${
                theme.palette.mode === 'dark'
                  ? brandColors.darkBorder
                  : brandColors.sandDark
              }`,
              px: '1.4cqh',
              py: '0.3cqh',
              borderRadius: '2cqh',
              letterSpacing: '0.12em',
              fontFamily: 'monospace',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1
            })}
          >
            PIN {pin}
          </Box>
        )}
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
                  maxWidth: '34cqh',
                  flexShrink: 1,
                  minWidth: 0
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
                flexShrink: 0,
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
