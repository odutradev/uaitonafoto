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
  CheckCircleOutline as CheckCircleIcon,
  ContentCopyOutlined as CopyIcon,
  DeleteOutline as DeleteIcon,
  EditOutlined as EditIcon,
  LockOpenOutlined as LockOpenIcon,
  LockOutlined as LockIcon,
  OpenInNewOutlined as OpenIcon,
  PowerOffOutlined as PowerOffIcon,
  RefreshOutlined as RefreshIcon
} from '@mui/icons-material'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

import Modal from '@components/modal'
import { MAX_EVENT_SCREENS } from '@assets/data/events'
import { buildScreenLink, getEventLimits } from '@utils/functions/events'

import {
  compactIconButtonStyles,
  countBadgeStyles,
  linkFieldBoxStyles,
  linkIconActionsStyles,
  linkTextStyles,
  pinCodeTextStyles,
  screenActionButtonStyles,
  screenCardStyles,
  screenHeaderActionsStyles,
  screenHeaderRowStyles,
  screenSectionStackStyles,
  screenSlotCardStyles,
  screenSlotHeaderStyles,
  screenSlotsGridStyles,
  statusPillStyles
} from './styles'
import type { EventScreenHistoryEntry, EventScreenSlot } from '@utils/types/events'
import type { EventScreensProps } from './types'

const SCREEN_ONLINE_TIMEOUT_MS = 30_000

const getScreenHistoryMeta = (action: EventScreenHistoryEntry['action']) => {
  switch (action) {
    case 'created':
      return {
        label: 'Criado',
        color: 'info' as const,
        description: 'Slot de telão gerado',
        icon: <AddIcon sx={{ color: 'info.main', fontSize: 18 }} />
      }
    case 'updated':
      return {
        label: 'Editado',
        color: 'warning' as const,
        description: 'Identificação do telão alterada',
        icon: <EditIcon sx={{ color: 'warning.main', fontSize: 18 }} />
      }
    case 'deleted':
      return {
        label: 'Apagado',
        color: 'error' as const,
        description: 'Telão removido do evento',
        icon: <DeleteIcon sx={{ color: 'error.main', fontSize: 18 }} />
      }
    case 'connected':
      return {
        label: 'Conectado',
        color: 'success' as const,
        description: 'Telão ativado com sucesso',
        icon: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />
      }
    case 'disconnected':
      return {
        label: 'Desconectado',
        color: 'default' as const,
        description: 'Telão desconectado e vaga liberada',
        icon: <PowerOffIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
      }
    case 'blocked':
      return {
        label: 'Bloqueado',
        color: 'error' as const,
        description: 'Telão bloqueado pela organização',
        icon: <LockIcon sx={{ color: 'error.main', fontSize: 18 }} />
      }
    case 'unblocked':
      return {
        label: 'Desbloqueado',
        color: 'success' as const,
        description: 'Acesso ao telão liberado',
        icon: <LockOpenIcon sx={{ color: 'success.main', fontSize: 18 }} />
      }
    default:
      return {
        label: 'Registro',
        color: 'default' as const,
        description: 'Ação registrada no telão',
        icon: <RefreshIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
      }
  }
}

