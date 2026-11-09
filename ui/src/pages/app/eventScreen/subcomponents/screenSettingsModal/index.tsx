import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Switch,
  Typography
} from '@mui/material'
import {
  CheckCircle as CheckIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  PowerSettingsNew as DisconnectIcon,
  Tune as SettingsIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material'

import Modal from '@components/modal'
import useSystemStore from '@stores/system'
import { brandColors } from '@theme'

import { SCREEN_LAYOUT_OPTIONS } from '../../types'
import {
  getLayoutCardStyles,
  settingRowStyles,
  settingsSectionStyles,
  settingsSectionTitleStyles
} from './styles'
import type { ScreenLayoutMode } from '../../types'

interface ScreenSettingsModalProps {
  open: boolean
  onClose: () => void
  layout: ScreenLayoutMode
  onChangeLayout: (mode: ScreenLayoutMode) => void
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
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="sm"
      title="Configurações do Telão"
      description="Personalize o formato de exibição das fotos e as preferências deste dispositivo."
      icon={<SettingsIcon />}
      primaryAction={{
        label: 'Pronto',
        color: 'primary',
        onClick: onClose
      }}
    >
      <Stack spacing={3} sx={{ mt: 1 }}>
        {/* Seção 1: Formato do Layout */}
        <Box sx={settingsSectionStyles}>
          <Typography sx={settingsSectionTitleStyles}>Disposição do Telão (Layout)</Typography>
          <Stack spacing={1.25}>
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
                            height: 20,
                            fontSize: '0.68rem',
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
          </Stack>
        </Box>

        <Divider />

        {/* Seção 2: Preferências Gerais */}
        <Box sx={settingsSectionStyles}>
          <Typography sx={settingsSectionTitleStyles}>Preferências de Exibição</Typography>

          <Stack spacing={1.5}>
            {/* Tema Claro / Escuro */}
            <Box sx={settingRowStyles}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {isDark ? <DarkModeIcon sx={{ color: brandColors.flashYellow }} /> : <LightModeIcon sx={{ color: '#F59E0B' }} />}
                <Box>
                  <Typography variant="body2" fontWeight={700}>
                    Tema da Interface
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {isDark ? 'Modo Escuro (ideal para ambientes de festa)' : 'Modo Claro'}
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
                      {showPin ? 'O código numérico de 4 dígitos está visível abaixo do QR Code' : 'O PIN está oculto (apenas QR Code)'}
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

        {/* Seção 3: Desconectar (se ativado) */}
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
    </Modal>
  )
}

export default ScreenSettingsModal
