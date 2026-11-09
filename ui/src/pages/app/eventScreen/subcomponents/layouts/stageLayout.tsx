import { Box, Typography } from '@mui/material'

import ScreenBrand from '../screenBrand'
import ScreenPhotoTile from '../screenPhotoTile'
import ScreenQrBlock from '../screenQrBlock'
import type { EventCustomization, EventPhoto } from '@actions/events/types'
import type { ScreenPhotoFit } from '../../types'

interface StageLayoutProps {
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
}

export const StageLayout = ({
  currentPhoto,
  isNewArrival,
  photos,
  currentIndex,
  onSelectPhoto,
  guestLink,
  pin,
  showPin,
  photoFit,
  customization
}: StageLayoutProps) => {
  // Pega até 5 fotos recentes
  const recentPhotos = Array.from({ length: 5 }, (_, idx) => {
    if (photos.length <= 1) return null
    const targetIdx = (currentIndex - 1 - idx + photos.length) % photos.length
    return { photo: photos[targetIdx], index: targetIdx }
  })

  return (
    <>
      {/* Fundo desfocado ambiente cobrindo todo o palco */}
      {currentPhoto && (
        <Box
          sx={{
            position: 'absolute',
            inset: '-10%',
            backgroundImage: `url('${currentPhoto.url}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(6cqh) brightness(0.45) saturate(1.3)',
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />
      )}

      <Box
        sx={{
          height: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 53.4cqh 1fr',
          gap: '2cqh',
          p: '2.5cqh',
          position: 'relative',
          zIndex: 1,
          minHeight: 0
        }}
      >
        {/* Coluna da esquerda: Marca + QR Code empilhado */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '2cqh',
            minHeight: 0,
            minWidth: 0
          }}
        >
          <ScreenBrand customization={customization} />

          <ScreenQrBlock
            guestLink={guestLink}
            pin={pin}
            showPin={showPin}
            variant="stack"
          />
        </Box>

        {/* Coluna central: Foto no centro com legenda sobreposta na base */}
        <ScreenPhotoTile
          photo={currentPhoto}
          photoFit={photoFit}
          isMain
          isNewArrival={isNewArrival}
          showOverlay
          aspectRatio="9 / 16"
          sx={{ height: '100%', width: '100%', justifySelf: 'center' }}
        />

        {/* Coluna da direita: Fotos recentes */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: 0,
            minWidth: 0
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                fontSize: '2.4cqh',
                fontWeight: 700,
                mb: '1.4cqh',
                color: '#d9d2bf',
                letterSpacing: '-0.01em'
              }}
            >
              Fotos recentes
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.6cqh'
              }}
            >
              {recentPhotos.map((item, idx) => (
                <ScreenPhotoTile
                  key={item?.photo ? item.photo.id : `recent-${idx}`}
                  photo={item?.photo || null}
                  photoFit={photoFit}
                  aspectRatio="9 / 16"
                  onClick={item?.photo ? () => onSelectPhoto(item.index) : undefined}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default StageLayout

