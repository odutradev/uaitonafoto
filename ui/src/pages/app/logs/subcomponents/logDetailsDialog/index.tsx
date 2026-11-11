import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material'

import {
  closeBtnStyles,
  detailsStackStyles,
  dialogActionsStyles,
  dialogPaperStyles,
  infoRowStyles,
  jsonPreStyles
} from './styles'
import type { LogLevel } from '@utils/types/logs'
import type { LogDetailsDialogProps } from './types'

const formatFullDateTime = (isoDate: string): string => {
  const parsed = new Date(isoDate)
  if (Number.isNaN(parsed.getTime())) return isoDate
  return parsed.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const getLevelChip = (level: LogLevel) => {
  if (level === 'error') return { label: 'Erro', color: 'error' as const }
  if (level === 'warn') return { label: 'Alerta', color: 'warning' as const }
  return { label: 'Informação', color: 'info' as const }
}

const LogDetailsDialog = ({ log, isAdmin, onClose }: LogDetailsDialogProps) => {
  if (!log) return null

  const levelMeta = getLevelChip(log.level)
  const hasDetailsPayload = log.details !== undefined && log.details !== null

  return (
    <Dialog open={Boolean(log)} onClose={onClose} slotProps={{ paper: { sx: dialogPaperStyles } }}>
      <DialogTitle>{log.title}</DialogTitle>
      <DialogContent>
        <Box sx={detailsStackStyles}>
          <Box sx={infoRowStyles}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              AÇÃO / SEVERIDADE
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip size="small" variant="outlined" label={log.action} sx={{ fontFamily: 'monospace' }} />
              <Chip size="small" color={levelMeta.color} label={levelMeta.label} sx={{ fontWeight: 700 }} />
            </Box>
          </Box>

          <Box sx={infoRowStyles}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              DATA E HORA
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {formatFullDateTime(log.createdAt)}
            </Typography>
          </Box>

          {log.description && (
            <Box sx={infoRowStyles}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                DESCRIÇÃO
              </Typography>
              <Typography variant="body2">{log.description}</Typography>
            </Box>
          )}

          {(log.userEmail || log.userName) && (
            <Box sx={infoRowStyles}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                USUÁRIO
              </Typography>
              <Typography variant="body2">
                {log.userName ? `${log.userName} (${log.userEmail ?? '-'})` : log.userEmail}
              </Typography>
            </Box>
          )}

          {log.targetName && (
            <Box sx={infoRowStyles}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                RECURSO ALVO
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {log.targetName}
              </Typography>
            </Box>
          )}

          {isAdmin && log.ipAddress && (
            <Box sx={infoRowStyles}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                ENDEREÇO IP
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                {log.ipAddress}
              </Typography>
            </Box>
          )}

          {isAdmin && log.errorMessage && (
            <Box sx={infoRowStyles}>
              <Typography variant="caption" color="error" fontWeight={700}>
                MENSAGEM DE ERRO
              </Typography>
              <Typography variant="body2" color="error">
                {log.errorMessage}
              </Typography>
            </Box>
          )}

          {hasDetailsPayload && (
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 0.75 }}>
                METADADOS ADICIONAIS
              </Typography>
              <Box component="pre" sx={jsonPreStyles}>
                {JSON.stringify(log.details, null, 2)}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={dialogActionsStyles}>
        <Button variant="outlined" onClick={onClose} sx={closeBtnStyles}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LogDetailsDialog

