import { Box, Button, Chip, Dialog, Divider, IconButton, Stack, Switch, Tooltip, Typography } from '@mui/material'
import { CheckCircle as CheckIcon, Close as CloseIcon, CropFree as FitIcon, DashboardCustomizeOutlined as LayoutIcon, DarkMode as DarkModeIcon, LightMode as LightModeIcon, PowerSettingsNew as DisconnectIcon, Tune as SettingsIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material'

import useSystemStore from '@stores/system'
import { brandColors } from '@styles/theme'

import { SCREEN_LAYOUT_OPTIONS, SCREEN_PHOTO_FIT_OPTIONS } from '@pages/app/eventScreen/types'
import { getLayoutCardStyles, modalBodyStyles, modalDialogPaperStyles, settingRowStyles, settingsSectionStyles, settingsSectionTitleStyles } from './styles'
import useEventScreenPage from '@pages/app/eventScreen/hook'


export const ScreenSettingsModal = () => {
  const { isSettingsModalOpen: open, handleCloseSettings: onClose, layoutMode: layout, handleLayoutChange: onChangeLayout, photoFit, handlePhotoFitChange: onChangePhotoFit, showPin, handleTogglePinVisibility: onTogglePin, hasPin, isActivated, handleOpenDisconnect: onRequestDisconnect } = useEventScreenPage()

  const { themeMode } = useSystemStore((state) => state.system)
  const toggleTheme = useSystemStore((state) => state.toggleTheme)
  const isDark = themeMode === 'dark'

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.75)'
          }
        },
        paper: {
          sx: modalDialogPaperStyles,
          elevation: 0
        }
      }}
    >
      {/* Botão Fechar no Topo */}
      <IconButton
        aria-label="Fechar configurações"
        onClick={onClose}
        size="small"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: 'text.secondary',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
          '&:hover': {
            color: 'text.primary',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'
          }
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      {/* Cabeçalho do Modal */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, pr: 6, mb: 1.5 }}>
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: '14px',
            bgcolor: 'rgba(255, 207, 31, 0.15)',
            color: brandColors.flashYellow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <SettingsIcon sx={{ fontSize: 26 }} />
        </Box>
        <Box>
          <Typography
            variant="h5"
            component="h2"
            fontWeight={900}
            sx={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}
          >
            Configurações do Telão
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Personalize a disposição, enquadramento das fotos e preferências da tela.
          </Typography>
        </Box>
      </Box>

      {/* Corpo rolável com scroll suave */}
      <Box sx={modalBodyStyles}>
        <Stack spacing={3}>
          {/* Seção 1: Formato do Layout (Grid 2 colunas) */}
          <Box sx={settingsSectionStyles}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LayoutIcon sx={{ fontSize: 18, color: brandColors.flashYellow }} />
              <Typography sx={settingsSectionTitleStyles}>Disposição do Telão (Layout)</Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 1.5
              }}
            >
              {SCREEN_LAYOUT_OPTIONS.map((option) => {
                const isSelected = layout === option.id
                return (
                  <Box
                    key={option.id}
                    onClick={() => onChangeLayout(option.id)}
                    sx={getLayoutCardStyles(isSelected)}
                  >
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                        <Typography variant="subtitle2" fontWeight={800} sx={{ lineHeight: 1.2 }}>
                          {option.label}
                        </Typography>
                        {option.tag && (
                          <Chip
                            size="small"
                            label={option.tag}
                            sx={{
                              height: 20,
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              bgcolor: isSelected ? brandColors.flashYellow : 'action.selected',
                              color: isSelected ? brandColors.ink : 'text.secondary'
                            }}
                          />
                        )}
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', lineHeight: 1.35 }}
                      >
                        {option.subtitle}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', pt: 0.25 }}>
                      {isSelected ? (
                        <CheckIcon sx={{ color: brandColors.flashYellow, fontSize: 24 }} />
                      ) : (
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            border: '2px solid',
                            borderColor: 'divider'
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Box>

          <Divider />

          {/* Seção 2: Enquadramento da Foto (Grid 2 colunas) */}
          <Box sx={settingsSectionStyles}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FitIcon sx={{ fontSize: 18, color: brandColors.flashYellow }} />
              <Typography sx={settingsSectionTitleStyles}>Enquadramento da Foto</Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 1.5
              }}
            >
              {SCREEN_PHOTO_FIT_OPTIONS.map((option) => {
                const isSelected = photoFit === option.id
                return (
                  <Box
                    key={option.id}
                    onClick={() => onChangePhotoFit(option.id)}
                    sx={getLayoutCardStyles(isSelected)}
                  >
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 0.5 }}>
                        {option.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', lineHeight: 1.35 }}
                      >
                        {option.subtitle}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', pt: 0.25 }}>
                      {isSelected ? (
                        <CheckIcon sx={{ color: brandColors.flashYellow, fontSize: 24 }} />
                      ) : (
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            border: '2px solid',
                            borderColor: 'divider'
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Box>

          <Divider />

          {/* Seção 3: Preferências Gerais (Grid 2 colunas com botão de ícone para troca de tema) */}
          <Box sx={settingsSectionStyles}>
            <Typography sx={settingsSectionTitleStyles}>Preferências de Exibição</Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: hasPin ? { xs: '1fr', sm: 'repeat(2, 1fr)' } : '1fr',
                gap: 1.5
              }}
            >
              {/* Botão de Troca de Tema via Ícone */}
              <Box sx={settingRowStyles}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '12px',
                      bgcolor: isDark ? 'rgba(255, 207, 31, 0.15)' : 'rgba(245, 158, 11, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isDark ? brandColors.flashYellow : '#F59E0B',
                      flexShrink: 0
                    }}
                  >
                    {isDark ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={800}>
                      Tema da Interface
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {isDark ? 'Modo Escuro ativo' : 'Modo Claro ativo'}
                    </Typography>
                  </Box>
                </Box>

                {/* Ícone Clicável para Alternar Tema */}
                <Tooltip title={isDark ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}>
                  <IconButton
                    onClick={toggleTheme}
                    aria-label={isDark ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
                    sx={(theme) => ({
                      width: 44,
                      height: 44,
                      borderRadius: '14px',
                      bgcolor:
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.05)',
                      border: `1px solid ${
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.14)'
                          : 'rgba(0, 0, 0, 0.1)'
                      }`,
                      color: isDark ? brandColors.flashYellow : '#F59E0B',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      '&:hover': {
                        bgcolor: isDark
                          ? 'rgba(255, 207, 31, 0.2)'
                          : 'rgba(245, 158, 11, 0.18)',
                        transform: 'rotate(18deg) scale(1.08)'
                      }
                    })}
                  >
                    {isDark ? <LightModeIcon /> : <DarkModeIcon />}
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Visibilidade do PIN */}
              {hasPin && (
                <Box sx={settingRowStyles}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '12px',
                        bgcolor: showPin ? 'rgba(34, 197, 94, 0.12)' : 'rgba(150, 150, 150, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: showPin ? '#22c55e' : 'text.secondary',
                        flexShrink: 0
                      }}
                    >
                      {showPin ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={800}>
                        Mostrar PIN no Telão
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {showPin ? 'O PIN está visível' : 'O PIN está oculto'}
                      </Typography>
                    </Box>
                  </Box>

                  <Switch
                    checked={showPin}
                    onChange={onTogglePin}
                    inputProps={{ 'aria-label': 'Alternar visibilidade do PIN' }}
                  />
                </Box>
              )}
            </Box>
          </Box>

          {/* Seção 4: Desconectar (se ativado) */}
          {isActivated && (
            <>
              <Divider />
              <Box sx={settingsSectionStyles}>
                <Typography sx={settingsSectionTitleStyles}>Gerenciamento da Sessão</Typography>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  startIcon={<DisconnectIcon />}
                  onClick={onRequestDisconnect}
                  sx={{
                    borderRadius: '14px',
                    py: 1.2,
                    fontWeight: 800,
                    textTransform: 'none',
                    fontSize: '0.92rem'
                  }}
                >
                  Desconectar este dispositivo do evento
                </Button>
              </Box>
            </>
          )}
        </Stack>
      </Box>
    </Dialog>
  )
}

export default ScreenSettingsModal
