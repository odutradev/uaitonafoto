import { useEffect, useRef, useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import {
  VisibilityOffOutlined as VisibilityOffIcon,
  VisibilityOutlined as VisibilityIcon
} from '@mui/icons-material'

import {
  pinContainerStyles,
  pinLabelStyles,
  pinSlotInputStyles,
  pinSlotsRowStyles,
  pinToggleMaskButtonStyles,
  pinToggleMaskRowStyles
} from './styles'
import type { ClipboardEvent, KeyboardEvent } from 'react'
import type { PinInputProps } from './types'

const PinInput = ({
  value,
  onChange,
  length = 4,
  autoFocus = false,
  disabled = false,
  mask = false,
  showMaskToggle = false,
  label,
  helperText,
  ariaLabelPrefix = 'Dígito',
  containerSx,
  slotSx,
  onComplete
}: PinInputProps) => {
  const [isMasked, setIsMasked] = useState(Boolean(mask))
  const slotRefs = useRef<Array<HTMLInputElement | null>>([])
  const digits = Array.from({ length }, (_, index) => value[index] ?? '')

  useEffect(() => {
    setIsMasked(Boolean(mask))
  }, [mask])

  const focusSlot = (index: number) => {
    slotRefs.current[index]?.focus()
    slotRefs.current[index]?.select()
  }

  useEffect(() => {
    if (!autoFocus) return
    focusSlot(0)
  }, [autoFocus])

  const notifyChange = (nextDigits: string[]) => {
    const nextPin = nextDigits.join('')
    onChange(nextPin)
    if (nextPin.length === length && onComplete) {
      onComplete(nextPin)
    }
  }

  const handleDigitChange = (index: number, rawValue: string) => {
    const cleaned = rawValue.replace(/\D/g, '')

    if (!cleaned) {
      const nextDigits = digits.map((digit, i) => (i === index ? '' : digit))
      notifyChange(nextDigits)
      return
    }

    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, length - index).split('')
      const nextDigits = [...digits]
      chars.forEach((char, offset) => {
        nextDigits[index + offset] = char
      })
      notifyChange(nextDigits)
      focusSlot(Math.min(index + chars.length, length - 1))
      return
    }

    const digit = cleaned.slice(-1)
    const nextDigits = digits.map((d, i) => (i === index ? digit : d))
    notifyChange(nextDigits)
    if (index < length - 1) {
      focusSlot(index + 1)
    }
  }

  const handleKeyDown = (index: number, keyEvent: KeyboardEvent<HTMLDivElement>) => {
    if (keyEvent.key === 'Backspace' && !digits[index] && index > 0) {
      keyEvent.preventDefault()
      const nextDigits = digits.map((digit, i) => (i === index - 1 ? '' : digit))
      notifyChange(nextDigits)
      focusSlot(index - 1)
      return
    }
    if (keyEvent.key === 'ArrowLeft' && index > 0) {
      keyEvent.preventDefault()
      focusSlot(index - 1)
      return
    }
    if (keyEvent.key === 'ArrowRight' && index < length - 1) {
      keyEvent.preventDefault()
      focusSlot(index + 1)
    }
  }

  const handlePaste = (index: number, pasteEvent: ClipboardEvent<HTMLDivElement>) => {
    const pasted = pasteEvent.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    pasteEvent.preventDefault()

    const pastedChars = pasted.split('')
    const nextDigits = Array.from({ length }, (_, i) => pastedChars[i] ?? '')
    notifyChange(nextDigits)
    focusSlot(Math.min(pastedChars.length, length - 1))
  }

  return (
    <Box sx={[pinContainerStyles, ...(Array.isArray(containerSx) ? containerSx : [containerSx])]}>
      {label && (
        <Typography variant="subtitle2" sx={pinLabelStyles}>
          {label}
        </Typography>
      )}

      <Box sx={pinSlotsRowStyles}>
        {digits.map((digit, index) => (
          <TextField
            key={index}
            value={isMasked && digit ? '●' : digit}
            disabled={disabled}
            placeholder="•"
            onChange={(e) => handleDigitChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={(e) => handlePaste(index, e)}
            inputRef={(el: HTMLInputElement | null) => {
              slotRefs.current[index] = el
            }}
            slotProps={{
              htmlInput: {
                inputMode: 'numeric',
                pattern: isMasked ? undefined : '[0-9]*',
                maxLength: 4,
                autoComplete: index === 0 ? 'one-time-code' : 'off',
                'aria-label': `${ariaLabelPrefix} ${index + 1}`,
                style: { caretColor: 'transparent' }
              }
            }}
            sx={[pinSlotInputStyles, ...(Array.isArray(slotSx) ? slotSx : [slotSx])]}
          />
        ))}
      </Box>

      {showMaskToggle && (
        <Box sx={pinToggleMaskRowStyles}>
          <Button
            type="button"
            size="small"
            variant="text"
            startIcon={isMasked ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
            onClick={() => setIsMasked((prev) => !prev)}
            disabled={disabled}
            sx={pinToggleMaskButtonStyles}
          >
            {isMasked ? 'Mostrar dígitos' : 'Ocultar dígitos'}
          </Button>
        </Box>
      )}

      {helperText && (
        <Typography variant="caption" color="text.secondary">
          {helperText}
        </Typography>
      )}
    </Box>
  )
}

export default PinInput
