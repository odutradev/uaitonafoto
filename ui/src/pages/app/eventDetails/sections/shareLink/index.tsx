import { Box, Button, Paper, Typography } from '@mui/material'
import {
  ContentCopyOutlined as CopyIcon,
  LiveTvOutlined as ScreenIcon,
  OpenInNewOutlined as OpenIcon
} from '@mui/icons-material'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'react-toastify'

import { buildGuestLink } from '@config/events'

import {
  linkTextStyles,
  qrWrapperStyles,
  shareButtonStyles,
  shareButtonsStyles,
  shareInfoStyles,
  shareLinkContentStyles
} from './styles'
import type { ShareLinkProps } from './types'

const ShareLink = ({ event, onOpenScreen }: ShareLinkProps) => {
  const link = buildGuestLink(event.guestToken)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link)
    toast.success('Link copiado!')
  }

  return (
    <Paper variant="outlined" sx={shareLinkContentStyles}>
      <Box sx={qrWrapperStyles}>
        <QRCodeSVG value={link} size={160} />
      </Box>

      <Box sx={shareInfoStyles}>
        <Typography variant="h6" component="h2">
          Link dos convidados
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Compartilhe o link ou o QR Code. Os convidados entram sem criar conta.
        </Typography>
        <Typography variant="body2" sx={linkTextStyles}>
          {link}
        </Typography>

        <Box sx={shareButtonsStyles}>
          <Button variant="contained" startIcon={<CopyIcon />} onClick={handleCopy} sx={shareButtonStyles}>
            Copiar link
          </Button>
          <Button
            variant="outlined"
            startIcon={<OpenIcon />}
            component="a"
            href={link}
            target="_blank"
            rel="noreferrer"
            sx={shareButtonStyles}
          >
            Ver como convidado
          </Button>
          <Button variant="outlined" startIcon={<ScreenIcon />} onClick={onOpenScreen} sx={shareButtonStyles}>
            Abrir telão
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default ShareLink
