import { Box, Typography } from '@mui/material'
import { Favorite as LikeIcon, PhotoCameraOutlined as CameraIcon } from '@mui/icons-material'

import { formatGuestTaNaFoto } from '@utils/functions/events'
import type { EventPhoto } from '@utils/types/events'
import type { ScreenPhotoFit } from '@pages/app/eventScreen/types'
import type { SxProps, Theme } from '@mui/material'

interface ScreenPhotoTileProps {
  photo: EventPhoto | null
  photoFit?: ScreenPhotoFit
  isMain?: boolean
  isNewArrival?: boolean
  showOverlay?: boolean
  label?: string
  aspectRatio?: string
  onClick?: () => void
  sx?: SxProps<Theme>
}

export const ScreenPhotoTile = ({
  photo,
  photoFit = 'contain',
  isMain = false,
  isNewArrival = false,
  showOverlay = false,
  label,
  aspectRatio = '9 / 16',
  onClick,
  sx
}: ScreenPhotoTileProps) => {
  return (
    <Box
      onClick={onClick}
      sx={[
        (theme) => ({
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '1.6cqh',
          bgcolor: theme.palette.mode === 'dark' ? '#0a0907' : '#e7e1d2',
          minHeight: 0,
          aspectRatio,
          cursor: onClick ? 'pointer' : 'default',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': onClick
            ? {
                transform: 'scale(1.02)',
                boxShadow: '0 0 20px rgba(255, 210, 31, 0.35)',
                zIndex: 3
              }
            : undefined
        }),
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
    >
      {photo ? (
        <>
          {/* Fundo desfocado quando photoFit é contain */}
          {photoFit === 'contain' && (
            <Box
              component="img"
              src={photo.url}
              alt=""
              aria-hidden="true"
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'blur(2.5cqh) brightness(0.55)',
                transform: 'scale(1.25)',
                pointerEvents: 'none'
              }}
            />
          )}

          {/* Imagem em primeiro plano */}
          <Box
            component="img"
            src={photo.url}
            alt={photo.guestName ? `Foto de ${photo.guestName}` : 'Foto do evento'}
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: photoFit === 'cover' ? 'cover' : 'contain',
              zIndex: 1,
              animation: isNewArrival && isMain ? 'photoEntrance 0.7s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
              '@keyframes photoEntrance': {
                '0%': { opacity: 0, transform: 'scale(0.94)' },
                '100%': { opacity: 1, transform: 'scale(1)' }
              }
            }}
          />

          {/* Badge de rótulo (ex: "Anterior") */}
          {label && (
            <Box
              sx={{
                position: 'absolute',
                top: '1.6cqh',
                left: '1.6cqh',
                zIndex: 2,
                bgcolor: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(4px)',
                color: '#ffffff',
                px: '1.4cqh',
                py: '0.6cqh',
                borderRadius: '1cqh',
                fontSize: '2cqh',
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}
            >
              {label}
            </Box>
          )}

          {/* Badge de Nova Foto */}
          {isNewArrival && isMain && (
            <Box
              sx={{
                position: 'absolute',
                top: '1.6cqh',
                right: '1.6cqh',
                zIndex: 3,
                bgcolor: '#ffd21f',
                color: '#14110c',
                px: '1.4cqh',
                py: '0.6cqh',
                borderRadius: '2cqh',
                fontSize: '1.9cqh',
                fontWeight: 800,
                letterSpacing: '0.04em',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8cqh'
              }}
            >
              <Box
                sx={{
                  width: '1cqh',
                  height: '1cqh',
                  borderRadius: '50%',
                  bgcolor: '#14110c'
                }}
              />
              NOVA FOTO
            </Box>
          )}

          {/* Overlay inferior com autor, curtidas e missão */}
          {showOverlay && (
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                pt: '9cqh',
                px: '2.2cqh',
                pb: '2.2cqh',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.88))',
                zIndex: 2,
                pointerEvents: 'none'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '1.2cqh', flexWrap: 'wrap' }}>
                <Typography
                  component="div"
                  sx={{
                    fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                    fontWeight: 800,
                    fontSize: '3.6cqh',
                    color: '#ffd21f',
                    lineHeight: 1.05,
                    letterSpacing: '-0.02em'
                  }}
                >
                  {formatGuestTaNaFoto(photo.guestName)}
                </Typography>
                {photo.likesCount > 0 && (
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4cqh',
                      color: '#ffd21f',
                      fontSize: '3cqh',
                      fontWeight: 800
                    }}
                  >
                    <LikeIcon sx={{ fontSize: '3cqh' }} />
                    {photo.likesCount}
                  </Box>
                )}
              </Box>

              {photo.challengeTitle && (
                <Typography
                  component="div"
                  sx={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: '2.5cqh',
                    lineHeight: 1.2,
                    mt: '0.7cqh',
                    color: '#f6f1e4',
                    fontWeight: 500
                  }}
                >
                  cumpriu a missão: “{photo.challengeTitle}”
                </Typography>
              )}
            </Box>
          )}
        </>
      ) : (
        /* Estado vazio quando não há foto ainda */
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: '2cqh',
            textAlign: 'center',
            gap: '1cqh',
            bgcolor: 'rgba(255, 255, 255, 0.03)'
          }}
        >
          <CameraIcon sx={{ fontSize: '6cqh', color: '#ffd21f', opacity: 0.8 }} />
          {isMain && (
            <>
              <Typography
                sx={{
                  fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: '3.2cqh',
                  color: '#ffd21f',
                  lineHeight: 1.1
                }}
              >
                Mural Aberto!
              </Typography>
              <Typography sx={{ fontSize: '2cqh', color: '#b9b2a0', maxWidth: '30cqh' }}>
                Escaneie o QR Code para enviar a primeira foto
              </Typography>
            </>
          )}
        </Box>
      )}
    </Box>
  )
}

export default ScreenPhotoTile

