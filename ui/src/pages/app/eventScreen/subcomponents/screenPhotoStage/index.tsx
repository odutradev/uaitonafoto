import { Box, Typography } from '@mui/material'
import {
  Favorite as LikeIcon,
  PhotoCameraOutlined as CameraIcon
} from '@mui/icons-material'

import { formatGuestTaNaFoto } from '@config/events'
import { brandColors } from '@theme'

import {
  bannerAuthorStyles,
  bannerLikesStyles,
  bannerTextRowStyles,
  bannerTextStyles,
  getMainCardStyles,
  getPhotoContainerStyles,
  getPhotoStyles,
  photoBackdropStyles,
  waitingEmptyStyles,
  yellowBannerStyles
} from '../../styles'
import type { EventPhoto } from '@actions/events/types'
import type { ScreenPhotoFit } from '../../types'

interface ScreenPhotoStageProps {
  currentPhoto: EventPhoto | null
  isNewArrival: boolean
  photoFit?: ScreenPhotoFit
}

export const ScreenPhotoStage = ({
  currentPhoto,
  isNewArrival,
  photoFit = 'cover'
}: ScreenPhotoStageProps) => {
  return (
    <Box sx={getMainCardStyles(isNewArrival)}>
      {currentPhoto ? (
        <>
          <Box sx={getPhotoContainerStyles(photoFit)}>
            {/* Se photoFit for contain, renderiza backdrop sutil para quem desejar ver a imagem inteira */}
            {photoFit === 'contain' && (
              <Box
                component="img"
                src={currentPhoto.url}
                alt=""
                aria-hidden="true"
                sx={photoBackdropStyles}
              />
            )}

            {/* Apenas o badge de evento recém-chegado (sem duplicar o texto da missão sobre a foto) */}
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

            {/* Foto principal: em 'cover' preenche todo o espaço sem nenhuma borda */}
            <Box
              key={currentPhoto.id}
              component="img"
              src={currentPhoto.url}
              alt={`Foto de ${currentPhoto.guestName}`}
              sx={getPhotoStyles(isNewArrival, photoFit)}
            />
          </Box>

          {/* Banner inferior oficial com o convidado e missão cumprida (sem duplicações no topo) */}
          <Box sx={yellowBannerStyles}>
            <Box sx={bannerTextRowStyles}>
              <Typography component="span" sx={bannerAuthorStyles}>
                {formatGuestTaNaFoto(currentPhoto.guestName)}
              </Typography>
              {currentPhoto.challengeTitle && (
                <Typography component="span" sx={bannerTextStyles}>
                  • cumpriu a missão: "{currentPhoto.challengeTitle}"
                </Typography>
              )}
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
                voceTaNaFoto
              </Typography>
              <Typography component="span" sx={bannerTextStyles}>
                • seja o primeiro a mandar sua foto!
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Box>
  )
}

export default ScreenPhotoStage
