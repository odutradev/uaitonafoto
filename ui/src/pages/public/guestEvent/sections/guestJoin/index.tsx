import { useRef, useState } from 'react'
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material'

import {
  joinButtonStyles,
  joinPaperStyles,
  pinSectionStyles,
  pinSlotInputStyles,
  pinSlotsRowStyles
} from './styles'
import type { ClipboardEvent, FormEvent, KeyboardEvent } from 'react'
import type { GuestJoinProps } from './types'

const PIN_LENGTH = 4

const GuestJoin = ({ event, onJoin }: GuestJoinProps) => {
  const [name, setName] = useState('')
  const [digits, setDigits] = useState<string[]>(['', '', '', ''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const slotRefs = useRef<Array<HTMLInputElement | null>>([])

  const pin = digits.join('')
  const isExpired = event.phase === 'expired'
  const canSubmit = Boolean(name.trim()) && (!event.requiresPin || /^\d{4}$/.test(pin))

  const focusSlot = (index: number) => {
    slotRefs.current[index]?.focus()
    slotRefs.current[index]?.select()
  }

  const handleDigitChange = (index: number, rawValue: string) => {
    const cleaned = rawValue.replace(/\D/g, '')
    if (!cleaned) {
      setDigits((prev) => prev.map((d, i) => (i === index ? '' : d)))
      return
    }

    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, PIN_LENGTH - index).split('')
      setDigits((prev) => {
        const next = [...prev]
        chars.forEach((char, offset) => {
          next[index + offset] = char
        })
        return next
      })
      focusSlot(Math.min(index + chars.length, PIN_LENGTH - 1))
      return
    }

    const digit = cleaned.slice(-1)
    setDigits((prev) => prev.map((d, i) => (i === index ? digit : d)))
    if (index < PIN_LENGTH - 1) {
      focusSlot(index + 1)
    }
  }

  const handleKeyDown = (index: number, keyEvent: KeyboardEvent<HTMLDivElement>) => {
    if (keyEvent.key === 'Backspace' && !digits[index] && index > 0) {
      keyEvent.preventDefault()
      setDigits((prev) => prev.map((d, i) => (i === index - 1 ? '' : d)))
      focusSlot(index - 1)
      return
    }
    if (keyEvent.key === 'ArrowLeft' && index > 0) {
      keyEvent.preventDefault()
      focusSlot(index - 1)
      return
    }
    if (keyEvent.key === 'ArrowRight' && index < PIN_LENGTH - 1) {
      keyEvent.preventDefault()
      focusSlot(index + 1)
    }
  }

  const handlePaste = (pasteEvent: ClipboardEvent<HTMLDivElement>) => {
    const pasted = pasteEvent.clipboardData.getData('text').replace(/\D/g, '').slice(0, PIN_LENGTH)
    if (!pasted) return
    pasteEvent.preventDefault()
    const next = ['', '', '', '']
    pasted.split('').forEach((char, i) => {
      next[i] = char
    })
    setDigits(next)
    focusSlot(Math.min(pasted.length, PIN_LENGTH - 1))
  }

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
            <Box sx={pinSectionStyles}>
              <Typography variant="subtitle2" fontWeight={700}>
                PIN do evento
              </Typography>
              <Box sx={pinSlotsRowStyles}>
                {digits.map((digit, index) => (
                  <TextField
                    key={index}
                    value={digit}
                    placeholder="•"
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    inputRef={(el: HTMLInputElement | null) => {
                      slotRefs.current[index] = el
                    }}
                    slotProps={{
                      htmlInput: {
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        maxLength: 4,
                        autoComplete: index === 0 ? 'one-time-code' : 'off',
                        'aria-label': `Dígito ${index + 1} do PIN`
                      }
                    }}
                    sx={pinSlotInputStyles}
                  />
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary">
                Informe o código de 4 dígitos exibido no telão ou com o organizador.
              </Typography>
            </Box>
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

