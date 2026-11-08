import { useState } from 'react'
import { Alert, Button, Paper, TextField, Typography } from '@mui/material'

import { joinButtonStyles, joinPaperStyles } from './styles'
import type { FormEvent } from 'react'
import type { GuestJoinProps } from './types'

const GuestJoin = ({ event, onJoin }: GuestJoinProps) => {
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isExpired = event.phase === 'expired'
  const canSubmit = Boolean(name.trim()) && (!event.requiresPin || /^\d{4}$/.test(pin))

  const handleSubmit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault()
    if (!canSubmit) return

    setIsSubmitting(true)
    await onJoin(name.trim(), event.requiresPin ? pin : undefined)
    setIsSubmitting(false)
  }

  return (
    <Paper variant="outlined" component="form" onSubmit={handleSubmit} sx={joinPaperStyles}>
      <Typography variant="h6" component="h2">
        Como você quer ser chamado?
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Seu nome aparece nas fotos que você enviar. Não precisa criar conta.
      </Typography>

      {isExpired ? (
        <Alert severity="warning">A galeria deste evento já foi encerrada.</Alert>
      ) : (
        <>
          <TextField
            label="Seu nome"
            placeholder="Ex: Maria"
            value={name}
            onChange={(e) => setName(e.target.value)}
            slotProps={{ htmlInput: { maxLength: 60 } }}
            required
            fullWidth
          />
          {event.requiresPin && (
            <TextField
              label="PIN do evento (4 dígitos)"
              placeholder="0000"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              helperText="Informe o código de 4 dígitos exibido no telão ou com o organizador."
              slotProps={{
                htmlInput: {
                  inputMode: 'numeric',
                  pattern: '\\d{4}',
                  maxLength: 4
                }
              }}
              required
              fullWidth
            />
          )}
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting || !canSubmit}
            sx={joinButtonStyles}
          >
            {isSubmitting ? 'Entrando...' : 'Entrar no evento'}
          </Button>
        </>
      )}
    </Paper>
  )
}

export default GuestJoin

