import { useState } from 'react'
import { Box, Button, Card, Chip, IconButton, TextField, Tooltip, Typography } from '@mui/material'
import {
  CheckOutlined as CheckIcon,
  CloseOutlined as CloseIcon,
  ContentCopyOutlined as CopyIcon,
  EditOutlined as EditIcon,
  LiveTvOutlined as ScreenIcon,
  LockOutlined as LockIcon,
  OpenInNewOutlined as OpenIcon,
  RefreshOutlined as RefreshIcon
} from '@mui/icons-material'
import dayjs from 'dayjs'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'react-toastify'

import { buildGuestLink, generateRandomPin, photoVisibilityLabels, pinRotationLabels } from '@config/events'

import {
  linkFieldBoxStyles,
  linkTextStyles,
  pinActionsRowStyles,
  pinBannerStyles,
  pinCodeTextStyles,
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

const ShareLink = ({ event, onOpenScreen, onSave }: ShareLinkProps) => {
  const link = buildGuestLink(event.guestToken)
  const [isEditingPin, setIsEditingPin] = useState(false)
  const [customPin, setCustomPin] = useState(event.settings.pin)
  const [isUpdatingPin, setIsUpdatingPin] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link)
    toast.success('Link copiado!')
  }

  const handleCopyPin = async () => {
    await navigator.clipboard.writeText(event.settings.pin)
    toast.success('PIN copiado!')
  }

  const handleRegeneratePin = async () => {
    setIsUpdatingPin(true)
    const nextPin = generateRandomPin(event.settings.pin)
    await onSave({ settings: { pin: nextPin } })
    setCustomPin(nextPin)
    setIsUpdatingPin(false)
  }

  const handleSaveCustomPin = async () => {
    if (!/^\d{4}$/.test(customPin)) {
      toast.error('O PIN deve conter exatamente 4 dígitos numéricos.')
      return
    }
    setIsUpdatingPin(true)
    await onSave({ settings: { pin: customPin } })
    setIsEditingPin(false)
    setIsUpdatingPin(false)
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

        {event.settings.pinEnabled && (
          <Box sx={pinBannerStyles}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <LockIcon fontSize="small" color="primary" />
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  PIN DE ACESSO DOS CONVIDADOS
                </Typography>
                <Chip
                  size="small"
                  variant="outlined"
                  label={
                    event.settings.pinRotate
                      ? pinRotationLabels[event.settings.pinRotationMinutes]
                      : 'PIN fixo'
                  }
                />
              </Box>

              {isEditingPin ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <TextField
                    size="small"
                    value={customPin}
                    onChange={(e) => setCustomPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="0000"
                    slotProps={{
                      htmlInput: {
                        inputMode: 'numeric',
                        maxLength: 4,
                        style: { width: 84, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.2em' }
                      }
                    }}
                  />
                  <IconButton
                    size="small"
                    color="primary"
                    disabled={isUpdatingPin}
                    onClick={handleSaveCustomPin}
                    aria-label="Salvar novo PIN"
                  >
                    <CheckIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    disabled={isUpdatingPin}
                    onClick={() => {
                      setCustomPin(event.settings.pin)
                      setIsEditingPin(false)
                    }}
                    aria-label="Cancelar edição do PIN"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <Typography sx={pinCodeTextStyles}>{event.settings.pin}</Typography>
              )}
            </Box>

            <Box sx={pinActionsRowStyles}>
              <Tooltip title="Copiar PIN">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<CopyIcon fontSize="small" />}
                  onClick={handleCopyPin}
                  disabled={isUpdatingPin}
                >
                  Copiar PIN
                </Button>
              </Tooltip>
              <Button
                size="small"
                variant="outlined"
                startIcon={<EditIcon fontSize="small" />}
                onClick={() => {
                  setCustomPin(event.settings.pin)
                  setIsEditingPin(true)
                }}
                disabled={isUpdatingPin || isEditingPin}
              >
                Alterar PIN
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<RefreshIcon fontSize="small" />}
                onClick={handleRegeneratePin}
                disabled={isUpdatingPin}
              >
                Novo PIN
              </Button>
            </Box>
          </Box>
        )}

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
