import { useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material'
import {
  Fullscreen as FullscreenIcon,
  SettingsOutlined as SettingsIcon
} from '@mui/icons-material'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import Logo from '@components/logo'
import Modal from '@components/modal'
import PinInput from '@components/pinInput'
import { buildGuestLink } from '@config/events'
import { brandColors } from '@theme'

import useEventScreen from './hooks/useEventScreen'
import ScreenSettingsModal from './subcomponents/screenSettingsModal'
import LateralLayout from './subcomponents/layouts/lateralLayout'
import StageLayout from './subcomponents/layouts/stageLayout'
import MosaicLayout from './subcomponents/layouts/mosaicLayout'
import DuoLayout from './subcomponents/layouts/duoLayout'
import StoriesLayout from './subcomponents/layouts/storiesLayout'
import {
  activationCardStyles,
  activationWrapperStyles,
  controlsChipStyles,
  iconButtonStyles,
  screenAgencyBadgeStyles,
  screenRootStyles,
  stageContainerStyles,
  stageFrameStyles,
  topBarStyles
} from './styles'
import type { FormEvent } from 'react'
import type { ScreenLayoutMode, ScreenPhotoFit } from './types'

const SCREEN_SHOW_PIN_STORAGE_KEY = 'uaitonafoto:screen:show_pin'
const SCREEN_LAYOUT_STORAGE_KEY = 'uaitonafoto:screen:layout'
const SCREEN_PHOTO_FIT_STORAGE_KEY = 'uaitonafoto:screen:photo_fit'

const EventScreen = () => {
  const { token, id } = useParams()
  const eventIdentifier = token || id || ''
  const {
    isActivated,
    isActivating,
    activationError,
    activate,
    disconnect,
    lockout,
    event,
    pin,
    photos,
    currentIndex,
    selectPhoto,
    currentPhoto,
    isLiveStreamConnected,
    isNewArrival
  } = useEventScreen(eventIdentifier)
  const [pinInput, setPinInput] = useState('')
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [layoutMode, setLayoutMode] = useState<ScreenLayoutMode>(() => {
    const stored = localStorage.getItem(SCREEN_LAYOUT_STORAGE_KEY)
    if (
      stored === 'stories' ||
      stored === 'lateral' ||
      stored === 'stage' ||
      stored === 'mosaic' ||
      stored === 'duo'
    ) {
      return stored
    }
    // Compatibilidade com configurações anteriores
    if (stored === 'side-hub') return 'lateral'
    if (stored === 'classic') return 'stage'
    if (stored === 'social-feed') return 'stories'
    return 'stories'
  })
  const [photoFit, setPhotoFit] = useState<ScreenPhotoFit>(() => {
    const stored = localStorage.getItem(SCREEN_PHOTO_FIT_STORAGE_KEY) as ScreenPhotoFit | null
    if (stored && ['cover', 'contain'].includes(stored)) {
      return stored
    }
    return 'contain'
  })
  const [showPin, setShowPin] = useState<boolean>(() => {
    const stored = localStorage.getItem(SCREEN_SHOW_PIN_STORAGE_KEY)
    return stored !== null ? stored === 'true' : true
  })

  const handleTogglePinVisibility = () => {
    setShowPin((prev) => {
      const next = !prev
      localStorage.setItem(SCREEN_SHOW_PIN_STORAGE_KEY, String(next))
      return next
    })
  }

  const handleLayoutChange = (mode: ScreenLayoutMode) => {
    setLayoutMode(mode)
    localStorage.setItem(SCREEN_LAYOUT_STORAGE_KEY, mode)
  }

  const handlePhotoFitChange = (fit: ScreenPhotoFit) => {
    setPhotoFit(fit)
    localStorage.setItem(SCREEN_PHOTO_FIT_STORAGE_KEY, fit)
  }

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }

  const handleActivateSubmit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault()
    if (lockout.isLocked || !/^\d{4}$/.test(pinInput)) return
    await activate(pinInput)
  }

  const guestLink = event ? buildGuestLink(event.guestToken) : token ? buildGuestLink(token) : ''

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
                  onClick={() => setIsSettingsModalOpen(true)}
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
        /* Telão Ativado: Background fluido em tela cheia (100vw x 100vh) com palco imersivo */
        <Box sx={stageContainerStyles}>
          {/* Fundo ambiente cobrindo toda a tela (ultrawide, 16:9, etc.) */}
          <Box
            aria-hidden="true"
            sx={{
              position: 'absolute',
              inset: '-10%',
              width: '120vw',
              height: '120vh',
              bgcolor: '#14110c',
              ...(currentPhoto?.url
                ? {
                    backgroundImage: `url('${currentPhoto.url}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(60px) brightness(0.35) saturate(1.4)',
                    transform: 'scale(1.15)',
                    transition: 'background-image 0.8s ease'
                  }
                : {
                    background: 'radial-gradient(ellipse at center, #1e1912 0%, #100e0b 100%)'
                  }),
              pointerEvents: 'none',
              zIndex: 0
            }}
          />

          {/* Máscara de vinheta suave cobrindo 100% da tela */}
          <Box
            aria-hidden="true"
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, transparent 35%, rgba(10, 8, 6, 0.75) 100%)',
              pointerEvents: 'none',
              zIndex: 0
            }}
          />

          <Box id="stage" sx={stageFrameStyles}>
            {layoutMode === 'stories' ? (
              <StoriesLayout
                currentPhoto={currentPhoto}
                isNewArrival={isNewArrival}
                photos={photos}
                currentIndex={currentIndex}
                onSelectPhoto={selectPhoto}
                guestLink={guestLink}
                pin={pin}
                showPin={showPin}
                photoFit={photoFit}
                customization={event?.customization}
                onFullscreen={handleFullscreen}
                onOpenSettings={() => setIsSettingsModalOpen(true)}
              />
            ) : layoutMode === 'stage' ? (
              <StageLayout
                currentPhoto={currentPhoto}
                isNewArrival={isNewArrival}
                photos={photos}
                currentIndex={currentIndex}
                onSelectPhoto={selectPhoto}
                guestLink={guestLink}
                pin={pin}
                showPin={showPin}
                photoFit={photoFit}
                customization={event?.customization}
                onFullscreen={handleFullscreen}
                onOpenSettings={() => setIsSettingsModalOpen(true)}
              />
            ) : layoutMode === 'mosaic' ? (
              <MosaicLayout
                currentPhoto={currentPhoto}
                isNewArrival={isNewArrival}
                photos={photos}
                currentIndex={currentIndex}
                onSelectPhoto={selectPhoto}
                guestLink={guestLink}
                pin={pin}
                showPin={showPin}
                photoFit={photoFit}
                customization={event?.customization}
                onFullscreen={handleFullscreen}
                onOpenSettings={() => setIsSettingsModalOpen(true)}
              />
            ) : layoutMode === 'duo' ? (
              <DuoLayout
                currentPhoto={currentPhoto}
                isNewArrival={isNewArrival}
                photos={photos}
                currentIndex={currentIndex}
                onSelectPhoto={selectPhoto}
                guestLink={guestLink}
                pin={pin}
                showPin={showPin}
                photoFit={photoFit}
                customization={event?.customization}
                onFullscreen={handleFullscreen}
                onOpenSettings={() => setIsSettingsModalOpen(true)}
              />
            ) : (
              <LateralLayout
                currentPhoto={currentPhoto}
                isNewArrival={isNewArrival}
                photos={photos}
                currentIndex={currentIndex}
                onSelectPhoto={selectPhoto}
                guestLink={guestLink}
                pin={pin}
                showPin={showPin}
                photoFit={photoFit}
                customization={event?.customization}
                onFullscreen={handleFullscreen}
                onOpenSettings={() => setIsSettingsModalOpen(true)}
              />
            )}
          </Box>
        </Box>
      )}

      <ScreenSettingsModal
        open={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        layout={layoutMode}
        onChangeLayout={handleLayoutChange}
        photoFit={photoFit}
        onChangePhotoFit={handlePhotoFitChange}
        showPin={showPin}
        onTogglePin={handleTogglePinVisibility}
        hasPin={Boolean(pin)}
        isActivated={isActivated}
        onRequestDisconnect={() => setIsDisconnectModalOpen(true)}
      />

      <Modal
        open={isDisconnectModalOpen}
        onClose={() => setIsDisconnectModalOpen(false)}
        variant="warning"
        title="Desconectar este telão?"
        description="Este dispositivo deixará de exibir as fotos ao vivo e sua vaga será liberada no painel de gestão do evento."
        primaryAction={{
          label: 'Desconectar',
          color: 'error',
          onClick: async () => {
            setIsDisconnectModalOpen(false)
            await disconnect()
            toast.info('Telão desconectado e vaga liberada com sucesso.')
          }
        }}
        secondaryAction={{
          label: 'Cancelar',
          onClick: () => setIsDisconnectModalOpen(false)
        }}
      />
    </>
  )
}

export default EventScreen
