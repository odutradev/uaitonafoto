import { Box } from '@mui/material'

import ScreenPhotoStage from '../screenPhotoStage'
import ScreenQrCard from '../screenQrCard'
import {
  contentGridStyles,
  getThumbnailSlotStyles,
  leftColumnStyles,
  thumbnailImgStyles,
  thumbnailsRowStyles
} from '../../styles'
import type { EventPhoto } from '@actions/events/types'

const THUMBNAIL_SLOTS_COUNT = 6

interface ClassicLayoutProps {
  currentPhoto: EventPhoto | null
  isNewArrival: boolean
  photos: EventPhoto[]
  currentIndex: number
  onSelectPhoto: (index: number) => void
  guestLink: string
  pin: string | null
  showPin: boolean
}

export const ClassicLayout = ({
  currentPhoto,
  isNewArrival,
  photos,
  currentIndex,
  onSelectPhoto,
  guestLink,
  pin,
  showPin
}: ClassicLayoutProps) => {
  return (
    <Box sx={contentGridStyles}>
      <Box sx={leftColumnStyles}>
        <ScreenPhotoStage currentPhoto={currentPhoto} isNewArrival={isNewArrival} />

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
                onClick={() => onSelectPhoto(slotIndex)}
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

      <ScreenQrCard guestLink={guestLink} pin={pin} showPin={showPin} />
    </Box>
  )
}

export default ClassicLayout
