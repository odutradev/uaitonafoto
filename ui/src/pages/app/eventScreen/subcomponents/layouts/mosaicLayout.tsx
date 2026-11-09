import { Box } from '@mui/material'

import ScreenBrand from '../screenBrand'
import ScreenPhotoTile from '../screenPhotoTile'
import ScreenQrBlock from '../screenQrBlock'
import type { EventCustomization, EventPhoto } from '@actions/events/types'
import type { ScreenPhotoFit } from '../../types'

interface MosaicLayoutProps {
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

export const MosaicLayout = ({
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
}: MosaicLayoutProps) => {
  // Pega até 5 fotos recentes
  const recentPhotos = Array.from({ length: 5 }, (_, idx) => {
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
      {/* Coluna da esquerda: Foto principal com legenda sobreposta na base */}
      <ScreenPhotoTile
        photo={currentPhoto}
        photoFit={photoFit}
        isMain
        isNewArrival={isNewArrival}
        showOverlay
        aspectRatio="9 / 16"
        sx={{ height: '100%' }}
      />

      {/* Coluna da direita: Mosaico com 5 fotos recentes e QR Code em span 3 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: '1fr 1fr',
          gap: '2cqh',
          minHeight: 0
        }}
      >
        {/* Linha superior: 4 fotos recentes */}
        {recentPhotos.slice(0, 4).map((item, idx) => (
          <ScreenPhotoTile
            key={item?.photo ? item.photo.id : `mosaic-top-${idx}`}
            photo={item?.photo || null}
            photoFit={photoFit}
            aspectRatio="9 / 16"
            sx={{ height: '100%', justifySelf: 'center' }}
            onClick={item?.photo ? () => onSelectPhoto(item.index) : undefined}
          />
        ))}

        {/* Linha inferior: 5ª foto recente */}
        <ScreenPhotoTile
          key={recentPhotos[4]?.photo ? recentPhotos[4].photo.id : 'mosaic-bottom-0'}
          photo={recentPhotos[4]?.photo || null}
          photoFit={photoFit}
          aspectRatio="9 / 16"
          sx={{ height: '100%', justifySelf: 'center' }}
          onClick={recentPhotos[4]?.photo ? () => onSelectPhoto(recentPhotos[4]!.index) : undefined}
        />

        {/* Linha inferior: QR Code ocupando 3 colunas */}
        <ScreenQrBlock
          guestLink={guestLink}
          pin={pin}
          showPin={showPin}
          variant="mosaic"
          headerContent={
            <Box sx={{ mb: '1cqh' }}>
              <ScreenBrand
                customization={customization}
                hideLiveBadge
                onFullscreen={onFullscreen}
                onOpenSettings={onOpenSettings}
              />
            </Box>
          }
        />
      </Box>
    </Box>
  )
}

export default MosaicLayout
