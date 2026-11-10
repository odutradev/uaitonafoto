import { useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { AddCircleOutline as AddIcon } from '@mui/icons-material'

import type { AddCreditsPayload, AdminUserItem } from '@actions/admin'

interface AddCreditsDialogProps {
  open: boolean
  user: AdminUserItem | null
  isSubmitting: boolean
  onClose: () => void
  onConfirm: (payload: AddCreditsPayload) => void
}

export const AddCreditsDialog = ({
  open,
  user,
  isSubmitting,
  onClose,
  onConfirm
}: AddCreditsDialogProps) => {
  const [amount, setAmount] = useState<number>(1)
  const [creditType, setCreditType] = useState<'paid' | 'free'>('paid')
  const [reason, setReason] = useState('')

  if (!user) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (amount < 1) return
    onConfirm({
      amount: Math.floor(amount),
      type: creditType,
      reason: reason.trim() || undefined
    })
  }

  const displayName = user.fullName || user.name

  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>
        Conceder créditos ao usuário
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              borderRadius: '12px',
              bgcolor: 'action.hover'
            }}
          >
            <Avatar src={user.photoUrl} alt={displayName} sx={{ width: 48, height: 48 }}>
              {displayName.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={700} noWrap>
                {displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.email}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Saldo atual: <strong>{user.paidCredits}</strong> pago(s) • <strong>{user.freeCredits}</strong> cortesia
              </Typography>
            </Box>
          </Box>

          <TextField
            label="Quantidade de créditos"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value, 10) || 1))}
            inputProps={{ min: 1, max: 1000, step: 1 }}
            required
            fullWidth
            helperText="Informe o número inteiro de créditos que serão adicionados ao saldo."
          />

          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ fontSize: '0.875rem', fontWeight: 700, mb: 0.5 }}>
              Tipo de crédito
            </FormLabel>
            <RadioGroup
              row
              value={creditType}
              onChange={(e) => setCreditType(e.target.value as 'paid' | 'free')}
            >
              <FormControlLabel
                value="paid"
                control={<Radio size="small" />}
                label={
                  <Stack>
                    <Typography variant="body2" fontWeight={600}>
                      Crédito Pago
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Permite criar eventos comerciais completos
                    </Typography>
                  </Stack>
                }
              />
              <FormControlLabel
                value="free"
                control={<Radio size="small" />}
                label={
                  <Stack>
                    <Typography variant="body2" fontWeight={600}>
                      Cortesia / Degustação
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Créditos promocionais ou de teste
                    </Typography>
                  </Stack>
                }
                sx={{ mt: { xs: 1, sm: 0 } }}
              />
            </RadioGroup>
          </FormControl>

          <TextField
            label="Motivo / Observação (opcional)"
            placeholder="Ex: Bonificação promocional, compensação de suporte, etc."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            multiline
            rows={2}
            fullWidth
            helperText="Ficará registrado no log de auditoria do sistema."
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting} variant="text" color="inherit">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting || amount < 1}
            startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <AddIcon />}
          >
            {isSubmitting ? 'Concedendo...' : `Adicionar ${amount} crédito(s)`}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default AddCreditsDialog