const getScreenStatusBadge = (slot: EventScreenSlot) => {
  if (slot.isBlocked) {
    return {
      status: 'blocked' as const,
      label: 'Bloqueado',
      detail: 'Telão bloqueado pela organização'
    }
  }

  if (!slot.activatedAt) {
    return {
      status: 'pending' as const,
      label: 'Aguardando',
      detail: 'Aguardando inserção do PIN no navegador do telão'
    }
  }

  const lastSeenMs = slot.lastSeenAt ? Date.parse(slot.lastSeenAt) : NaN
  const isOnline = !Number.isNaN(lastSeenMs) && Date.now() - lastSeenMs < SCREEN_ONLINE_TIMEOUT_MS

  if (isOnline) {
    return {
      status: 'online' as const,
      label: 'Online',
      detail: `Conectado · Sinal às ${dayjs(slot.lastSeenAt).format('HH:mm:ss')}`
    }
  }

  return {
    status: 'offline' as const,
    label: 'Offline',
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
  onUpdateScreen,
  onToggleBlockScreen,
  onRefresh,
  onUnlockLockouts
}: EventScreensProps) => {
  const screenLink = buildScreenLink(event.guestToken)
  const screens = event.screens ?? []
  const screenHistory = [...(event.screenHistory ?? [])].reverse()
  const limits = getEventLimits(event)
  const maxScreens = limits.maxScreens
  const isScreenLimitReached = screens.length >= maxScreens

  const [isManagingScreen, setIsManagingScreen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [screenNameInput, setScreenNameInput] = useState('')
  const [editingSlot, setEditingSlot] = useState<EventScreenSlot | null>(null)
  const [editNameInput, setEditNameInput] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isUnlocking, setIsUnlocking] = useState(false)

  const handleUnlockLockouts = async () => {
    if (!onUnlockLockouts) return
    setIsUnlocking(true)
    try {
      await onUnlockLockouts()
    } finally {
      setIsUnlocking(false)
    }
  }

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

  const handleToggleBlockScreen = async (screenId: string, blocked: boolean) => {
    if (!onToggleBlockScreen) return
    setIsManagingScreen(true)
    try {
      await onToggleBlockScreen(screenId, blocked)
    } finally {
      setIsManagingScreen(false)
    }
  }

  const handleOpenRenameModal = (slot: EventScreenSlot) => {
    setEditingSlot(slot)
    setEditNameInput(slot.name ?? '')
  }

  const handleConfirmRename = async () => {
    if (!editingSlot) return
    setIsManagingScreen(true)
    await onUpdateScreen(editingSlot.id, editNameInput.trim() || undefined)
    setIsManagingScreen(false)
    setEditingSlot(null)
  }

  return (
    <Box sx={screenSectionStackStyles}>
      <Card elevation={0} sx={screenCardStyles}>
        <Box sx={screenHeaderRowStyles}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="subtitle1" fontWeight={700} component="h2">
                Telões do evento
              </Typography>
              <Box component="span" sx={countBadgeStyles}>
                {screens.length}/{maxScreens}
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              Gere até {maxScreens} PINs e insira no navegador de cada telão para ativar a exibição.
            </Typography>
          </Box>

          <Box sx={screenHeaderActionsStyles}>
            {onRefresh && (
              <Tooltip title="Atualizar status dos telões">
                <span>
                  <IconButton
                    size="small"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    aria-label="Atualizar status"
                    sx={compactIconButtonStyles}
                  >
                    {isRefreshing ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <RefreshIcon sx={{ fontSize: 18 }} />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            )}

            {onUnlockLockouts && (
              <Tooltip title="Desbloqueia telões travados por tentativas excessivas de PIN">
                <span>
                  <Button
                    size="small"
                    variant="outlined"
                    color="inherit"
                    startIcon={
                      isUnlocking ? (
                        <CircularProgress size={14} color="inherit" />
                      ) : (
                        <LockOpenIcon sx={{ fontSize: 16 }} />
                      )
                    }
                    onClick={handleUnlockLockouts}
                    disabled={isUnlocking}
                    sx={{ ...screenActionButtonStyles, borderColor: 'divider', color: 'text.secondary' }}
                  >
                    Desbloquear
                  </Button>
                </span>
              </Tooltip>
            )}

            <Button
              size="small"
              variant="contained"
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
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
          <Box sx={linkIconActionsStyles}>
            <Tooltip title="Copiar link do telão">
              <IconButton
                size="small"
                onClick={handleCopyScreenLink}
                aria-label="Copiar link do telão"
                sx={compactIconButtonStyles}
              >
                <CopyIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Abrir telão">
              <IconButton
                size="small"
                onClick={onOpenScreen}
                aria-label="Abrir telão"
                sx={compactIconButtonStyles}
              >
                <OpenIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" fontWeight={700} noWrap>
                        {slot.name || `Telão ${index + 1}`}
                      </Typography>
                      <Box component="span" sx={statusPillStyles(badge.status)}>
                        {badge.label}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flexShrink: 0 }}>
                      {onToggleBlockScreen && (
                        <Tooltip title={slot.isBlocked ? 'Desbloquear telão' : 'Bloquear telão'}>
                          <IconButton
                            size="small"
                            onClick={() => handleToggleBlockScreen(slot.id, !slot.isBlocked)}
                            disabled={isManagingScreen}
                            aria-label={slot.isBlocked ? 'Desbloquear telão' : 'Bloquear telão'}
                            sx={{
                              ...compactIconButtonStyles,
                              color: slot.isBlocked ? 'warning.main' : 'text.secondary',
                              '&:hover': {
                                color: slot.isBlocked ? 'warning.light' : 'text.primary'
                              }
                            }}
                          >
                            {slot.isBlocked ? <LockOpenIcon sx={{ fontSize: 16 }} /> : <LockIcon sx={{ fontSize: 16 }} />}
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Renomear telão">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenRenameModal(slot)}
                          disabled={isManagingScreen}
                          aria-label="Renomear telão"
                          sx={compactIconButtonStyles}
                        >
                          <EditIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Desconectar telão">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDisconnectScreen(slot.id)}
                          disabled={isManagingScreen}
                          aria-label="Desconectar telão"
                          sx={{ ...compactIconButtonStyles, color: 'error.main' }}
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {!slot.activatedAt && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>
                          PIN
                        </Typography>
                        <Typography sx={pinCodeTextStyles}>{slot.pin}</Typography>
                        <Tooltip title="Copiar PIN">
                          <IconButton
                            size="small"
                            onClick={() => handleCopyScreenPin(slot.pin)}
                            disabled={isManagingScreen}
                            aria-label="Copiar PIN"
                            sx={compactIconButtonStyles}
                          >
                            <CopyIcon sx={{ fontSize: 15 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  )}

                  <Typography variant="caption" color="text.secondary">
                    {badge.detail}
                  </Typography>
                </Box>
              )
            })}
          </Box>
        )}
      </Card>

      <Card variant="outlined" sx={screenCardStyles}>
        <Box sx={screenHeaderRowStyles}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" fontWeight={700}>
                Histórico de Telões
              </Typography>
              {screenHistory.length > 0 && (
                <Box component="span" sx={countBadgeStyles}>
                  {screenHistory.length}
                </Box>
              )}
            </Box>
            <Typography variant="caption" color="text.secondary">
              Registro em tempo real de criação, edição, conexões, desconexões e bloqueios dos telões.
            </Typography>
          </Box>
        </Box>

        {screenHistory.length === 0 ? (
          <Box
            sx={{
              p: 3,
              textAlign: 'center',
              borderRadius: '12px',
              border: '1px dashed',
              borderColor: 'divider',
              bgcolor: 'action.hover'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Nenhum registro de atividade recente dos telões.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {screenHistory.map((item) => {
              const meta = getScreenHistoryMeta(item.action)
              return (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'action.hover'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    {meta.icon}
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {item.name || 'Telão'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {meta.description}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Chip
                      size="small"
                      color={meta.color}
                      variant="outlined"
                      label={meta.label}
                      sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      {dayjs(item.timestamp).format('DD/MM/YYYY [às] HH:mm:ss')}
                    </Typography>
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

      <Modal
        open={Boolean(editingSlot)}
        onClose={() => setEditingSlot(null)}
        title="Renomear telão"
        description="Altere a identificação ou local deste telão (ex: Palco Principal, Área VIP). Deixe em branco para restaurar a identificação padrão."
        primaryAction={{
          label: 'Salvar',
          onClick: handleConfirmRename,
          loading: isManagingScreen
        }}
        secondaryAction={{
          label: 'Cancelar',
          onClick: () => setEditingSlot(null),
          disabled: isManagingScreen
        }}
      >
        <TextField
          label="Identificação do telão"
          placeholder="Ex: Área VIP"
          value={editNameInput}
          onChange={(e) => setEditNameInput(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 60 } }}
          fullWidth
          autoFocus
          disabled={isManagingScreen}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleConfirmRename()
            }
          }}
        />
      </Modal>
    </Box>
  )
}

export default EventScreens


