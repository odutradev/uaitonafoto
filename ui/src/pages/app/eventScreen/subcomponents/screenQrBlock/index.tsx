import { Box, Typography } from '@mui/material'
import { QRCodeSVG } from 'qrcode.react'
import { brandColors } from '@theme'
import type { ReactNode } from 'react'

export type ScreenQrVariant = 'horizontal' | 'stack' | 'column-fit' | 'mosaic'

interface ScreenQrBlockProps {
  guestLink: string
  pin: string | null
  showPin: boolean
  variant?: ScreenQrVariant
  headerContent?: ReactNode
}

export const ScreenQrBlock = ({
  guestLink,
  pin,
  showPin,
  variant = 'horizontal',
  headerContent
}: ScreenQrBlockProps) => {
  const isStack = variant === 'stack' || variant === 'column-fit'
  const isColumnFit = variant === 'column-fit'
  const isMosaic = variant === 'mosaic'

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        gap: isStack ? '1.2cqh' : '2cqh',
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
        p: '2cqh',
        minHeight: 0,
        minWidth: 0,
        flexDirection: isStack ? 'column' : 'row',
        justifyContent: isColumnFit ? 'center' : 'flex-start',
        textAlign: isStack ? 'center' : 'left',
        flex: isColumnFit ? 1 : 'none',
        gridColumn: isMosaic ? 'span 3' : 'auto'
      })}
    >
      {/* Bloco branco do QRCode */}
      <Box
        sx={(theme) => ({
          bgcolor: '#ffffff',
          borderRadius: '1.2cqh',
          border: `1px solid ${
            theme.palette.mode === 'dark' ? 'transparent' : brandColors.lightBorder
          }`,
          p: '0.9cqh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          aspectRatio: '1 / 1',
          ...(isColumnFit
            ? { width: '58%', height: 'auto', maxHeight: 'none' }
            : isStack
              ? { width: '46%', height: 'auto', maxHeight: 'none' }
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
            fontSize: isStack ? '2.8cqh' : isMosaic ? '3.6cqh' : '3.3cqh',
            lineHeight: 1.05,
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
            fontSize: isStack ? '1.8cqh' : '2cqh',
            mt: '0.6cqh'
          })}
        >
          sem app, sem cadastro
        </Typography>

        {pin && showPin && (
          <Box
            component="span"
            sx={(theme) => ({
              display: 'inline-block',
              mt: '1.2cqh',
              fontSize: '2.2cqh',
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
              px: '1.4cqh',
              py: '0.6cqh',
              borderRadius: '1cqh',
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
