import { Box, Typography } from '@mui/material'
import { Favorite as LikeIcon } from '@mui/icons-material'

import { formatGuestTaNaFoto } from '@utils/functions/events'
import ScreenBrand from '@pages/app/eventScreen/subcomponents/screenBrand'
import ScreenPhotoTile from '@pages/app/eventScreen/subcomponents/screenPhotoTile'
import ScreenQrBlock from '@pages/app/eventScreen/subcomponents/screenQrBlock'
import type { EventCustomization, EventPhoto } from '@utils/types/events'
import type { ScreenPhotoFit } from '@pages/app/eventScreen/types'

interface LateralLayoutProps {
  currentPhoto: EventPhoto | null
  isNewArrival: boolean
  photos: EventPhoto[]
  currentIndex: number
  onSelectPhoto: (index: number) => void
  guestLink: string
  pin: string | null
  showPin: boolean
  photoFit: ScreenPhotoFit
  customization?: EventCustomization
  onFullscreen?: () => void
  onOpenSettings?: () => void
}

export const LateralLayout = ({
  currentPhoto,
  isNewArrival,
  photos,
  currentIndex,
  onSelectPhoto,
  guestLink,
  pin,
  showPin,
  photoFit,
  customization,
  onFullscreen,
  onOpenSettings
}: LateralLayoutProps) => {
  // Pega até 4 fotos recentes anteriores à atual
  const recentPhotos = Array.from({ length: 4 }, (_, idx) => {
    if (photos.length <= 1) return null
    const targetIdx = (currentIndex - 1 - idx + photos.length) % photos.length
    return { photo: photos[targetIdx], index: targetIdx }
  })

  return (
    <Box
      sx={{
        height: '100%',
        display: 'grid',
        gridTemplateColumns: '53.4cqh 1fr',
        gap: '2cqh',
        p: '2.5cqh',
        position: 'relative',
        zIndex: 1,
        minHeight: 0
      }}
    >
      {/* Foto principal com aspecto 9:16 e altura total */}
      <ScreenPhotoTile
        photo={currentPhoto}
        photoFit={photoFit}
        isMain
        isNewArrival={isNewArrival}
        aspectRatio="9 / 16"
        sx={{ height: '100%' }}
      />

      {/* Coluna da direita: Brand + Legenda Grande + Rodapé com Recentes e QR */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2cqh',
          minHeight: 0,
          minWidth: 0
        }}
      >
        <ScreenBrand
          customization={customization}
          onFullscreen={onFullscreen}
          onOpenSettings={onOpenSettings}
        />

        {/* Legenda grande em destaque */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: 0
          }}
        >
          {currentPhoto ? (
            <>
              <Typography
                component="div"
                sx={{
                  fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: '8cqh',
                  lineHeight: 1,
                  color: '#ffd21f',
                  letterSpacing: '-0.02em'
                }}
              >
                {formatGuestTaNaFoto(currentPhoto.guestName)}
              </Typography>

              {currentPhoto.challengeTitle && (
                <Typography
                  component="div"
                  sx={(theme) => ({
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: '4.4cqh',
                    lineHeight: 1.15,
                    mt: '2cqh',
                    fontWeight: 500,
                    color:
                      theme.palette.mode === 'dark'
                        ? '#f6f1e4'
                        : '#1b1b1b'
                  })}
                >
                  cumpriu a missão: “{currentPhoto.challengeTitle}”
                </Typography>
              )}

              {currentPhoto.likesCount > 0 && (
                <Box
                  sx={{
                    mt: '2cqh',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8cqh',
                    fontSize: '3cqh',
                    fontWeight: 700,
                    color: '#ffd21f'
                  }}
                >
                  <LikeIcon sx={{ fontSize: '3.2cqh' }} />
                  {currentPhoto.likesCount} curtida{currentPhoto.likesCount > 1 ? 's' : ''}
                </Box>
              )}
            </>
          ) : (
            <Typography
              sx={{
                fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                fontSize: '5cqh',
                fontWeight: 800,
                color: '#ffd21f',
                lineHeight: 1.1
              }}
            >
              Envie sua foto e apareça aqui no telão!
            </Typography>
          )}
        </Box>

        {/* Rodapé: 4 fotos recentes verticais + QR Code */}
        <Box
          sx={{
            display: 'flex',
            gap: '2cqh',
            height: '34cqh',
            minHeight: 0
          }}
        >
          {recentPhotos.map((item, idx) => (
            <ScreenPhotoTile
              key={item?.photo ? item.photo.id : `empty-slot-${idx}`}
              photo={item?.photo || null}
              photoFit={photoFit}
              aspectRatio="9 / 16"
              sx={{ height: '100%', flexShrink: 0 }}
              onClick={item?.photo ? () => onSelectPhoto(item.index) : undefined}
            />
          ))}

          <ScreenQrBlock
            guestLink={guestLink}
            pin={pin}
            showPin={showPin}
            variant="lateral"
          />
        </Box>
      </Box>
    </Box>
  )
}

export default LateralLayout
