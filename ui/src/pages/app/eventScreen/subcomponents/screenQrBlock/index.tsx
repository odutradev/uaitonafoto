import { Box, Typography } from '@mui/material'
import { QRCodeSVG } from 'qrcode.react'
import { brandColors } from '@theme'
import type { ReactNode } from 'react'
import type { SxProps, Theme } from '@mui/material'

export type ScreenQrVariant = 'horizontal' | 'stack' | 'column-fit' | 'mosaic' | 'lateral'

interface ScreenQrBlockProps {
  guestLink: string
  pin: string | null
  showPin: boolean
  variant?: ScreenQrVariant
  headerContent?: ReactNode
  sx?: SxProps<Theme>
}

export const ScreenQrBlock = ({
  guestLink,
  pin,
  showPin,
  variant = 'horizontal',
  headerContent,
  sx
}: ScreenQrBlockProps) => {
  const isLateral = variant === 'lateral'
  const isStack = variant === 'stack' || variant === 'column-fit' || isLateral
  const isMosaic = variant === 'mosaic'

  return (
    <Box
      sx={[
        (theme) => ({
          display: 'flex',
          alignItems: 'center',
          gap: isLateral ? '0.8cqh' : isStack ? '1.2cqh' : '2cqh',
          bgcolor:
            theme.palette.mode === 'dark' ? brandColors.darkPaper : '#FFFFFF',
          border: `1px solid ${
            theme.palette.mode === 'dark'
              ? brandColors.darkBorder
              : brandColors.lightBorder
          }`,
          boxShadow:
            theme.palette.mode === 'dark'
              ? 'none'
              : '0 4px 24px rgba(0, 0, 0, 0.06)',
          borderRadius: '2cqh',
          p: isLateral ? '1.4cqh 1.2cqh' : '2cqh',
          minHeight: 0,
          minWidth: 0,
          height: '100%',
          maxHeight: '100%',
          overflow: 'hidden',
          boxSizing: 'border-box',
          flexDirection: isStack ? 'column' : 'row',
          justifyContent: 'center',
          textAlign: isStack ? 'center' : 'left',
          flex: isLateral || variant === 'column-fit' ? 1 : 'none',
          gridColumn: isMosaic ? 'span 3' : 'auto'
        }),
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
    >
      {/* Bloco branco do QRCode */}
      <Box
        sx={(theme) => ({
          bgcolor: '#ffffff',
          borderRadius: '1.2cqh',
          border: `1px solid ${
            theme.palette.mode === 'dark' ? 'transparent' : brandColors.lightBorder
          }`,
          p: isLateral ? '0.7cqh' : '0.9cqh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          aspectRatio: '1 / 1',
          boxShadow: isLateral ? '0 4px 16px rgba(0,0,0,0.18)' : 'none',
          ...(isLateral
            ? { height: '14cqh', width: '14cqh', maxHeight: '14cqh' }
            : variant === 'column-fit'
              ? { width: '52%', height: 'auto', maxHeight: 'none' }
              : isStack
                ? { width: '52%', maxWidth: '34cqh', height: 'auto', maxHeight: '34cqh' }
                : isMosaic
                  ? { height: '100%', maxHeight: '30cqh', width: 'auto' }
                  : { height: '100%', maxHeight: '24cqh', width: 'auto' })
        })}
      >
        {guestLink ? (
          <QRCodeSVG
            value={guestLink}
            size={256}
            style={{ width: '100%', height: '100%', display: 'block' }}
            bgColor="transparent"
            fgColor="#111111"
            level="M"
          />
        ) : (
          <Box sx={{ width: '100%', height: '100%', bgcolor: '#e5e1d8' }} />
        )}
      </Box>

      {/* Textos explicativos e PIN */}
      <Box sx={{ minWidth: 0, width: isStack ? '100%' : 'auto' }}>
        {headerContent}
        <Typography
          component="b"
          sx={(theme) => ({
            display: 'block',
            fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
            fontSize: isLateral
              ? '2cqh'
              : isStack
                ? '2.6cqh'
                : isMosaic
                  ? '3.6cqh'
                  : '3.3cqh',
            lineHeight: 1.15,
            fontWeight: 800,
            color:
              theme.palette.mode === 'dark'
                ? brandColors.darkTextPrimary
                : brandColors.ink,
            letterSpacing: '-0.02em'
          })}
        >
          escaneia e entra na foto
        </Typography>
        <Typography
          component="small"
          sx={(theme) => ({
            display: 'block',
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color:
              theme.palette.mode === 'dark'
                ? brandColors.darkTextSecondary
                : brandColors.textGray,
            fontSize: isLateral ? '1.35cqh' : isStack ? '1.7cqh' : '2cqh',
            mt: '0.3cqh',
            lineHeight: 1.2
          })}
        >
          sem app, sem cadastro
        </Typography>

        {pin && showPin && (
          <Box
            component="span"
            sx={(theme) => ({
              display: 'inline-block',
              mt: isLateral ? '0.6cqh' : '1.2cqh',
              fontSize: isLateral ? '1.7cqh' : '2.2cqh',
              fontWeight: 800,
              bgcolor:
                theme.palette.mode === 'dark'
                  ? brandColors.darkBg
                  : brandColors.sand,
              color:
                theme.palette.mode === 'dark'
                  ? brandColors.flashYellow
                  : brandColors.ink,
              border: `1px solid ${
                theme.palette.mode === 'dark'
                  ? brandColors.darkBorder
                  : brandColors.sandDark
              }`,
              px: isLateral ? '1.2cqh' : '1.4cqh',
              py: isLateral ? '0.3cqh' : '0.6cqh',
              borderRadius: '0.8cqh',
              letterSpacing: '0.12em',
              fontFamily: 'monospace'
            })}
          >
            PIN {pin}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ScreenQrBlock
