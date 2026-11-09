import { Box, Typography } from '@mui/material'
import { QRCodeSVG } from 'qrcode.react'

import { brandColors } from '@theme'

import {
  qrFrameStyles,
  qrPinBadgeStyles,
  qrPinCodeStyles,
  qrPinLabelStyles,
  qrSubtitleStyles,
  qrTextContainerStyles,
  qrTitleStyles,
  rightCardStyles
} from '../../styles'
import type { SxProps, Theme } from '@mui/material'

interface ScreenQrCardProps {
  guestLink: string
  pin: string | null
  showPin: boolean
  compact?: boolean
  sx?: SxProps<Theme>
}

export const ScreenQrCard = ({
  guestLink,
  pin,
  showPin,
  compact = false,
  sx
}: ScreenQrCardProps) => {
  return (
    <Box sx={[rightCardStyles, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box sx={qrFrameStyles}>
        {guestLink ? (
          <QRCodeSVG
            value={guestLink}
            size={compact ? 160 : 210}
            bgColor="transparent"
            fgColor={brandColors.ink}
            level="M"
          />
        ) : null}
      </Box>

      <Box sx={qrTextContainerStyles}>
        <Typography component="h2" sx={qrTitleStyles}>
          escaneia e<br />
          entra na foto
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
    </Box>
  )
}

export default ScreenQrCard

