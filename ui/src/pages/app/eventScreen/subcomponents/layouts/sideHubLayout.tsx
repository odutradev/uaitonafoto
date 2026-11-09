import { Box, Chip, Typography } from '@mui/material'
import { PhotoLibraryOutlined as PhotosIcon } from '@mui/icons-material'
import { QRCodeSVG } from 'qrcode.react'

import { brandColors } from '@theme'

import ScreenPhotoStage from '../screenPhotoStage'
import {
  contentGridStyles,
  getSideHubThumbnailSlotStyles,
  leftColumnStyles,
  sideHubPinBadgeStyles,
  sideHubPinCodeStyles,
  sideHubPinLabelStyles,
  sideHubQrCardStyles,
  sideHubQrSubtitleStyles,
  sideHubQrTitleStyles,
  sideHubRecentCardStyles,
  sideHubRecentGridStyles,
  sideHubRightStyles,
  thumbnailImgStyles
} from '../../styles'
import type { EventPhoto } from '@actions/events/types'
import type { ScreenPhotoFit } from '../../types'

const RECENT_SLOTS_COUNT = 6

interface SideHubLayoutProps {
  currentPhoto: EventPhoto | null
  isNewArrival: boolean
  photos: EventPhoto[]
  currentIndex: number
  onSelectPhoto: (index: number) => void
  guestLink: string
  pin: string | null
  showPin: boolean
  photoFit: ScreenPhotoFit
}

export const SideHubLayout = ({
  currentPhoto,
  isNewArrival,
  photos,
  currentIndex,
  onSelectPhoto,
  guestLink,
  pin,
  showPin,
  photoFit
}: SideHubLayoutProps) => {
  return (
    <Box sx={contentGridStyles}>
      {/* Coluna da esquerda: Palco da foto com altura total máxima */}
      <Box sx={leftColumnStyles}>
        <ScreenPhotoStage currentPhoto={currentPhoto} isNewArrival={isNewArrival} photoFit={photoFit} />
      </Box>

      {/* Coluna da direita: Hub com QR Code + Fotos Recentes */}
      <Box sx={sideHubRightStyles}>
        {/* Bloco QR Code */}
        <Box sx={sideHubQrCardStyles}>
          <Box
            sx={(theme) => ({
              p: 1.25,
              borderRadius: '18px',
              bgcolor: '#FFFFFF',
              border: `2px solid ${theme.palette.mode === 'dark' ? 'transparent' : brandColors.ink}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            })}
          >
            {guestLink ? (
              <QRCodeSVG
                value={guestLink}
                size={130}
                bgColor="transparent"
                fgColor={brandColors.ink}
                level="M"
              />
            ) : null}
          </Box>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography component="h2" sx={sideHubQrTitleStyles}>
              escaneia e<br />entra na foto
            </Typography>
            <Typography component="p" sx={sideHubQrSubtitleStyles}>
              sem app, sem cadastro
            </Typography>

            {pin && showPin && (
              <Box sx={sideHubPinBadgeStyles}>
                <Typography component="span" sx={sideHubPinLabelStyles}>
                  PIN
                </Typography>
                <Typography component="span" sx={sideHubPinCodeStyles}>
                  {pin}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Bloco Fotos Recentes */}
        <Box sx={sideHubRecentCardStyles}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexShrink: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhotosIcon sx={{ fontSize: 20, color: brandColors.flashYellow }} />
              <Typography variant="subtitle2" fontWeight={800}>
                Fotos Recentes
              </Typography>
            </Box>
            {photos.length > 0 && (
              <Chip
                size="small"
                label={`${photos.length} na festa`}
                sx={{
                  height: 22,
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  bgcolor: 'action.selected'
                }}
              />
            )}
          </Box>

          <Box sx={sideHubRecentGridStyles}>
            {Array.from({ length: RECENT_SLOTS_COUNT }).map((_, slotIndex) => {
              const photo = photos[slotIndex]
              const isActive = slotIndex === currentIndex

              if (!photo) {
                return (
                  <Box
                    key={`hub-slot-${slotIndex}`}
                    sx={getSideHubThumbnailSlotStyles(false)}
                  />
                )
              }

              return (
                <Box
                  key={photo.id}
                  onClick={() => onSelectPhoto(slotIndex)}
                  sx={getSideHubThumbnailSlotStyles(isActive)}
                >
                  <Box
                    component="img"
                    src={photo.url}
                    alt={`Foto ${slotIndex + 1}`}
                    sx={thumbnailImgStyles}
                  />
                </Box>
              )
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default SideHubLayout
