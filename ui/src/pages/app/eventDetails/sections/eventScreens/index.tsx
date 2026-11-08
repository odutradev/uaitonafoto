import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  IconButton,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import {
  AddOutlined as AddIcon,
  ContentCopyOutlined as CopyIcon,
  DeleteOutline as DeleteIcon,
  LiveTvOutlined as ScreenIcon,
  OpenInNewOutlined as OpenIcon,
  RefreshOutlined as RefreshIcon
} from '@mui/icons-material'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

import Modal from '@components/modal'
import { buildScreenLink, MAX_EVENT_SCREENS } from '@config/events'

import {
  linkFieldBoxStyles,
  linkTextStyles,
  pinCodeTextStyles,
  screenActionButtonStyles,
  screenCardStyles,
  screenHeaderActionsStyles,
  screenHeaderRowStyles,
  screenSectionStackStyles,
  screenSlotCardStyles,
  screenSlotFooterStyles,
  screenSlotHeaderStyles,
  screenSlotsGridStyles
} from './styles'
import type { EventScreenSlot } from '@actions/events/types'
import type { EventScreensProps } from './types'

const SCREEN_ONLINE_TIMEOUT_MS = 30_000

const getScreenStatusBadge = (slot: EventScreenSlot) => {
  if (!slot.activatedAt) {
    return {
      label: 'Aguardando ativação',
      color: 'default' as const,
      variant: 'outlined' as const,
      detail: 'Aguardando inserção do PIN no navegador do telão'
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

const EventScreens = ({
  event,
  onOpenScreen,
  onAddScreen,
  onDisconnectScreen,
  onRefresh
}: EventScreensProps) => {
  const screenLink = buildScreenLink(event.id)
  const screens = event.screens ?? []
  const isScreenLimitReached = screens.length >= MAX_EVENT_SCREENS

  const [isManagingScreen, setIsManagingScreen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [screenNameInput, setScreenNameInput] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleCopyScreenLink = async () => {
    await navigator.clipboard.writeText(screenLink)
    toast.success('Link do telão copiado!')
  }

  const handleCopyScreenPin = async (pin: string) => {
    await navigator.clipboard.writeText(pin)
    toast.success('PIN do telão copiado!')
  }

  const handleRefresh = async () => {
    if (!onRefresh) return
    setIsRefreshing(true)
    try {
      await onRefresh()
      toast.success('Status dos telões atualizado!')
    } finally {
      setIsRefreshing(false)
    }
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

  return (
    <Box sx={screenSectionStackStyles}>
      <Card elevation={0} sx={screenCardStyles}>
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
              {screens.some((slot) => !slot.activatedAt) && (
                <Chip size="small" variant="outlined" color="info" label="Sincronizando em tempo real" />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              A URL do telão é pública, mas exige ativação por PIN. Gere até {MAX_EVENT_SCREENS} PINs e insira no navegador de cada telão para liberar o acesso.
            </Typography>
          </Box>

          <Box sx={screenHeaderActionsStyles}>
            {onRefresh && (
              <Button
                variant="outlined"
                startIcon={
                  isRefreshing ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <RefreshIcon fontSize="small" />
                  )
                }
                onClick={handleRefresh}
                disabled={isRefreshing}
                sx={screenActionButtonStyles}
              >
                Atualizar status
              </Button>
            )}

            <Button
              variant="outlined"
              startIcon={<OpenIcon fontSize="small" />}
              onClick={onOpenScreen}
              sx={screenActionButtonStyles}
            >
              Abrir telão
            </Button>

            <Button
              variant="contained"
              startIcon={<AddIcon fontSize="small" />}
              onClick={handleOpenAddModal}
              disabled={isManagingScreen || isScreenLimitReached}
              sx={screenActionButtonStyles}
            >
              Gerar PIN de telão
            </Button>
          </Box>
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

export default EventScreens

