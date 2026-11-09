import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material'
import {
  ContentCopyOutlined as CopyIcon,
  LockOpenOutlined as LockOpenIcon,
  LockOutlined as LockIcon,
  OpenInNewOutlined as OpenIcon,
  SettingsOutlined as SettingsIcon
} from '@mui/icons-material'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'react-toastify'

import { buildGuestLink, pinRotationLabels } from '@config/events'

import { useState } from 'react'

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
  shareSectionStackStyles
} from './styles'
import type { ShareLinkProps } from './types'

const ShareLink = ({ event, onGoToSettings, onUnlockLockouts }: ShareLinkProps) => {
  const link = buildGuestLink(event.guestToken)
  const [isUnlocking, setIsUnlocking] = useState(false)

  const handleUnlock = async () => {
    if (!onUnlockLockouts) return
    setIsUnlocking(true)
    try {
      await onUnlockLockouts()
    } finally {
      setIsUnlocking(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link)
    toast.success('Link do convidado copiado!')
  }

  const handleCopyPin = async () => {
    await navigator.clipboard.writeText(event.settings.pin)
    toast.success('PIN dos convidados copiado!')
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
                Compartilhe este link ou QR Code com os convidados do evento para que eles enviem fotos sem precisar baixar app.
              </Typography>
            </Box>

            <Box sx={linkFieldBoxStyles}>
              <Typography variant="body2" sx={linkTextStyles} title={link}>
                {link}
              </Typography>
              <Tooltip title="Copiar link">
                <IconButton size="small" onClick={handleCopy} aria-label="Copiar link">
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={shareActionsRowStyles}>
              <Button
                variant="contained"
                startIcon={<CopyIcon fontSize="small" />}
                onClick={handleCopy}
                sx={shareButtonStyles}
              >
                Copiar link do convidado
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
                      ? `Rotativo (${pinRotationLabels[event.settings.pinRotationMinutes]})`
                      : 'PIN fixo'
                  }
                />
              </Box>

              <Typography sx={pinCodeTextStyles}>{event.settings.pin}</Typography>

              <Typography variant="caption" color="text.secondary">
                Os convidados devem inserir este PIN de 4 dígitos para enviar fotos.
              </Typography>
            </Box>

            <Box sx={pinActionsRowStyles}>
              {onUnlockLockouts && (
                <Tooltip title="Desbloqueia convidados bloqueados por tentativas incorretas de PIN">
                  <span>
                    <Button
                      size="small"
                      variant="outlined"
                      color="inherit"
                      startIcon={
                        isUnlocking ? (
                          <CircularProgress size={14} color="inherit" />
                        ) : (
                          <LockOpenIcon fontSize="small" />
                        )
                      }
                      onClick={handleUnlock}
                      disabled={isUnlocking}
                    >
                      Desbloquear acessos
                    </Button>
                  </span>
                </Tooltip>
              )}
              <Button
                size="small"
                variant="outlined"
                startIcon={<CopyIcon fontSize="small" />}
                onClick={handleCopyPin}
              >
                Copiar PIN
              </Button>
              {onGoToSettings && (
                <Button
                  size="small"
                  variant="text"
                  startIcon={<SettingsIcon fontSize="small" />}
                  onClick={onGoToSettings}
                >
                  Configurar PIN
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Card>
    </Box>
  )
}

export default ShareLink
