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
  Favorite as LikeIcon,
  Fullscreen as FullscreenIcon,
  PhotoCameraOutlined as CameraIcon,
  PowerSettingsNew as DisconnectIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material'
import { QRCodeSVG } from 'qrcode.react'
import { useParams } from 'react-router-dom'

import Logo from '@components/logo'
import Modal from '@components/modal'
import PinInput from '@components/pinInput'
import ThemeToggle from '@components/themeToggle'
import { buildGuestLink } from '@config/events'
import { brandColors } from '@theme'

import useEventScreen from './hooks/useEventScreen'
import {
  activationCardStyles,
  activationWrapperStyles,
  bannerAuthorStyles,
  bannerLikesStyles,
  bannerTextRowStyles,
  bannerTextStyles,
  contentGridStyles,
  controlsChipStyles,
  getMainCardStyles,
  getPhotoStyles,
  iconButtonStyles,
  leftColumnStyles,
  photoContainerStyles,
  qrFrameStyles,
  qrPinBadgeStyles,
  qrPinCodeStyles,
  qrPinLabelStyles,
  qrSubtitleStyles,
  qrTextContainerStyles,
  qrTitleStyles,
  getThumbnailSlotStyles,
  rightCardStyles,
  screenAgencyBadgeStyles,
  screenRootStyles,
  thumbnailImgStyles,
  thumbnailsRowStyles,
  topBarStyles,
  waitingEmptyStyles,
  yellowBannerStyles
} from './styles'
import type { FormEvent } from 'react'

const THUMBNAIL_SLOTS_COUNT = 6
const SCREEN_SHOW_PIN_STORAGE_KEY = 'uaitonafoto:screen:show_pin'

