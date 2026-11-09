import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  IconButton,
  Switch,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import {
  AddOutlined as AddIcon,
  DeleteOutline as DeleteIcon,
  EmojiEventsOutlined as ChallengeIcon,
  RestartAltOutlined as ResetIcon
} from '@mui/icons-material'
import { toast } from 'react-toastify'

import {
  addEventChallenge,
  deleteEventChallenge,
  getEventChallenges,
  resetEventChallenges,
  toggleEventChallenge
} from '@actions/events'
import Modal from '@components/modal'
import { getErrorMessage } from '@config/events'

import {
  addChallengeFormRowStyles,
  challengeActionsRowStyles,
  challengeItemCardStyles,
  challengeListStackStyles,
  challengesCardStyles,
  challengesHeaderRowStyles
} from './styles'
import type { EventChallenge } from '@actions/events/types'
import type { EventChallengesProps } from './types'

const EventChallenges = ({ event, onRefresh }: EventChallengesProps) => {
  const [challenges, setChallenges] = useState<EventChallenge[]>(event.challenges ?? [])
  const [newTitle, setNewTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [challengeToDelete, setChallengeToDelete] = useState<EventChallenge | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadChallenges = async () => {
    setIsLoading(true)
    try {
      const list = await getEventChallenges(event.id)
      setChallenges(list)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível carregar os desafios.'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadChallenges()
  }, [event.id])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newTitle.trim()
    if (!trimmed) return

    setIsAdding(true)
    try {
      const updated = await addEventChallenge(event.id, trimmed)
      setChallenges(updated)
      setNewTitle('')
      toast.success('Desafio adicionado com sucesso!')
      onRefresh?.()
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível adicionar o desafio.'))
    } finally {
      setIsAdding(false)
    }
  }

  const handleToggle = async (challengeId: string) => {
    try {
      const updated = await toggleEventChallenge(event.id, challengeId)
      setChallenges(updated)
      onRefresh?.()
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível atualizar o status do desafio.'))
    }
  }

  const handleDelete = async () => {
    if (!challengeToDelete) return
    setIsDeleting(true)
    try {
      const updated = await deleteEventChallenge(event.id, challengeToDelete.id)
      setChallenges(updated)
      toast.success('Desafio removido.')
      setChallengeToDelete(null)
      onRefresh?.()
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível remover o desafio.'))
    } finally {
      setIsDeleting(false)
    }
  }

  const handleReset = async () => {
    setIsResetting(true)
    try {
      const updated = await resetEventChallenges(event.id)
      setChallenges(updated)
      toast.success('Desafios restaurados para o padrão do evento!')
      onRefresh?.()
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível restaurar os desafios.'))
    } finally {
      setIsResetting(false)
    }
  }

  const activeCount = challenges.filter((c) => c.active).length

  return (
    <Card elevation={0} sx={challengesCardStyles}>
      <Box sx={challengesHeaderRowStyles}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ChallengeIcon color="primary" />
            <Typography variant="h6" component="h2" fontWeight={700}>
              Missões Fotográficas Interativas
            </Typography>
            <Chip
              size="small"
              color={activeCount > 0 ? 'success' : 'default'}
              variant="outlined"
              label={`${activeCount} ${activeCount === 1 ? 'missão ativa' : 'missões ativas'}`}
              sx={{ fontWeight: 700 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Os convidados podem escolher missões temáticas para cumprir ao enviar fotos.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="inherit"
          size="small"
          startIcon={
            isResetting ? (
              <CircularProgress size={14} color="inherit" />
            ) : (
              <ResetIcon fontSize="small" />
            )
          }
          onClick={handleReset}
          disabled={isResetting}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Restaurar padrão ({event.type})
        </Button>
      </Box>

      <Box component="form" onSubmit={handleAdd} sx={addChallengeFormRowStyles}>
        <TextField
          size="small"
          fullWidth
          placeholder="Ex: Foto com o padrinho mais animado 🕺"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          disabled={isAdding}
          slotProps={{ htmlInput: { maxLength: 120 } }}
        />
        <Button
          type="submit"
          variant="contained"
          startIcon={
            isAdding ? <CircularProgress size={16} color="inherit" /> : <AddIcon fontSize="small" />
          }
          disabled={isAdding || !newTitle.trim()}
          sx={{ whiteSpace: 'nowrap', px: 3, fontWeight: 700 }}
        >
          Adicionar missão
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={32} />
        </Box>
      ) : challenges.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
          <Typography variant="body2">
            Nenhuma missão configurada. Digite uma missão acima ou clique em "Restaurar padrão".
          </Typography>
        </Box>
      ) : (
        <Box sx={challengeListStackStyles}>
          {challenges.map((challenge, index) => (
            <Box key={challenge.id} sx={challengeItemCardStyles(challenge.active)}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: challenge.active ? 'primary.main' : 'text.disabled',
                    width: 24,
                    flexShrink: 0
                  }}
                >
                  #{index + 1}
                </Typography>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    sx={{
                      textDecoration: challenge.active ? 'none' : 'line-through',
                      color: challenge.active ? 'text.primary' : 'text.secondary',
                      wordBreak: 'break-word'
                    }}
                  >
                    {challenge.title}
                  </Typography>
                  {challenge.description && (
                    <Typography variant="caption" color="text.secondary">
                      {challenge.description}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={challengeActionsRowStyles}>
                <Tooltip title={challenge.active ? 'Missão ativa no app' : 'Missão pausada'}>
                  <Switch
                    size="small"
                    checked={challenge.active}
                    onChange={() => handleToggle(challenge.id)}
                    inputProps={{ 'aria-label': 'Ativar ou desativar desafio' }}
                  />
                </Tooltip>

                <Tooltip title="Excluir desafio">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setChallengeToDelete(challenge)}
                    aria-label="Excluir desafio"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      <Modal
        open={Boolean(challengeToDelete)}
        onClose={() => setChallengeToDelete(null)}
        variant="danger"
        title="Excluir missão fotográfica?"
        description={
          <>
            A missão "<strong>{challengeToDelete?.title}</strong>" será removida do evento e não aparecerá mais para os convidados.
          </>
        }
        primaryAction={{
          label: isDeleting ? 'Excluindo...' : 'Excluir missão',
          onClick: handleDelete,
          loading: isDeleting,
          color: 'error'
        }}
        secondaryAction={{
          label: 'Cancelar',
          onClick: () => setChallengeToDelete(null),
          disabled: isDeleting
        }}
      />
    </Card>
  )
}

export default EventChallenges
