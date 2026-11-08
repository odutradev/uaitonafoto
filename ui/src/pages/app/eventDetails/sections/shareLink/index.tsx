import { useState } from 'react'
import { Box, Button, Card, Chip, IconButton, TextField, Tooltip, Typography } from '@mui/material'
import {
  AddOutlined as AddIcon,
  CheckOutlined as CheckIcon,
  CloseOutlined as CloseIcon,
  ContentCopyOutlined as CopyIcon,
  DeleteOutline as DeleteIcon,
  EditOutlined as EditIcon,
  LiveTvOutlined as ScreenIcon,
  LockOutlined as LockIcon,
  OpenInNewOutlined as OpenIcon,
  RefreshOutlined as RefreshIcon
} from '@mui/icons-material'
import dayjs from 'dayjs'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'react-toastify'

import Modal from '@components/modal'
import {
  buildGuestLink,
  buildScreenLink,
  generateRandomPin,
  MAX_EVENT_SCREENS,
  photoVisibilityLabels,
  pinRotationLabels
} from '@config/events'

import {
  linkFieldBoxStyles,
  linkTextStyles,
  pinActionsRowStyles,
  pinBannerStyles,
  pinCodeTextStyles,
  qrBoxStyles,
  screenHeaderRowStyles,
  screenSlotCardStyles,
  screenSlotFooterStyles,
  screenSlotHeaderStyles,
  screenSlotsGridStyles,
  shareActionsRowStyles,
  shareButtonStyles,
  shareCardStyles,
  shareInfoColumnStyles,
  shareMainRowStyles,
  shareSectionStackStyles,
  summaryGridStyles,
  summaryItemStyles
} from './styles'
import type { EventScreenSlot } from '@actions/events/types'
import type { ShareLinkProps } from './types'

const SCREEN_ONLINE_TIMEOUT_MS = 30_000

const getScreenStatusBadge = (slot: EventScreenSlot) => {
  if (!slot.activatedAt) {
    return {
      label: 'Aguardando ativação',
      color: 'default' as const,
      variant: 'outlined' as const,
      detail: 'Aguardando inserção do PIN no telão'
    }
  }

  const lastSeenMs = slot.lastSeenAt ? Date.parse(slot.lastSeenAt) : NaN
  const isOnline = !Number.isNaN(lastSeenMs) && Date.now() - lastSeenMs < SCREEN_ONLINE_TIMEOUT_MS

  if (isOnline) {
    return {
      label: 'Online',
      color: 'success' as const,
      variant: 'filled' as const,
      detail: `Conectado em tempo real · Sinal às ${dayjs(slot.lastSeenAt).format('HH:mm:ss')}`
    }
  }

  return {
    label: 'Offline',
    color: 'warning' as const,
    variant: 'outlined' as const,
    detail: slot.lastSeenAt
      ? `Último sinal em ${dayjs(slot.lastSeenAt).format('DD/MM [às] HH:mm')}`
      : `Ativado em ${dayjs(slot.activatedAt).format('DD/MM [às] HH:mm')}`
  }
}