const EventScreen = () => {
  const { token, id } = useParams()
  const eventIdentifier = token || id || ''
  const {
    isActivated,
    isActivating,
    activationError,
    activate,
    disconnect,
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

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }

  const handleActivateSubmit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault()
    if (!/^\d{4}$/.test(pinInput)) return
    await activate(pinInput)
  }

  const guestLink = event ? buildGuestLink(event.guestToken) : token ? buildGuestLink(token) : ''

  return (
    <Box sx={screenRootStyles}>
      <Box component="header" sx={topBarStyles}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Logo variant="auto" size="small" />
          {isActivated && isLiveStreamConnected && (
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
          {pin && (
            <Tooltip title={showPin ? 'Ocultar PIN' : 'Mostrar PIN'}>
              <IconButton
                aria-label={showPin ? 'Ocultar PIN' : 'Mostrar PIN'}
                onClick={handleTogglePinVisibility}
                sx={iconButtonStyles}
                size="small"
              >
                {showPin ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          )}
          <ThemeToggle sx={iconButtonStyles} size="small" />
          <Tooltip title="Alternar tela cheia">
            <IconButton aria-label="Tela cheia" onClick={handleFullscreen} sx={iconButtonStyles} size="small">
              <FullscreenIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {isActivated && (
            <Tooltip title="Desconectar telão">
              <IconButton
                aria-label="Desconectar telão"
                onClick={() => setIsDisconnectModalOpen(true)}
                sx={iconButtonStyles}
                size="small"
              >
                <DisconnectIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {!isActivated ? (
        <Box sx={activationWrapperStyles}>
          <Box component="form" onSubmit={handleActivateSubmit} sx={activationCardStyles}>
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

            {activationError && (
              <Alert severity="error" sx={{ width: '100%', textAlign: 'left' }}>
                {activationError}
              </Alert>
            )}

            <PinInput
              value={pinInput}
              onChange={setPinInput}
              autoFocus
              disabled={isActivating}
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
              disabled={isActivating || !/^\d{4}$/.test(pinInput)}
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
              {isActivating ? 'Ativando...' : 'Ativar telão'}
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={contentGridStyles}>
          <Box sx={leftColumnStyles}>
            <Box sx={getMainCardStyles(isNewArrival)}>
              {currentPhoto ? (
                <>
                  <Box sx={photoContainerStyles}>
                    {isNewArrival && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 18,
                          left: 18,
                          bgcolor: brandColors.flashYellow,
                          color: brandColors.ink,
                          fontWeight: 900,
                          fontSize: '0.8rem',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          px: 2,
                          py: 0.7,
                          borderRadius: '9999px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          animation: 'photoEntrance 0.5s ease',
                          zIndex: 5
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: brandColors.ink
                          }}
                        />
                        Nova foto na festa!
                      </Box>
                    )}
                    <Box
                      key={currentPhoto.id}
                      component="img"
                      src={currentPhoto.url}
                      alt={`Foto de ${currentPhoto.guestName}`}
                      sx={getPhotoStyles(isNewArrival)}
                    />
                  </Box>

                  <Box sx={yellowBannerStyles}>
                    <Box sx={bannerTextRowStyles}>
                      <Typography component="span" sx={bannerAuthorStyles}>
                        {currentPhoto.guestName}
                      </Typography>
                      <Typography component="span" sx={bannerTextStyles}>
                        entrou na foto
                      </Typography>
                    </Box>

                    {currentPhoto.likesCount > 0 && (
                      <Box sx={bannerLikesStyles}>
                        <LikeIcon fontSize="small" sx={{ color: brandColors.ink }} />
                        <Typography component="span" fontWeight={900}>
                          {currentPhoto.likesCount}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </>
              ) : (
                <>
                  <Box sx={waitingEmptyStyles}>
                    <CameraIcon sx={{ fontSize: { xs: 54, md: 72 }, color: brandColors.flashYellow, opacity: 0.85 }} />
                    <Typography
                      variant="h4"
                      fontWeight={900}
                      sx={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.03em' }}
                    >
                      O mural ao vivo está aberto!
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 440 }}>
                      Aponte a câmera do seu celular para o QR Code ao lado e seja o primeiro a mandar sua foto.
                    </Typography>
                  </Box>

                  <Box sx={yellowBannerStyles}>
                    <Box sx={bannerTextRowStyles}>
                      <Typography component="span" sx={bannerAuthorStyles}>
                        seja o primeiro
                      </Typography>
                      <Typography component="span" sx={bannerTextStyles}>
                        a entrar na foto
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
            </Box>

            <Box sx={thumbnailsRowStyles}>
              {Array.from({ length: THUMBNAIL_SLOTS_COUNT }).map((_, slotIndex) => {
                const photo = photos[slotIndex]
                const isActive = slotIndex === currentIndex

                if (!photo) {
                  return <Box key={`slot-${slotIndex}`} sx={getThumbnailSlotStyles(false)} />
                }

                return (
                  <Box
                    key={photo.id}
                    onClick={() => selectPhoto(slotIndex)}
                    sx={getThumbnailSlotStyles(isActive)}
                  >
                    <Box
                      component="img"
                      src={photo.url}
                      alt={`Miniatura ${slotIndex + 1}`}
                      sx={thumbnailImgStyles}
                    />
                  </Box>
                )
              })}
            </Box>
          </Box>

          <Box sx={rightCardStyles}>
            <Box sx={qrFrameStyles}>
              {guestLink ? (
                <QRCodeSVG
                  value={guestLink}
                  size={220}
                  bgColor="transparent"
                  fgColor={brandColors.ink}
                  level="M"
                />
              ) : null}
            </Box>

            <Box sx={qrTextContainerStyles}>
              <Typography component="h2" sx={qrTitleStyles}>
                escaneia e<br />
                entra na foto
              </Typography>
              <Typography component="p" sx={qrSubtitleStyles}>
                sem app, sem cadastro
              </Typography>

              {pin && showPin && (
                <Box sx={qrPinBadgeStyles}>
                  <Typography component="span" sx={qrPinLabelStyles}>
                    PIN de acesso
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography component="span" sx={qrPinCodeStyles}>
                      {pin}
                    </Typography>
                    <Tooltip title="Ocultar PIN">
                      <IconButton
                        size="small"
                        onClick={handleTogglePinVisibility}
                        aria-label="Ocultar PIN"
                        sx={(theme) => ({
                          p: 0.5,
                          color: theme.palette.mode === 'dark' ? brandColors.darkTextSecondary : brandColors.textGray,
                          '&:hover': {
                            color: theme.palette.mode === 'dark' ? brandColors.darkTextPrimary : brandColors.ink
                          }
                        })}
                      >
                        <VisibilityOffIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}

      <Modal
        open={isDisconnectModalOpen}
        onClose={() => setIsDisconnectModalOpen(false)}
        variant="warning"
        title="Desconectar este telão?"
        description="Este dispositivo deixará de exibir as fotos ao vivo. Para reconectá-lo, será necessário inserir o PIN novamente."
        primaryAction={{
          label: 'Desconectar',
          color: 'error',
          onClick: () => {
            setIsDisconnectModalOpen(false)
            disconnect()
          }
        }}
        secondaryAction={{
          label: 'Cancelar',
          onClick: () => setIsDisconnectModalOpen(false)
        }}
      />
    </Box>
  )
}

export default EventScreen
