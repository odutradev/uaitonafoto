import { useEffect, useState } from 'react'
import { Box, Button, Card, CircularProgress, IconButton, Switch, TextField, Tooltip, Typography } from '@mui/material'
import { AddOutlined as AddIcon, DeleteOutline as DeleteIcon, RestartAltOutlined as ResetIcon } from '@mui/icons-material'

import { addEventChallenge, deleteEventChallenge, getEventChallenges, resetEventChallenges, toggleEventChallenge } from '@actions/events'
import Modal from '@components/modal'

import { addChallengeButtonStyles, addChallengeFormRowStyles, challengeActionsRowStyles, challengeItemCardStyles, challengeListStackStyles, challengesCardStyles, challengesHeaderRowStyles, countBadgeStyles, resetButtonStyles } from './styles'
import type { EventChallenge } from '@utils/types/events'
import useEventDetailsPage from '@pages/app/eventDetails/hook'
import useAction from '@hooks/useAction'

const EventChallenges = () => {
  const runAction = useAction()
  const { event: eventValue, refresh: onRefresh } = useEventDetailsPage()
  const event = eventValue!

  const [challenges, setChallenges] = useState<EventChallenge[]>(event.challenges ?? [])
  const [newTitle, setNewTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [challengeToDelete, setChallengeToDelete] = useState<EventChallenge | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadChallenges = async () => {
    setIsLoading(true)
    await runAction({
      action: async () => {
        const list = await getEventChallenges(event.id)
        setChallenges(list)
      },
      toastMessages: { error: 'Não foi possível carregar os desafios.' }
    })
    setIsLoading(false)
  }

  useEffect(() => {
    loadChallenges()
  }, [event.id])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newTitle.trim()
    if (!trimmed) return

    setIsAdding(true)
    await runAction({
      action: async () => {
        const updated = await addEventChallenge(event.id, trimmed)
        setChallenges(updated)
        setNewTitle('')
        onRefresh?.()
      },
      toastMessages: { success: 'Desafio adicionado com sucesso!', error: 'Não foi possível adicionar o desafio.' }
    })
    setIsAdding(false)
  }

  const handleToggle = async (challengeId: string) => {
    await runAction({
      action: async () => {
        const updated = await toggleEventChallenge(event.id, challengeId)
        setChallenges(updated)
        onRefresh?.()
      },
      toastMessages: { error: 'Não foi possível atualizar o status do desafio.' }
    })
  }

  const handleDelete = async () => {
    if (!challengeToDelete) return
    setIsDeleting(true)
    await runAction({
      action: async () => {
        const updated = await deleteEventChallenge(event.id, challengeToDelete.id)
        setChallenges(updated)
        setChallengeToDelete(null)
        onRefresh?.()
      },
      toastMessages: { success: 'Desafio removido.', error: 'Não foi possível remover o desafio.' }
    })
    setIsDeleting(false)
  }

  const handleReset = async () => {
    setIsResetting(true)
    await runAction({
      action: async () => {
        const updated = await resetEventChallenges(event.id)
        setChallenges(updated)
        onRefresh?.()
      },
      toastMessages: { success: 'Desafios restaurados para o padrão do evento!', error: 'Não foi possível restaurar os desafios.' }
    })
    setIsResetting(false)
  }

  const activeCount = challenges.filter((c) => c.active).length

  return (
    <Card elevation={0} sx={challengesCardStyles}>
      <Box sx={challengesHeaderRowStyles}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" component="h2" fontWeight={700}>
              Missões fotográficas
            </Typography>
            <Box component="span" sx={countBadgeStyles}>
              {activeCount} {activeCount === 1 ? 'ativa' : 'ativas'}
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
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
              <ResetIcon sx={{ fontSize: 16 }} />
            )
          }
          onClick={handleReset}
          disabled={isResetting}
          sx={resetButtonStyles}
        >
          Restaurar padrão
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
          size="small"
          variant="contained"
          startIcon={
            isAdding ? <CircularProgress size={15} color="inherit" /> : <AddIcon sx={{ fontSize: 16 }} />
          }
          disabled={isAdding || !newTitle.trim()}
          sx={addChallengeButtonStyles}
        >
          Adicionar
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress size={28} />
        </Box>
      ) : challenges.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
          <Typography variant="body2">
            Nenhuma missão configurada. Digite uma missão acima ou clique em &ldquo;Restaurar padrão&rdquo;.
          </Typography>
        </Box>
      ) : (
        <Box sx={challengeListStackStyles}>
          {challenges.map((challenge, index) => (
            <Box key={challenge.id} sx={challengeItemCardStyles(challenge.active)}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: challenge.active ? 'primary.main' : 'text.disabled',
                    width: 22,
                    flexShrink: 0
                  }}
                >
                  #{index + 1}
                </Typography>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
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
                    sx={{ p: 0.5, borderRadius: '8px' }}
                  >
                    <DeleteIcon sx={{ fontSize: 16 }} />
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
            A missão &ldquo;<strong>{challengeToDelete?.title}</strong>&rdquo; será removida do evento e não aparecerá mais para os convidados.
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

