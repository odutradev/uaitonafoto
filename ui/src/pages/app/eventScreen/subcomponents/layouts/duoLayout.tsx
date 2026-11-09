import { Box } from '@mui/material'

import ScreenBrand from '../screenBrand'
import ScreenPhotoTile from '../screenPhotoTile'
import ScreenQrBlock from '../screenQrBlock'
import type { EventCustomization, EventPhoto } from '@actions/events/types'
import type { ScreenPhotoFit } from '../../types'

interface DuoLayoutProps {
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

export const DuoLayout = ({
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
}: DuoLayoutProps) => {
  // Foto anterior (rec(1)[0])
  const previousIndex = photos.length > 1 ? (currentIndex - 1 + photos.length) % photos.length : -1
  const previousPhoto = previousIndex >= 0 ? photos[previousIndex] : null

  // 3 miniaturas recentes adicionais
  const recentMiniatures = Array.from({ length: 3 }, (_, idx) => {
    if (photos.length <= 2) return null
    const targetIdx = (currentIndex - 2 - idx + photos.length) % photos.length
    return { photo: photos[targetIdx], index: targetIdx }
  })

  return (
    <Box
      sx={{
        height: '100%',
        display: 'grid',
        gridTemplateColumns: '53.4cqh 53.4cqh 1fr',
        gap: '2cqh',
        p: '2.5cqh',
        position: 'relative',
        zIndex: 1,
        minHeight: 0
      }}
    >
      {/* Coluna 1: Foto atual com overlay de legenda */}
      <ScreenPhotoTile
        photo={currentPhoto}
        photoFit={photoFit}
        isMain
        isNewArrival={isNewArrival}
        showOverlay
        aspectRatio="9 / 16"
        sx={{ height: '100%' }}
      />

      {/* Coluna 2: Foto anterior em mesma altura com badge "Anterior" */}
      <ScreenPhotoTile
        photo={previousPhoto}
        photoFit={photoFit}
        label="Anterior"
        aspectRatio="9 / 16"
        sx={{ height: '100%' }}
        onClick={previousPhoto ? () => onSelectPhoto(previousIndex) : undefined}
      />

      {/* Coluna 3: Marca + QR Code empilhado + 3 miniaturas */}
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

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.4cqh'
          }}
        >
          {recentMiniatures.map((item, idx) => (
            <ScreenPhotoTile
              key={item?.photo ? item.photo.id : `duo-thumb-${idx}`}
              photo={item?.photo || null}
              photoFit={photoFit}
              aspectRatio="9 / 16"
              onClick={item?.photo ? () => onSelectPhoto(item.index) : undefined}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default DuoLayout
