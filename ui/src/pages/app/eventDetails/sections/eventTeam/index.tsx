import { useState } from 'react'
import { Avatar, Box, Button, Chip, IconButton, Paper, TextField, Typography } from '@mui/material'
import { DeleteOutline as DeleteIcon } from '@mui/icons-material'

import useEventTeam from '../../hooks/useEventTeam'
import {
  addOrganizerRowStyles,
  ellipsisStyles,
  memberRowStyles,
  memberTextStyles,
  teamButtonStyles,
  teamPaperStyles
} from './styles'
import type { FormEvent } from 'react'
import type { EventTeamProps } from './types'

const EventTeam = ({ event, currentUserId }: EventTeamProps) => {
  const { members, add, remove } = useEventTeam(event.id)
  const [email, setEmail] = useState('')
  const isCreator = event.myRole === 'creator'

  const handleAdd = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault()
    if (await add(email.trim())) setEmail('')
  }

  return (
    <Paper variant="outlined" sx={teamPaperStyles}>
      <Typography variant="h6" component="h2">
        Equipe organizadora
      </Typography>

      {members.map((member) => {
        const canRemove = member.role === 'organizer' && (isCreator || member.userId === currentUserId)

        return (
          <Box key={member.userId} sx={memberRowStyles}>
            <Avatar src={member.photoUrl} alt={member.name}>
              {member.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={memberTextStyles}>
              <Typography variant="subtitle2" sx={ellipsisStyles}>
                {member.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" component="p" sx={ellipsisStyles}>
                {member.email}
              </Typography>
            </Box>
            <Chip
              size="small"
              color={member.role === 'creator' ? 'primary' : 'default'}
              label={member.role === 'creator' ? 'Criador' : 'Organizador'}
            />
            {canRemove && (
              <IconButton aria-label={`Remover ${member.name}`} onClick={() => remove(member.userId)}>
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        )
      })}

      {isCreator && (
        <Box component="form" onSubmit={handleAdd} sx={addOrganizerRowStyles}>
          <TextField
            type="email"
            label="E-mail do organizador"
            helperText="A pessoa precisa já ter uma conta."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="outlined" sx={teamButtonStyles}>
            Adicionar
          </Button>
        </Box>
      )}
    </Paper>
  )
}

export default EventTeam
