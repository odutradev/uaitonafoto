import { Box, Chip, Typography } from '@mui/material'
import {
  DynamicFeedOutlined as FeedIcon,
  Favorite as LikeIcon
} from '@mui/icons-material'
import { QRCodeSVG } from 'qrcode.react'

import { formatGuestTaNaFoto } from '@config/events'
import { brandColors } from '@theme'

import ScreenPhotoStage from '../screenPhotoStage'
import {
  contentGridStyles,
  qrFrameStyles,
  qrPinBadgeStyles,
  qrPinCodeStyles,
  qrPinLabelStyles,
  qrSubtitleStyles,
  qrTextContainerStyles,
  socialFeedCardStyles,
  socialFeedCenterStyles,
  socialFeedLeftColumnStyles,
  socialFeedListStyles,
  socialFeedQrTitleStyles,
  socialFeedRightColumnStyles
} from '../../styles'
import type { EventPhoto } from '@actions/events/types'
import type { ScreenPhotoFit } from '../../types'

const FEED_MAX_ITEMS = 5

interface SocialFeedLayoutProps {
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

export const SocialFeedLayout = ({
  currentPhoto,
  isNewArrival,
  photos,
  currentIndex,
  onSelectPhoto,
  guestLink,
  pin,
  showPin,
  photoFit
}: SocialFeedLayoutProps) => {
  return (
    <Box sx={contentGridStyles}>
      {/* Coluna 1: Participação (QR Code & PIN) */}
      <Box sx={socialFeedLeftColumnStyles}>
        <Box sx={qrFrameStyles}>
          {guestLink ? (
            <QRCodeSVG
              value={guestLink}
              size={180}
              bgColor="transparent"
              fgColor={brandColors.ink}
              level="M"
            />
          ) : null}
        </Box>

        <Box sx={qrTextContainerStyles}>
          <Typography component="h2" sx={socialFeedQrTitleStyles}>
            escaneia e<br />entra na foto
          </Typography>
          <Typography component="p" sx={qrSubtitleStyles}>
            sem app, sem cadastro
          </Typography>

          {pin && showPin && (
            <Box sx={qrPinBadgeStyles}>
              <Typography component="span" sx={qrPinLabelStyles}>
                PIN de acesso
              </Typography>
              <Typography component="span" sx={qrPinCodeStyles}>
                {pin}
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            width: '100%',
            p: 1.5,
            borderRadius: '16px',
            bgcolor: 'action.selected',
            textAlign: 'center'
          }}
        >
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            {photos.length === 0
              ? 'Aguardando primeira foto'
              : `${photos.length} ${photos.length === 1 ? 'foto enviada' : 'fotos enviadas'}`}
          </Typography>
        </Box>
      </Box>

      {/* Coluna 2: Palco Central da Foto */}
      <Box sx={socialFeedCenterStyles}>
        <ScreenPhotoStage currentPhoto={currentPhoto} isNewArrival={isNewArrival} photoFit={photoFit} />
      </Box>

      {/* Coluna 3: Feed ao Vivo */}
      <Box sx={socialFeedRightColumnStyles}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FeedIcon sx={{ fontSize: 22, color: brandColors.flashYellow }} />
            <Typography variant="subtitle2" fontWeight={800}>
              Feed da Festa
            </Typography>
          </Box>
          <Chip
            size="small"
            label="Ao vivo"
            color="success"
            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800 }}
          />
        </Box>

        <Box sx={socialFeedListStyles}>
          {photos.slice(0, FEED_MAX_ITEMS).map((photo, slotIndex) => {
            const isActive = slotIndex === currentIndex
            return (
              <Box
                key={photo.id}
                onClick={() => onSelectPhoto(slotIndex)}
                sx={socialFeedCardStyles(isActive)}
              >
                <Box
                  component="img"
                  src={photo.url}
                  alt={`Foto de ${photo.guestName}`}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '12px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="body2" fontWeight={800} noWrap>
                    {formatGuestTaNaFoto(photo.guestName)}
                  </Typography>
                  {photo.challengeTitle ? (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }} noWrap>
                      Missão: {photo.challengeTitle}
                    </Typography>
                  ) : (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }} noWrap>
                      Foto da festa
                    </Typography>
                  )}
                  {photo.likesCount > 0 && (
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                      <LikeIcon sx={{ fontSize: 13, color: '#ef4444' }} />
                      <Typography variant="caption" fontWeight={700}>
                        {photo.likesCount}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            )
          })}

          {photos.length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
              <Typography variant="body2">As novas fotos aparecerão aqui no feed.</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default SocialFeedLayout
