import { Box, IconButton, Typography } from '@mui/material'
import {
  ArrowBack as BackIcon,
  Favorite as LikeIcon,
  Fullscreen as FullscreenIcon
} from '@mui/icons-material'
import { QRCodeSVG } from 'qrcode.react'
import { useNavigate, useParams } from 'react-router-dom'

import { buildGuestLink } from '@config/events'

import useEventScreen from './hooks/useEventScreen'
import {
  captionStyles,
  eventNameStyles,
  iconButtonStyles,
  photoStyles,
  qrBoxStyles,
  screenRootStyles,
  topBarStyles,
  waitingStyles
} from './styles'

const EventScreen = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { event, currentPhoto, message } = useEventScreen(id)

  const handleFullscreen = () => document.documentElement.requestFullscreen?.()

  return (
    <Box sx={screenRootStyles}>
      <Box sx={topBarStyles}>
        <IconButton aria-label="Voltar ao evento" onClick={() => navigate(`/app/events/${id}`)} sx={iconButtonStyles}>
          <BackIcon />
        </IconButton>
        <Typography component="h1" sx={eventNameStyles}>
          {event?.name}
        </Typography>
        <IconButton aria-label="Tela cheia" onClick={handleFullscreen} sx={iconButtonStyles}>
          <FullscreenIcon />
        </IconButton>
      </Box>

      {currentPhoto ? (
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
