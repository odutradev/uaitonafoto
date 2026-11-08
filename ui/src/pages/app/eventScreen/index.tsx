import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material'
import {
  ArrowBack as BackIcon,
  Favorite as LikeIcon,
  Fullscreen as FullscreenIcon,
  PhotoCameraOutlined as CameraIcon
} from '@mui/icons-material'
import { QRCodeSVG } from 'qrcode.react'
import { useNavigate, useParams } from 'react-router-dom'

import Logo from '@components/logo'
import PinInput from '@components/pinInput'
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
  controlsRowStyles,
  iconButtonStyles,
  leftColumnStyles,
  liveBadgeWrapperStyles,
  liveDotStyles,
  liveTextStyles,
  mainCardStyles,
  photoContainerStyles,
  photoStyles,
  qrFrameStyles,
  qrPinBadgeStyles,
  qrPinCodeStyles,
  qrPinLabelStyles,
  qrSubtitleStyles,
  qrTextContainerStyles,
  qrTitleStyles,
  getThumbnailSlotStyles,
  rightCardStyles,
  screenRootStyles,
  thumbnailImgStyles,
  thumbnailsRowStyles,
  topBarStyles,
  waitingEmptyStyles,
  yellowBannerStyles
} from './styles'
import type { FormEvent } from 'react'

const THUMBNAIL_SLOTS_COUNT = 6

const EventScreen = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const {
    isActivated,
    isActivating,
    activationError,
    activate,
    event,
    pin,
    photos,
    currentIndex,
    selectPhoto,
    currentPhoto
  } = useEventScreen(id)
  const [pinInput, setPinInput] = useState('')

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

  const guestLink = event ? buildGuestLink(event.guestToken) : ''

  return (
    <Box sx={screenRootStyles}>
      <Box component="header" sx={topBarStyles}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Logo variant="dark" size="small" />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          <Box sx={liveBadgeWrapperStyles}>
            <Box sx={liveDotStyles} />
            <Typography component="span" sx={liveTextStyles}>
              AO VIVO
            </Typography>
          </Box>

          <Box sx={controlsRowStyles}>
            <Tooltip title="Voltar para o painel">
              <IconButton aria-label="Voltar" onClick={() => navigate(`/app/events/${id}`)} sx={iconButtonStyles} size="small">
                <BackIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Alternar tela cheia">
              <IconButton aria-label="Tela cheia" onClick={handleFullscreen} sx={iconButtonStyles} size="small">
                <FullscreenIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {!isActivated ? (
        <Box sx={activationWrapperStyles}>
          <Box component="form" onSubmit={handleActivateSubmit} sx={activationCardStyles}>
            <Logo variant="dark" size="medium" symbolOnly />
            <Box>
              <Typography
                variant="h5"
                component="h2"
                fontWeight={900}
                sx={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.03em' }}
              >
                Ativar telão do evento
              </Typography>
              <Typography variant="body2" sx={{ color: brandColors.darkTextSecondary, mt: 0.75 }}>
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
              slotSx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: brandColors.darkSurface,
                  color: brandColors.darkTextPrimary,
                  '& fieldset': {
                    borderColor: brandColors.darkBorder
                  },
                  '&:hover fieldset': {
                    borderColor: brandColors.flashYellow
                  }
                }
              }}
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
            <Box sx={mainCardStyles}>
              {currentPhoto ? (
                <>
                  <Box sx={photoContainerStyles}>
                    <Box
                      key={currentPhoto.id}
                      component="img"
                      src={currentPhoto.url}
                      alt={`Foto de ${currentPhoto.guestName}`}
                      sx={photoStyles}
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
                    <Typography variant="body1" sx={{ color: brandColors.darkTextSecondary, maxWidth: 440 }}>
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

              {pin && (
                <Box sx={qrPinBadgeStyles}>
                  <Typography component="span" sx={qrPinLabelStyles}>
                    PIN de acesso
                  </Typography>
                  <Typography component="span" sx={qrPinCodeStyles}>
                    {pin}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default EventScreen
