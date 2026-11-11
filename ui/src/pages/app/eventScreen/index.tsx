import { Alert, Avatar, Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import { Fullscreen as FullscreenIcon, SettingsOutlined as SettingsIcon } from '@mui/icons-material'

import Logo from '@components/logo'
import Modal from '@components/modal'
import PinInput from '@components/pinInput'
import { brandColors } from '@styles/theme'

import useEventScreenPage, { EventScreenPageProvider } from './hook'
import ScreenSettingsModal from './subcomponents/screenSettingsModal'
import LateralLayout from './subcomponents/lateralLayout'
import StageLayout from './subcomponents/stageLayout'
import MosaicLayout from './subcomponents/mosaicLayout'
import DuoLayout from './subcomponents/duoLayout'
import StoriesLayout from './subcomponents/storiesLayout'
import { activationCardStyles, activationWrapperStyles, controlsChipStyles, iconButtonStyles, screenAgencyBadgeStyles, screenRootStyles, stageContainerStyles, stageFrameStyles, topBarStyles } from './styles'

const EventScreenContent = () => {
  const { isActivated, isActivating, activationError, lockout, event, isLiveStreamConnected, pinInput, setPinInput, isDisconnectModalOpen, layoutMode, handleFullscreen, handleActivateSubmit, handleOpenSettings, handleCloseDisconnect, handleConfirmDisconnect } = useEventScreenPage()

  return (
    <>
      {!isActivated ? (
        <Box sx={screenRootStyles}>
          <Box component="header" sx={topBarStyles}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Logo variant="auto" size="small" />
              {isLiveStreamConnected && (
                <Tooltip title="Transmissão instantânea ativa via SSE (<300ms)">
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.75,
                      px: 1.5,
                      py: 0.45,
                      borderRadius: '9999px',
                      bgcolor: 'rgba(34, 197, 94, 0.12)',
                      border: '1px solid rgba(34, 197, 94, 0.35)',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#22c55e',
                      letterSpacing: '0.04em'
                    }}
                  >
                    <Box
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        bgcolor: '#22c55e',
                        boxShadow: '0 0 8px #22c55e'
                      }}
                    />
                    AO VIVO
                  </Box>
                </Tooltip>
              )}
            </Box>

            {event?.customization?.enabled && (
              <Box sx={screenAgencyBadgeStyles}>
                <Avatar
                  src={event.customization.agencyLogoUrl}
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    fontWeight: 800,
                    fontSize: '0.8rem'
                  }}
                >
                  {(event.customization.agencyName || 'A')[0].toUpperCase()}
                </Avatar>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body2" fontWeight={800} sx={{ lineHeight: 1.15 }}>
                    {event.customization.agencyName || 'Assessoria do Evento'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', lineHeight: 1.1 }}>
                    {event.customization.agencyTagline || 'Assessoria & Cerimonial'}
                  </Typography>
                </Box>
              </Box>
            )}

            <Box sx={controlsChipStyles}>
              <Tooltip title="Alternar tela cheia">
                <IconButton aria-label="Tela cheia" onClick={handleFullscreen} sx={iconButtonStyles} size="small">
                  <FullscreenIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Configurações do telão">
                <IconButton
                  aria-label="Configurações do telão"
                  onClick={handleOpenSettings}
                  sx={iconButtonStyles}
                  size="small"
                >
                  <SettingsIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box sx={activationWrapperStyles}>
            <Box component="form" noValidate onSubmit={handleActivateSubmit} sx={activationCardStyles}>
              <Logo variant="auto" size="medium" symbolOnly />
              <Box>
                <Typography
                  variant="h5"
                  component="h2"
                  fontWeight={900}
                  sx={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.03em' }}
                >
                  Ativar telão do evento
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.75 }}>
                  Digite o PIN de 4 dígitos gerado pelo administrador no painel do evento para liberar este dispositivo.
                </Typography>
              </Box>

              {lockout.isPermanent ? (
                <Alert severity="error" sx={{ width: '100%', textAlign: 'left' }}>
                  <Typography variant="subtitle2" fontWeight={800}>
                    Telão bloqueado definitivamente
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    Limite de 10 tentativas incorretas atingido. Entre em contato com o organizador para gerar um novo PIN.
                  </Typography>
                </Alert>
              ) : lockout.isLocked ? (
                <Alert severity="warning" sx={{ width: '100%', textAlign: 'left' }}>
                  <Typography variant="subtitle2" fontWeight={800}>
                    Telão indisponível temporariamente
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    Tente novamente em{' '}
                    <Typography component="span" fontWeight={900} sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      {lockout.formattedTime}
                    </Typography>
                  </Typography>
                </Alert>
              ) : activationError ? (
                <Alert severity="error" sx={{ width: '100%', textAlign: 'left' }}>
                  {activationError}
                </Alert>
              ) : null}

              <PinInput
                value={pinInput}
                onChange={setPinInput}
                autoFocus
                disabled={isActivating || lockout.isLocked}
                mask
                showMaskToggle
                slotSx={(theme) => ({
                  '& .MuiOutlinedInput-root': {
                    bgcolor: theme.palette.mode === 'dark' ? brandColors.darkSurface : brandColors.sand,
                    color: 'text.primary',
                    '& fieldset': {
                      borderColor: theme.palette.divider
                    },
                    '&:hover fieldset': {
                      borderColor: brandColors.flashYellow
                    }
                  }
                })}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isActivating || lockout.isLocked || !/^\d{4}$/.test(pinInput)}
                sx={{
                  bgcolor: brandColors.flashYellow,
                  color: brandColors.ink,
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  py: 1.5,
                  borderRadius: '9999px',
                  '&:hover': {
                    bgcolor: '#F5C30A'
                  }
                }}
              >
                {isActivating
                  ? 'Ativando...'
                  : lockout.isPermanent
                    ? 'Bloqueado definitivamente'
                    : lockout.isLocked
                      ? `Tente novamente em ${lockout.formattedTime}`
                      : 'Ativar telão'}
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        /* Telão Ativado: Palco imersivo que segue o tema (Light/Dark) ocupando toda a tela */
        <Box sx={stageContainerStyles}>
          <Box id="stage" sx={stageFrameStyles}>
            {layoutMode === 'stories' ? (
              <StoriesLayout />
            ) : layoutMode === 'stage' ? (
              <StageLayout />
            ) : layoutMode === 'mosaic' ? (
              <MosaicLayout />
            ) : layoutMode === 'duo' ? (
              <DuoLayout />
            ) : (
              <LateralLayout />
            )}
          </Box>
        </Box>
      )}

      <ScreenSettingsModal />

      <Modal
        open={isDisconnectModalOpen}
        onClose={handleCloseDisconnect}
        variant="warning"
        title="Desconectar este telão?"
        description="Este dispositivo deixará de exibir as fotos ao vivo e sua vaga será liberada no painel de gestão do evento."
        primaryAction={{
          label: 'Desconectar',
          color: 'error',
          onClick: handleConfirmDisconnect
        }}
        secondaryAction={{
          label: 'Cancelar',
          onClick: handleCloseDisconnect
        }}
      />
    </>
  )
}

const EventScreen = () => (
  <EventScreenPageProvider>
    <EventScreenContent />
  </EventScreenPageProvider>
)

export default EventScreen
