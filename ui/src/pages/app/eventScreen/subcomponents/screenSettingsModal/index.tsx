import {
  Box,
  Button,
  Chip,
  Dialog,
  Divider,
  IconButton,
  Stack,
  Switch,
  Typography
} from '@mui/material'
import {
  CheckCircle as CheckIcon,
  Close as CloseIcon,
  CropFree as FitIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  PowerSettingsNew as DisconnectIcon,
  Tune as SettingsIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material'

import useSystemStore from '@stores/system'
import { brandColors } from '@theme'

import { SCREEN_LAYOUT_OPTIONS, SCREEN_PHOTO_FIT_OPTIONS } from '../../types'
import {
  getLayoutCardStyles,
  modalBodyStyles,
  modalDialogPaperStyles,
  settingRowStyles,
  settingsSectionStyles,
  settingsSectionTitleStyles
} from './styles'
import type { ScreenLayoutMode, ScreenPhotoFit } from '../../types'

interface ScreenSettingsModalProps {
  open: boolean
  onClose: () => void
  layout: ScreenLayoutMode
  onChangeLayout: (mode: ScreenLayoutMode) => void
  photoFit: ScreenPhotoFit
  onChangePhotoFit: (fit: ScreenPhotoFit) => void
  showPin: boolean
  onTogglePin: () => void
  hasPin: boolean
  isActivated: boolean
  onRequestDisconnect: () => void
}

const ScreenSettingsModal = ({
  open,
  onClose,
  layout,
  onChangeLayout,
  photoFit,
  onChangePhotoFit,
  showPin,
  onTogglePin,
  hasPin,
  isActivated,
  onRequestDisconnect
}: ScreenSettingsModalProps) => {
  const { themeMode } = useSystemStore((state) => state.system)
  const toggleTheme = useSystemStore((state) => state.toggleTheme)
  const isDark = themeMode === 'dark'

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(6px)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)'
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
          top: 14,
          right: 14,
          color: 'text.secondary',
          '&:hover': {
            color: 'text.primary',
            bgcolor: 'action.hover'
          }
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      {/* Cabeçalho */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pr: 5, mb: 0.5 }}>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: '12px',
            bgcolor: 'rgba(255, 207, 31, 0.15)',
            color: brandColors.flashYellow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <SettingsIcon sx={{ fontSize: 24 }} />
        </Box>
        <Box>
          <Typography
            variant="h6"
            component="h2"
            fontWeight={900}
            sx={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.02em', lineHeight: 1.2 }}
          >
            Configurações do Telão
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Personalize o layout e enquadramento das fotos.
          </Typography>
        </Box>
      </Box>

      {/* Corpo rolável com scroll suave */}
      <Box sx={modalBodyStyles}>
        <Stack spacing={2.5}>
          {/* Seção 1: Formato do Layout */}
          <Box sx={settingsSectionStyles}>
            <Typography sx={settingsSectionTitleStyles}>Disposição do Telão (Layout)</Typography>
            <Stack spacing={1}>
              {SCREEN_LAYOUT_OPTIONS.map((option) => {
                const isSelected = layout === option.id
                return (
                  <Box
                    key={option.id}
                    onClick={() => onChangeLayout(option.id)}
                    sx={getLayoutCardStyles(isSelected)}
                  >
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25, flexWrap: 'wrap' }}>
                        <Typography variant="subtitle2" fontWeight={800}>
                          {option.label}
                        </Typography>
                        {option.tag && (
                          <Chip
                            size="small"
                            label={option.tag}
                            sx={{
                              height: 18,
                              fontSize: '0.65rem',
                              fontWeight: 800,
                              bgcolor: isSelected ? brandColors.flashYellow : 'action.selected',
                              color: isSelected ? brandColors.ink : 'text.secondary'
                            }}
                          />
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.3 }}>
                        {option.subtitle}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
                      {isSelected ? (
                        <CheckIcon sx={{ color: brandColors.flashYellow, fontSize: 22 }} />
                      ) : (
                        <Box
                          sx={{
                            width: 18,
                            height: 18,
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
            </Stack>
          </Box>

          <Divider />

          {/* Seção 2: Enquadramento da Foto */}
          <Box sx={settingsSectionStyles}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FitIcon sx={{ fontSize: 18, color: brandColors.flashYellow }} />
              <Typography sx={settingsSectionTitleStyles}>Enquadramento da Foto</Typography>
            </Box>
            <Stack spacing={1}>
              {SCREEN_PHOTO_FIT_OPTIONS.map((option) => {
                const isSelected = photoFit === option.id
                return (
                  <Box
                    key={option.id}
                    onClick={() => onChangePhotoFit(option.id)}
                    sx={getLayoutCardStyles(isSelected)}
                  >
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="subtitle2" fontWeight={800}>
                        {option.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.3 }}>
                        {option.subtitle}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
                      {isSelected ? (
                        <CheckIcon sx={{ color: brandColors.flashYellow, fontSize: 22 }} />
                      ) : (
                        <Box
                          sx={{
                            width: 18,
                            height: 18,
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
            </Stack>
          </Box>

          <Divider />

          {/* Seção 3: Preferências Gerais */}
          <Box sx={settingsSectionStyles}>
            <Typography sx={settingsSectionTitleStyles}>Preferências de Exibição</Typography>

            <Stack spacing={1.25}>
              {/* Tema Claro / Escuro */}
              <Box sx={settingRowStyles}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {isDark ? <DarkModeIcon sx={{ color: brandColors.flashYellow }} /> : <LightModeIcon sx={{ color: '#F59E0B' }} />}
                  <Box>
                    <Typography variant="body2" fontWeight={700}>
                      Tema da Interface
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {isDark ? 'Modo Escuro' : 'Modo Claro'}
                    </Typography>
                  </Box>
                </Box>
                <Switch
                  checked={isDark}
                  onChange={toggleTheme}
                  inputProps={{ 'aria-label': 'Alternar tema claro e escuro' }}
                />
              </Box>

              {/* Visibilidade do PIN */}
              {hasPin && (
                <Box sx={settingRowStyles}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {showPin ? <VisibilityIcon sx={{ color: 'primary.main' }} /> : <VisibilityOffIcon sx={{ color: 'text.secondary' }} />}
                    <Box>
                      <Typography variant="body2" fontWeight={700}>
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
            </Stack>
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
                  startIcon={<DisconnectIcon />}
                  onClick={() => {
                    onClose()
                    onRequestDisconnect()
                  }}
                  sx={{
                    py: 1.25,
                    borderRadius: '14px',
                    fontWeight: 800,
                    borderWidth: 1.5
                  }}
                >
                  Desconectar este telão
                </Button>
              </Box>
            </>
          )}
        </Stack>
      </Box>

      {/* Rodapé Fixo com Botão Pronto */}
      <Box sx={{ pt: 1.5, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            px: 4,
            py: 1,
            borderRadius: '9999px',
            bgcolor: brandColors.flashYellow,
            color: brandColors.ink,
            fontWeight: 900,
            '&:hover': {
              bgcolor: '#F5C30A'
            }
          }}
        >
          Pronto
        </Button>
      </Box>
    </Dialog>
  )
}

export default ScreenSettingsModal
