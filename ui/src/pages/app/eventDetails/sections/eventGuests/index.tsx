import { useEffect, useMemo, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import {
  CollectionsOutlined as PhotoIcon,
  DeleteOutline as DeleteIcon,
  EditOutlined as EditIcon,
  LockOpenOutlined as LockOpenIcon,
  LockOutlined as LockIcon,
  PeopleAltOutlined as GuestIcon,
  RefreshOutlined as RefreshIcon,
  SearchOutlined as SearchIcon
} from '@mui/icons-material'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

import Modal from '@components/modal'
import {
  deleteEventGuest,
  getEventGuests,
  setEventGuestBlock,
  updateEventGuest
} from '@actions/events'
import { getErrorMessage } from '@utils/functions/events'
import type { EventGuest } from '@utils/types/events'
import type { EventGuestsProps } from './types'
import {
  compactIconButtonStyles,
  countBadgeStyles,
  guestCardStyles,
  guestHeaderStyles,
  guestsCardStyles,
  guestsGridStyles,
  guestsHeaderActionsStyles,
  guestsHeaderRowStyles,
  guestsSectionStackStyles,
  guestStatusPillStyles
} from './styles'

const EventGuests = ({ event }: EventGuestsProps) => {
  const [guests, setGuests] = useState<EventGuest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const [editingGuest, setEditingGuest] = useState<EventGuest | null>(null)
  const [editNameInput, setEditNameInput] = useState('')

  const [deletingGuest, setDeletingGuest] = useState<EventGuest | null>(null)

  const loadGuests = async (showLoading = true) => {
    if (showLoading) setIsLoading(true)
    try {
      const data = await getEventGuests(event.id)
      setGuests(data)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível carregar a lista de convidados.'))
    } finally {
      if (showLoading) setIsLoading(false)
    }
  }

  useEffect(() => {
    loadGuests()
  }, [event.id])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await loadGuests(false)
      toast.success('Lista de convidados atualizada!')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleToggleBlock = async (guest: EventGuest) => {
    setActionLoadingId(guest.id)
    const nextBlock = !guest.isBlocked
    try {
      const updated = await setEventGuestBlock(event.id, guest.id, nextBlock)
      setGuests((prev) => prev.map((g) => (g.id === guest.id ? updated : g)))
      toast.success(nextBlock ? `${guest.name} foi bloqueado(a).` : `${guest.name} foi desbloqueado(a)!`)
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          nextBlock ? 'Não foi possível bloquear o convidado.' : 'Não foi possível desbloquear o convidado.'
        )
      )
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleOpenEdit = (guest: EventGuest) => {
    setEditingGuest(guest)
    setEditNameInput(guest.name)
  }

  const handleConfirmEdit = async () => {
    if (!editingGuest) return
    const trimmed = editNameInput.trim()
    if (!trimmed) {
      toast.error('Informe um nome válido.')
      return
    }

    setActionLoadingId(editingGuest.id)
    try {
      const updated = await updateEventGuest(event.id, editingGuest.id, trimmed)
      setGuests((prev) => prev.map((g) => (g.id === editingGuest.id ? updated : g)))
      toast.success('Nome do convidado atualizado!')
      setEditingGuest(null)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível atualizar o convidado.'))
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleOpenDelete = (guest: EventGuest) => {
    setDeletingGuest(guest)
  }

  const handleConfirmDelete = async () => {
    if (!deletingGuest) return
    setActionLoadingId(deletingGuest.id)
    try {
      await deleteEventGuest(event.id, deletingGuest.id)
      setGuests((prev) => prev.filter((g) => g.id !== deletingGuest.id))
      toast.success('Convidado removido do evento.')
      setDeletingGuest(null)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível remover o convidado.'))
    } finally {
      setActionLoadingId(null)
    }
  }

  const filteredGuests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return guests
    return guests.filter((g) => g.name.toLowerCase().includes(q))
  }, [guests, searchQuery])

  const stats = useMemo(() => {
    const total = guests.length
    const blocked = guests.filter((g) => g.isBlocked).length
    const active = total - blocked
    const totalPhotos = guests.reduce((acc, g) => acc + (g.photosCount || 0), 0)
    return { total, active, blocked, totalPhotos }
  }, [guests])

  return (
    <Box sx={guestsSectionStackStyles}>
      <Card variant="outlined" sx={guestsCardStyles}>
        <Box sx={guestsHeaderRowStyles}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" fontWeight={700}>
                Gestão de Convidados
              </Typography>
              {guests.length > 0 && (
                <Box component="span" sx={countBadgeStyles}>
                  {guests.length}
                </Box>
              )}
            </Box>
            <Typography variant="caption" color="text.secondary">
              Gerencie individualmente os convidados que acessaram o evento, com opção de renomear, desbloquear e moderar.
            </Typography>
          </Box>

          <Box sx={guestsHeaderActionsStyles}>
            <Button
              variant="outlined"
              size="small"
              startIcon={isRefreshing ? <CircularProgress size={14} color="inherit" /> : <RefreshIcon fontSize="small" />}
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              sx={{ borderColor: 'divider', color: 'text.secondary' }}
            >
              Atualizar
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Buscar convidado por nome..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                )
              }
            }}
            sx={{ width: { xs: '100%', sm: 300 } }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Typography variant="caption" color="text.secondary">
              Ativos: <strong>{stats.active}</strong>
            </Typography>
            {stats.blocked > 0 && (
              <Typography variant="caption" color="error.main">
                Bloqueados: <strong>{stats.blocked}</strong>
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              Fotos enviadas: <strong>{stats.totalPhotos}</strong>
            </Typography>
          </Box>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={32} />
          </Box>
        ) : filteredGuests.length === 0 ? (
          <Box
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: '12px',
              border: '1px dashed',
              borderColor: 'divider',
              bgcolor: 'action.hover'
            }}
          >
            <GuestIcon sx={{ fontSize: 36, color: 'text.secondary', mb: 1, opacity: 0.7 }} />
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {searchQuery
                ? 'Nenhum convidado encontrado com esse nome.'
                : 'Nenhum convidado entrou no evento ainda.'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Assim que os participantes escanearem o QR Code e entrarem, eles aparecerão aqui.
            </Typography>
          </Box>
        ) : (
          <Box sx={guestsGridStyles}>
            {filteredGuests.map((guest) => {
              const isActionLoading = actionLoadingId === guest.id
              return (
                <Box key={guest.id} sx={guestCardStyles}>
                  <Box sx={guestHeaderStyles}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          bgcolor: guest.isBlocked ? 'error.dark' : 'primary.main'
                        }}
                      >
                        {guest.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle2" fontWeight={700} noWrap>
                          {guest.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                          <Box component="span" sx={guestStatusPillStyles(guest.isBlocked)}>
                            {guest.isBlocked ? 'Bloqueado' : 'Ativo'}
                          </Box>
                          {guest.ip && guest.ip !== 'unknown' && (
                            <Typography variant="caption" sx={{ fontSize: '0.6875rem', color: 'text.disabled' }}>
                              {guest.ip}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flexShrink: 0 }}>
                      <Tooltip title={guest.isBlocked ? 'Desbloquear convidado' : 'Bloquear convidado'}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleBlock(guest)}
                          disabled={isActionLoading}
                          aria-label={guest.isBlocked ? 'Desbloquear convidado' : 'Bloquear convidado'}
                          sx={{
                            ...compactIconButtonStyles,
                            color: guest.isBlocked ? 'warning.main' : 'text.secondary',
                            '&:hover': {
                              color: guest.isBlocked ? 'warning.light' : 'text.primary'
                            }
                          }}
                        >
                          {guest.isBlocked ? (
                            <LockOpenIcon sx={{ fontSize: 16 }} />
                          ) : (
                            <LockIcon sx={{ fontSize: 16 }} />
                          )}
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Renomear convidado">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEdit(guest)}
                          disabled={isActionLoading}
                          aria-label="Renomear convidado"
                          sx={compactIconButtonStyles}
                        >
                          <EditIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Remover convidado">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleOpenDelete(guest)}
                          disabled={isActionLoading}
                          aria-label="Remover convidado"
                          sx={{ ...compactIconButtonStyles, color: 'error.main' }}
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PhotoIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {guest.photosCount} {guest.photosCount === 1 ? 'foto' : 'fotos'}
                      </Typography>
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                      {dayjs(guest.createdAt).format('DD/MM [às] HH:mm')}
                    </Typography>
                  </Box>
                </Box>
              )
            })}
          </Box>
        )}
      </Card>

      <Modal
        open={Boolean(editingGuest)}
        onClose={() => setEditingGuest(null)}
        title="Renomear Convidado"
        description="Altere a identificação do convidado no evento."
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            autoFocus
            label="Nome do convidado"
            size="small"
            value={editNameInput}
            onChange={(e) => setEditNameInput(e.target.value)}
            disabled={actionLoadingId !== null}
            fullWidth
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              variant="text"
              onClick={() => setEditingGuest(null)}
              disabled={actionLoadingId !== null}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmEdit}
              disabled={actionLoadingId !== null || !editNameInput.trim()}
            >
              Salvar
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={Boolean(deletingGuest)}
        onClose={() => setDeletingGuest(null)}
        title="Remover Convidado"
        description={`Tem certeza que deseja remover ${deletingGuest?.name} deste evento? O convidado perderá o acesso à sessão atual.`}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 2 }}>
          <Button
            variant="text"
            onClick={() => setDeletingGuest(null)}
            disabled={actionLoadingId !== null}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={actionLoadingId !== null}
          >
            Remover
          </Button>
        </Box>
      </Modal>
    </Box>
  )
}

export default EventGuests

