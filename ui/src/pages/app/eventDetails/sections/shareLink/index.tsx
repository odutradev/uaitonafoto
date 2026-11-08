import { Box, Button, Card, IconButton, Tooltip, Typography } from '@mui/material'
import {
  ContentCopyOutlined as CopyIcon,
  LiveTvOutlined as ScreenIcon,
  OpenInNewOutlined as OpenIcon
} from '@mui/icons-material'
import dayjs from 'dayjs'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'react-toastify'

import { buildGuestLink, photoVisibilityLabels } from '@config/events'

import {
  linkFieldBoxStyles,
  linkTextStyles,
  qrBoxStyles,
  shareActionsRowStyles,
  shareButtonStyles,
  shareCardStyles,
  shareInfoColumnStyles,
  shareMainRowStyles,
  shareSectionStackStyles,
  summaryGridStyles,
  summaryItemStyles
} from './styles'
import type { ShareLinkProps } from './types'

const ShareLink = ({ event, onOpenScreen }: ShareLinkProps) => {
  const link = buildGuestLink(event.guestToken)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link)
    toast.success('Link copiado!')
  }

  return (
    <Box sx={shareSectionStackStyles}>
      <Card elevation={0} sx={shareCardStyles}>
        <Box sx={shareMainRowStyles}>
          <Box sx={qrBoxStyles}>
            <QRCodeSVG value={link} size={148} />
            <Typography variant="caption" sx={{ color: '#5E584C', fontWeight: 700 }}>
              Escaneie para enviar fotos
            </Typography>
          </Box>

          <Box sx={shareInfoColumnStyles}>
            <Box>
              <Typography variant="h6" component="h2">
                Acesso dos convidados
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Compartilhe o link direto ou imprima o QR Code nas mesas. Os convidados enviam fotos sem instalar nada e sem criar conta.
              </Typography>
            </Box>

            <Box sx={linkFieldBoxStyles}>
              <Typography variant="body2" sx={linkTextStyles} title={link}>
                {link}
              </Typography>
              <Tooltip title="Copiar link">
                <IconButton size="small" onClick={handleCopy} aria-label="Copiar link dos convidados">
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={shareActionsRowStyles}>
              <Button variant="contained" startIcon={<CopyIcon fontSize="small" />} onClick={handleCopy} sx={shareButtonStyles}>
                Copiar link
              </Button>
              <Button
                variant="outlined"
                startIcon={<OpenIcon fontSize="small" />}
                component="a"
                href={link}
                target="_blank"
                rel="noreferrer"
                sx={shareButtonStyles}
              >
                Ver como convidado
              </Button>
              <Button variant="outlined" startIcon={<ScreenIcon fontSize="small" />} onClick={onOpenScreen} sx={shareButtonStyles}>
                Abrir telão
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={summaryGridStyles}>
          <Box sx={summaryItemStyles}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              LIMITE POR CONVIDADO
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              Até {event.settings.maxPhotosPerGuest} {event.settings.maxPhotosPerGuest === 1 ? 'foto' : 'fotos'}
            </Typography>
          </Box>

          <Box sx={summaryItemStyles}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              VISIBILIDADE NO MURAL
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {photoVisibilityLabels[event.settings.photoVisibility]}
            </Typography>
          </Box>

          <Box sx={summaryItemStyles}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              ENVIO DE FOTOS ATÉ
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {dayjs(event.uploadsCloseAt).format('DD/MM/YYYY [às] HH:mm')}
            </Typography>
          </Box>

          <Box sx={summaryItemStyles}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              EXPIRAÇÃO DA GALERIA
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {dayjs(event.galleryExpiresAt).format('DD/MM/YYYY')}
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  )
}

export default ShareLink
