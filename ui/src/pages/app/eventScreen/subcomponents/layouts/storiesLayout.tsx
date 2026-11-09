import { Avatar, Box, Typography } from '@mui/material'
import { Favorite as HeartIcon } from '@mui/icons-material'

import { formatGuestTaNaFoto } from '@config/events'
import ScreenBrand from '../screenBrand'
import ScreenPhotoTile from '../screenPhotoTile'
import type { EventCustomization, EventPhoto } from '@actions/events/types'
import type { ScreenPhotoFit } from '../../types'

interface StoriesLayoutProps {
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

export const StoriesLayout = ({
  currentPhoto,
  isNewArrival,
  photos,
  currentIndex,
  onSelectPhoto,
  photoFit,
  customization
}: StoriesLayoutProps) => {
  // Foto anterior (esquerda)
  const previousIndex = photos.length > 1 ? (currentIndex - 1 + photos.length) % photos.length : -1
  const previousPhoto = previousIndex >= 0 ? photos[previousIndex] : null

  // Próxima foto (direita)
  const nextIndex = photos.length > 2 ? (currentIndex + 1) % photos.length : -1
  const nextPhoto = nextIndex >= 0 ? photos[nextIndex] : null

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: '2.5cqh',
        position: 'relative',
        zIndex: 1,
        minHeight: 0,
        boxSizing: 'border-box'
      }}
    >
      {/* Top Bar: Marca uaiToNaFoto AO VIVO na esquerda e Badge de Assessoria / Customização no topo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: '2cqh',
          width: '100%',
          flexShrink: 0
        }}
      >
        <ScreenBrand customization={undefined} />

        {customization?.enabled && customization.agencyName && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1.2cqh',
              px: '1.8cqh',
              py: '0.6cqh',
              borderRadius: '9999px',
              bgcolor: 'rgba(26, 26, 26, 0.85)',
              border: '1px solid rgba(255, 210, 31, 0.3)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
            }}
          >
            <Avatar
              src={customization.agencyLogoUrl}
              sx={{
                width: '3.4cqh',
                height: '3.4cqh',
                bgcolor: '#2563eb',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1.6cqh'
              }}
            >
              {(customization.agencyName || 'A')[0].toUpperCase()}
            </Avatar>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                sx={{
                  fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: '1.8cqh',
                  lineHeight: 1.15,
                  color: '#f6f1e4'
                }}
              >
                {customization.agencyName}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: '1.3cqh',
                  lineHeight: 1.1,
                  color: '#b9b2a0'
                }}
              >
                {customization.agencyTagline || 'Assessoria & Cerimonial'}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Palco dos Stories: 3 colunas (Anterior, Palco Central, Próxima) */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: '1.5cqh', md: '3.5cqh' },
          minHeight: 0,
          position: 'relative'
        }}
      >
        {/* Story 1 (Esquerda): Foto Anterior */}
        <Box
          onClick={previousPhoto ? () => onSelectPhoto(previousIndex) : undefined}
          sx={{
            height: '90%',
            aspectRatio: '9 / 16',
            borderRadius: '2.2cqh',
            overflow: 'hidden',
            position: 'relative',
            opacity: 0.62,
            transform: 'scale(0.92)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: previousPhoto ? 'pointer' : 'default',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
            '&:hover': previousPhoto
              ? {
                  opacity: 0.9,
                  transform: 'scale(0.95)'
                }
              : undefined
          }}
        >
          {/* Badge Topo: ← ANTERIOR */}
          <Box
            sx={{
              position: 'absolute',
              top: '1.6cqh',
              left: '1.6cqh',
              zIndex: 3,
              bgcolor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(4px)',
              color: '#d9d2bf',
              px: '1.4cqh',
              py: '0.6cqh',
              borderRadius: '1cqh',
              fontSize: '1.8cqh',
              fontWeight: 700,
              letterSpacing: '0.04em'
            }}
          >
            ← ANTERIOR
          </Box>

          <ScreenPhotoTile
            photo={previousPhoto}
            photoFit={photoFit}
            aspectRatio="9 / 16"
            sx={{ height: '100%', width: '100%', borderRadius: 0 }}
          />

          {/* Overlay Inferior */}
          {previousPhoto && (
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                pt: '6cqh',
                px: '2cqh',
                pb: '2cqh',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.92))',
                zIndex: 2
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: '2.4cqh',
                  color: '#ffffff',
                  lineHeight: 1.1
                }}
              >
                @{formatGuestTaNaFoto(previousPhoto.guestName)}
              </Typography>
              {previousPhoto.challengeTitle && (
                <Typography
                  sx={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: '1.8cqh',
                    color: '#b9b2a0',
                    lineHeight: 1.2,
                    mt: '0.4cqh',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {previousPhoto.challengeTitle}
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {/* Story 2 (Centro): Foto Atual com Moldura Amarela Brilhante */}
        <Box
          sx={{
            height: '100%',
            aspectRatio: '9 / 16',
            borderRadius: '2.5cqh',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 2,
            border: '2px solid #ffd21f',
            boxShadow: '0 0 40px rgba(255, 210, 31, 0.45), 0 16px 50px rgba(0,0,0,0.9)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Badge Topo Esquerdo: ★ NO PALCO AGORA */}
          <Box
            sx={{
              position: 'absolute',
              top: '1.6cqh',
              left: '1.6cqh',
              zIndex: 3,
              bgcolor: '#ffd21f',
              color: '#14110c',
              px: '1.6cqh',
              py: '0.6cqh',
              borderRadius: '1cqh',
              fontSize: '1.9cqh',
              fontWeight: 900,
              letterSpacing: '0.04em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6cqh',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
            }}
          >
            ★ NO PALCO AGORA
          </Box>

          {/* Badge Topo Direito: Curtidas */}
          {currentPhoto && currentPhoto.likesCount > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: '1.6cqh',
                right: '1.6cqh',
                zIndex: 3,
                bgcolor: 'rgba(20, 17, 12, 0.85)',
                backdropFilter: 'blur(6px)',
                color: '#ffffff',
                px: '1.4cqh',
                py: '0.6cqh',
                borderRadius: '1.2cqh',
                fontSize: '1.9cqh',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.6cqh',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <HeartIcon sx={{ fontSize: '2.2cqh', color: '#ef4444' }} />
              {currentPhoto.likesCount}
            </Box>
          )}

          {/* Foto Principal */}
          <ScreenPhotoTile
            photo={currentPhoto}
            photoFit={photoFit}
            isMain
            isNewArrival={isNewArrival}
            aspectRatio="9 / 16"
            sx={{ height: '100%', width: '100%', borderRadius: 0 }}
          />

          {/* Banner Inferior Amarelo Oficial */}
          {currentPhoto ? (
            <Box
              sx={{
                position: 'absolute',
                left: '1.5cqh',
                right: '1.5cqh',
                bottom: '1.5cqh',
                zIndex: 3,
                bgcolor: '#ffd21f',
                color: '#14110c',
                borderRadius: '1.8cqh',
                p: '1.8cqh',
                boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1cqh'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '1cqh', minWidth: 0 }}>
                  <Avatar
                    sx={{
                      width: '3.6cqh',
                      height: '3.6cqh',
                      bgcolor: '#14110c',
                      color: '#ffd21f',
                      fontWeight: 800,
                      fontSize: '1.8cqh'
                    }}
                  >
                    {(currentPhoto.guestName || 'U')[0].toUpperCase()}
                  </Avatar>
                  <Typography
                    sx={{
                      fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                      fontWeight: 900,
                      fontSize: '2.8cqh',
                      lineHeight: 1.1,
                      letterSpacing: '-0.02em',
                      color: '#14110c',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    @{formatGuestTaNaFoto(currentPhoto.guestName)}
                  </Typography>
                </Box>

                {currentPhoto.challengeTitle && (
                  <Box
                    sx={{
                      bgcolor: 'rgba(20, 17, 12, 0.12)',
                      border: '1px solid rgba(20, 17, 12, 0.25)',
                      px: '1.2cqh',
                      py: '0.4cqh',
                      borderRadius: '1cqh',
                      fontSize: '1.5cqh',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: '#14110c',
                      flexShrink: 0
                    }}
                  >
                    Missão
                  </Box>
                )}
              </Box>

              {currentPhoto.challengeTitle && (
                <Typography
                  sx={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: '2.2cqh',
                    fontWeight: 600,
                    lineHeight: 1.25,
                    mt: '1cqh',
                    color: '#14110c'
                  }}
                >
                  “{currentPhoto.challengeTitle}”
                </Typography>
              )}
            </Box>
          ) : null}
        </Box>

        {/* Story 3 (Direita): Próxima Foto */}
        <Box
          onClick={nextPhoto ? () => onSelectPhoto(nextIndex) : undefined}
          sx={{
            height: '90%',
            aspectRatio: '9 / 16',
            borderRadius: '2.2cqh',
            overflow: 'hidden',
            position: 'relative',
            opacity: 0.62,
            transform: 'scale(0.92)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: nextPhoto ? 'pointer' : 'default',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
            '&:hover': nextPhoto
              ? {
                  opacity: 0.9,
                  transform: 'scale(0.95)'
                }
              : undefined
          }}
        >
          {/* Badge Topo: PRÓXIMA → */}
          <Box
            sx={{
              position: 'absolute',
              top: '1.6cqh',
              right: '1.6cqh',
              zIndex: 3,
              bgcolor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(4px)',
              color: '#ffd21f',
              px: '1.4cqh',
              py: '0.6cqh',
              borderRadius: '1cqh',
              fontSize: '1.8cqh',
              fontWeight: 700,
              letterSpacing: '0.04em'
            }}
          >
            PRÓXIMA →
          </Box>

          <ScreenPhotoTile
            photo={nextPhoto}
            photoFit={photoFit}
            aspectRatio="9 / 16"
            sx={{ height: '100%', width: '100%', borderRadius: 0 }}
          />

          {/* Overlay Inferior */}
          {nextPhoto && (
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                pt: '6cqh',
                px: '2cqh',
                pb: '2cqh',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.92))',
                zIndex: 2
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: '2.4cqh',
                  color: '#ffffff',
                  lineHeight: 1.1
                }}
              >
                @{formatGuestTaNaFoto(nextPhoto.guestName)}
              </Typography>
              {nextPhoto.challengeTitle && (
                <Typography
                  sx={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: '1.8cqh',
                    color: '#b9b2a0',
                    lineHeight: 1.2,
                    mt: '0.4cqh',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {nextPhoto.challengeTitle}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default StoriesLayout

