import { useState } from 'react'
import { Alert, Button, Paper, TextField, Typography } from '@mui/material'

import PinInput from '@components/pinInput'

import { joinButtonStyles, joinPaperStyles } from './styles'
import type { FormEvent } from 'react'
import type { GuestJoinProps } from './types'

const GuestJoin = ({ event, onJoin, lockout }: GuestJoinProps) => {
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isExpired = event.phase === 'expired'
  const isLocked = Boolean(event.requiresPin && lockout?.isLocked)
  const isPermanent = Boolean(event.requiresPin && lockout?.isPermanent)
  const canSubmit = Boolean(name.trim()) && (!event.requiresPin || (/^\d{4}$/.test(pin) && !isLocked))

  const handleSubmit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault()
    if (!canSubmit || isLocked) return

    setIsSubmitting(true)
    await onJoin(name.trim(), event.requiresPin ? pin : undefined)
    setIsSubmitting(false)
  }

  return (
    <Paper variant="outlined" component="form" noValidate onSubmit={handleSubmit} sx={joinPaperStyles}>
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
          {event.requiresPin && isPermanent && (
            <Alert severity="error" sx={{ width: '100%', textAlign: 'left' }}>
              <Typography variant="subtitle2" fontWeight={800}>
                Acesso bloqueado definitivamente
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                Limite de 10 tentativas incorretas atingido. Entre em contato com o organizador do evento.
              </Typography>
            </Alert>
          )}

          {event.requiresPin && !isPermanent && isLocked && (
            <Alert severity="warning" sx={{ width: '100%', textAlign: 'left' }}>
              <Typography variant="subtitle2" fontWeight={800}>
                Dispositivo bloqueado temporariamente
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                Tente novamente em{' '}
                <Typography component="span" fontWeight={900} sx={{ fontVariantNumeric: 'tabular-nums' }}>
                  {lockout?.formattedTime}
                </Typography>
              </Typography>
            </Alert>
          )}

          <TextField
            label="Seu nome"
            placeholder="Ex: Maria"
            value={name}
            onChange={(e) => setName(e.target.value)}
            slotProps={{ htmlInput: { maxLength: 60 } }}
            required
            fullWidth
            disabled={isSubmitting || isPermanent}
          />
          {event.requiresPin && (
            <PinInput
              value={pin}
              onChange={setPin}
              disabled={isSubmitting || isLocked}
              label="PIN do evento"
              helperText="Informe o código de 4 dígitos exibido no telão ou com o organizador."
            />
          )}
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting || !canSubmit}
            sx={joinButtonStyles}
          >
            {isSubmitting
              ? 'Entrando...'
              : isPermanent
                ? 'Acesso bloqueado'
                : isLocked
                  ? `Tente novamente em ${lockout?.formattedTime}`
                  : 'Entrar no evento'}
          </Button>
        </>
      )}
    </Paper>
  )
}

export default GuestJoin
