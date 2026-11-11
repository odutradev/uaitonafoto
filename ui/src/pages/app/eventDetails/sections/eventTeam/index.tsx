import { useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Skeleton,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import {
  DeleteOutline as DeleteIcon,
  PersonAddAlt1Outlined as AddPersonIcon
} from '@mui/icons-material'

import Modal from '@components/modal'
import { MAX_EVENT_ORGANIZERS } from '@assets/data/events'
import { getEventLimits } from '@utils/functions/events'

import useEventTeam from '@pages/app/eventDetails/hooks/useEventTeam'
import {
  addOrganizerRowStyles,
  addOrganizerSectionStyles,
  ellipsisStyles,
  memberAvatarStyles,
  memberRowStyles,
  membersListStyles,
  memberTextStyles,
  roleBadgeStyles,
  teamButtonStyles,
  teamCardStyles,
  teamSectionStackStyles
} from './styles'
import type { FormEvent } from 'react'
import type { TeamMember } from '@utils/types/events'
import type { EventTeamProps } from './types'

const EventTeam = ({ event, currentUserId }: EventTeamProps) => {
  const { members, isLoading, add, remove } = useEventTeam(event.id)
  const [email, setEmail] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null)
  const [isRemoving, setIsRemoving] = useState(false)
  const isCreator = event.myRole === 'creator'
  const limits = getEventLimits(event)
  const maxOrganizers = limits.maxOrganizers
  const organizersCount = members.filter((member) => member.role === 'organizer').length
  const isLimitReached = organizersCount >= maxOrganizers

  const handleAdd = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault()
    if (!email.trim() || isLimitReached) return
    setIsAdding(true)
    if (await add(email.trim())) setEmail('')
    setIsAdding(false)
  }

  const handleConfirmRemove = async () => {
    if (!memberToRemove) return
    setIsRemoving(true)
    await remove(memberToRemove.userId)
    setIsRemoving(false)
    setMemberToRemove(null)
  }

  return (
    <Box sx={teamSectionStackStyles}>
      <Card elevation={0} sx={teamCardStyles}>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} component="h2">
            Equipe organizadora
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Membros com acesso ao telão, moderação de fotos e configurações do evento.
          </Typography>
        </Box>

        {isLoading ? (
          <Box sx={membersListStyles}>
            <Skeleton variant="rounded" height={56} sx={{ borderRadius: '10px' }} />
            <Skeleton variant="rounded" height={56} sx={{ borderRadius: '10px' }} />
          </Box>
        ) : (
          <Box sx={membersListStyles}>
            {members.map((member) => {
              const canRemove = member.role === 'organizer' && (isCreator || member.userId === currentUserId)

              return (
                <Box key={member.userId} sx={memberRowStyles}>
                  <Avatar src={member.photoUrl} alt={member.name} sx={memberAvatarStyles}>
                    {member.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={memberTextStyles}>
                    <Typography variant="body2" fontWeight={700} sx={ellipsisStyles}>
                      {member.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" component="p" sx={ellipsisStyles}>
                      {member.email}
                    </Typography>
                  </Box>
                  <Box component="span" sx={roleBadgeStyles(member.role === 'creator')}>
                    {member.role === 'creator' ? 'Criador' : 'Organizador'}
                  </Box>
                  {canRemove && (
                    <Tooltip title={member.userId === currentUserId ? 'Sair da equipe' : 'Remover organizador'}>
                      <IconButton
                        size="small"
                        color="error"
                        aria-label={`Remover ${member.name}`}
                        onClick={() => setMemberToRemove(member)}
                        sx={{ p: 0.5, borderRadius: '8px' }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              )
            })}
          </Box>
        )}

        {isCreator && (
          <Box component="form" onSubmit={handleAdd} sx={addOrganizerSectionStyles}>
            <Box>
              <Typography variant="body2" fontWeight={700}>
                Convidar organizador ({organizersCount}/{maxOrganizers})
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isLimitReached
                  ? `Limite de ${maxOrganizers} ${maxOrganizers === 1 ? 'organizador' : 'organizadores'} atingido para este evento.`
                  : 'Informe o e-mail de uma pessoa que já possui conta na plataforma.'}
              </Typography>
            </Box>

            <Box sx={addOrganizerRowStyles}>
              <TextField
                size="small"
                type="email"
                placeholder="Ex: assessoria@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isAdding || isLimitReached}
                helperText={isLimitReached ? 'Remova um organizador para adicionar outro.' : undefined}
                required
                fullWidth
              />
              <Button
                type="submit"
                size="small"
                variant="contained"
                disabled={isAdding || !email.trim() || isLimitReached}
                startIcon={isAdding ? <CircularProgress size={15} color="inherit" /> : <AddPersonIcon sx={{ fontSize: 16 }} />}
                sx={teamButtonStyles}
              >
                {isAdding ? 'Adicionando...' : 'Adicionar'}
              </Button>
            </Box>
          </Box>
        )}
      </Card>

      <Modal
        open={Boolean(memberToRemove)}
        onClose={() => setMemberToRemove(null)}
        variant="danger"
        title="Remover da equipe?"
        description={
          <>
            <strong>{memberToRemove?.name}</strong> perderá o acesso de organização deste evento.
          </>
        }
        primaryAction={{
          label: isRemoving ? 'Removendo...' : 'Confirmar remoção',
          onClick: handleConfirmRemove,
          loading: isRemoving,
          color: 'error'
        }}
        secondaryAction={{
          label: 'Cancelar',
          onClick: () => setMemberToRemove(null),
          disabled: isRemoving
        }}
      />
    </Box>
  )
}

export default EventTeam

