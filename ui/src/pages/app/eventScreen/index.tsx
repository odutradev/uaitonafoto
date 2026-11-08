import { useState } from 'react'
import { Alert, Box, Button, IconButton, TextField, Typography } from '@mui/material'
import {
  ArrowBack as BackIcon,
  Favorite as LikeIcon,
  Fullscreen as FullscreenIcon,
  LiveTvOutlined as ScreenIcon
} from '@mui/icons-material'
import { QRCodeSVG } from 'qrcode.react'
import { useNavigate, useParams } from 'react-router-dom'

import { buildGuestLink } from '@config/events'

import useEventScreen from './hooks/useEventScreen'
import {
  activationCardStyles,
  activationPinInputStyles,
  captionStyles,
  eventNameStyles,
  iconButtonStyles,
  photoStyles,
  pinBadgeStyles,
  qrBoxStyles,
  screenRootStyles,
  topBarStyles,
  waitingStyles
} from './styles'
import type { FormEvent } from 'react'

const EventScreen = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { isActivated, isActivating, activationError, activate, event, pin, currentPhoto, message } = useEventScreen(id)
  const [pinInput, setPinInput] = useState('')

  const handleFullscreen = () => document.documentElement.requestFullscreen?.()

  const handleActivateSubmit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault()
    if (!/^\d{4}$/.test(pinInput)) return
    await activate(pinInput)
  }

  return (
    <Box sx={screenRootStyles}>
      <Box sx={topBarStyles}>
        <IconButton aria-label="Voltar ao evento" onClick={() => navigate(`/app/events/${id}`)} sx={iconButtonStyles}>
          <BackIcon />
        </IconButton>
        <Typography component="h1" sx={eventNameStyles}>
          {event?.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {isActivated && pin && <Typography sx={pinBadgeStyles}>PIN: {pin}</Typography>}
          <IconButton aria-label="Tela cheia" onClick={handleFullscreen} sx={iconButtonStyles}>
            <FullscreenIcon />
          </IconButton>
        </Box>
      </Box>

      {!isActivated ? (
        <Box component="form" onSubmit={handleActivateSubmit} sx={activationCardStyles}>
          <ScreenIcon sx={{ fontSize: 48, color: 'primary.main' }} />
          <Box>
            <Typography variant="h5" component="h2" fontWeight={800}>
              Ativar telão do evento
            </Typography>
            <Typography variant="body2" color="grey.400" sx={{ mt: 0.75 }}>
              Digite o PIN de 4 dígitos gerado pelo administrador no painel do evento para liberar este telão.
            </Typography>
          </Box>

          {activationError && (
            <Alert severity="error" sx={{ width: '100%', textAlign: 'left' }}>
              {activationError}
            </Alert>
          )}

          <TextField
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="0000"
            autoFocus
            sx={activationPinInputStyles}
            slotProps={{
              htmlInput: {
                inputMode: 'numeric',
                pattern: '[0-9]*',
                maxLength: 4,
                'aria-label': 'PIN de ativação do telão'
              }
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isActivating || !/^\d{4}$/.test(pinInput)}
          >
            {isActivating ? 'Ativando...' : 'Ativar telão'}
          </Button>
        </Box>
      ) : currentPhoto ? (
        <>
          <Box
            key={currentPhoto.id}
            component="img"
            src={currentPhoto.url}
            alt={`Foto de ${currentPhoto.guestName}`}
            sx={photoStyles}
          />
          <Typography sx={captionStyles}>
            {currentPhoto.guestName}
            {currentPhoto.likesCount > 0 && (
              <>
                {' · '}
                <LikeIcon fontSize="inherit" sx={{ verticalAlign: 'middle' }} /> {currentPhoto.likesCount}
              </>
            )}
          </Typography>
        </>
      ) : (
        <Box sx={waitingStyles}>
          {event && (
            <Box sx={qrBoxStyles}>
              <QRCodeSVG value={buildGuestLink(event.guestToken)} size={200} />
            </Box>
          )}
          {pin && <Typography sx={pinBadgeStyles}>PIN de acesso: {pin}</Typography>}
          <Typography variant="h5">{message ?? 'Aguardando as primeiras fotos...'}</Typography>
          <Typography variant="body1" color="grey.400">
            Escaneie o QR Code para enviar suas fotos
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default EventScreen