const ShareLink = ({
  event,
  onOpenScreen,
  onSave,
  onAddScreen,
  onDisconnectScreen,
  onRefresh
}: ShareLinkProps) => {
  const link = buildGuestLink(event.guestToken)
  const screenLink = buildScreenLink(event.id)
  const screens = event.screens ?? []
  const isScreenLimitReached = screens.length >= MAX_EVENT_SCREENS
  const [isEditingPin, setIsEditingPin] = useState(false)
  const [customPin, setCustomPin] = useState(event.settings.pin)
  const [isUpdatingPin, setIsUpdatingPin] = useState(false)
  const [isManagingScreen, setIsManagingScreen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [screenNameInput, setScreenNameInput] = useState('')

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link)
    toast.success('Link copiado!')
  }

  const handleCopyScreenLink = async () => {
    await navigator.clipboard.writeText(screenLink)
    toast.success('Link do telão copiado!')
  }

  const handleCopyScreenPin = async (pin: string) => {
    await navigator.clipboard.writeText(pin)
    toast.success('PIN do telão copiado!')
  }

  const handleOpenAddModal = () => {
    setScreenNameInput('')
    setIsAddModalOpen(true)
  }

  const handleConfirmAddScreen = async () => {
    setIsManagingScreen(true)
    await onAddScreen(screenNameInput.trim() || undefined)
    setIsManagingScreen(false)
    setIsAddModalOpen(false)
  }

  const handleDisconnectScreen = async (screenId: string) => {
    setIsManagingScreen(true)
    await onDisconnectScreen(screenId)
    setIsManagingScreen(false)
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

      <Card elevation={0} sx={shareCardStyles}>
        <Box sx={screenHeaderRowStyles}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <ScreenIcon fontSize="small" color="primary" />
              <Typography variant="h6" component="h2">
                Telões do evento
              </Typography>
              <Chip
                size="small"
                variant="outlined"
                color={isScreenLimitReached ? 'warning' : 'default'}
                label={`${screens.length}/${MAX_EVENT_SCREENS} configurados`}
              />
              {onRefresh && (
                <Tooltip title="Atualizar status">
                  <IconButton
                    size="small"
                    onClick={() => onRefresh()}
                    aria-label="Atualizar status dos telões"
                  >
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              A URL do telão é pública, mas exige ativação por PIN. Gere até {MAX_EVENT_SCREENS} PINs e insira no navegador de cada telão para liberar o acesso.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon fontSize="small" />}
            onClick={handleOpenAddModal}
            disabled={isManagingScreen || isScreenLimitReached}
            sx={shareButtonStyles}
          >
            Gerar PIN de telão
          </Button>
        </Box>

        <Box sx={linkFieldBoxStyles}>
          <Typography variant="body2" sx={linkTextStyles} title={screenLink}>
            {screenLink}
          </Typography>
          <Tooltip title="Copiar link do telão">
            <IconButton size="small" onClick={handleCopyScreenLink} aria-label="Copiar link do telão">
              <CopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {screens.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Nenhum telão configurado ainda. Clique em &ldquo;Gerar PIN de telão&rdquo; para liberar um dispositivo.
          </Typography>
        ) : (
          <Box sx={screenSlotsGridStyles}>
            {screens.map((slot, index) => {
              const badge = getScreenStatusBadge(slot)

              return (
                <Box key={slot.id} sx={screenSlotCardStyles}>
                  <Box sx={screenSlotHeaderStyles}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <Typography variant="subtitle2" fontWeight={700} noWrap>
                        {slot.name || `Telão ${index + 1}`}
                      </Typography>
                      {slot.name && (
                        <Typography variant="caption" color="text.secondary">
                          Telão {index + 1}
                        </Typography>
                      )}
                    </Box>
                    <Chip
                      size="small"
                      color={badge.color}
                      variant={badge.variant}
                      label={badge.label}
                    />
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>
                      PIN DE ATIVAÇÃO
                    </Typography>
                    <Typography sx={pinCodeTextStyles}>{slot.pin}</Typography>
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    {badge.detail}
                  </Typography>

                  <Box sx={screenSlotFooterStyles}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<CopyIcon fontSize="small" />}
                      onClick={() => handleCopyScreenPin(slot.pin)}
                      disabled={isManagingScreen}
                    >
                      Copiar PIN
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      startIcon={<DeleteIcon fontSize="small" />}
                      onClick={() => handleDisconnectScreen(slot.id)}
                      disabled={isManagingScreen}
                    >
                      Desconectar
                    </Button>
                  </Box>
                </Box>
              )
            })}
          </Box>
        )}
      </Card>

      <Modal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Gerar PIN de telão"
        description="Defina opcionalmente um nome ou local para identificar este dispositivo (ex: Telão Entrada, Palco Principal)."
        primaryAction={{
          label: 'Gerar PIN',
          onClick: handleConfirmAddScreen,
          loading: isManagingScreen
        }}
        secondaryAction={{
          label: 'Cancelar',
          onClick: () => setIsAddModalOpen(false),
          disabled: isManagingScreen
        }}
      >
        <TextField
          label="Identificação do telão (opcional)"
          placeholder="Ex: Telão Entrada"
          value={screenNameInput}
          onChange={(e) => setScreenNameInput(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 60 } }}
          fullWidth
          autoFocus
          disabled={isManagingScreen}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleConfirmAddScreen()
            }
          }}
        />
      </Modal>
    </Box>
  )
}

export default ShareLink
