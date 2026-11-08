import {
  Box,
  Button,
  Card,
  Chip,
  Paper,
  Skeleton,
  Typography
} from '@mui/material'
import { VisibilityOutlined as InspectIcon } from '@mui/icons-material'

import Pagination from '@components/pagination'

import {
  detailsBtnStyles,
  emptyPaperStyles,
  getLogsStackStyles,
  logBadgesRowStyles,
  logCardStyles,
  logInfoColumnStyles,
  timelineSectionStyles
} from './styles'
import type { LogCategory, LogLevel } from '@actions/logs/types'
import type { LogsTimelineProps } from './types'

const formatDateTimePtBr = (isoDate: string): string => {
  const parsed = new Date(isoDate)
  if (Number.isNaN(parsed.getTime())) return isoDate
  return parsed.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getLevelMeta = (level: LogLevel) => {
  if (level === 'error') return { label: 'Erro', color: 'error' as const }
  if (level === 'warn') return { label: 'Alerta', color: 'warning' as const }
  return { label: 'Info', color: 'info' as const }
}

const getCategoryLabel = (category: LogCategory): string => {
  if (category === 'admin') return 'Admin'
  if (category === 'system') return 'Sistema'
  return 'Usuário'
}

const LogsTimeline = ({
  logs,
  isAdmin,
  scope,
  page,
  total,
  totalPages,
  isLoading,
  onPageChange,
  onSelectLog
}: LogsTimelineProps) => {
  const showUserBadge = isAdmin && scope === 'all'

  return (
    <Box component="section" sx={timelineSectionStyles}>
      <Typography variant="body2" color="text.secondary">
        Exibindo {logs.length} de {total} {total === 1 ? 'registro' : 'registros'}.
      </Typography>

      {isLoading && logs.length === 0 && (
        <Box sx={getLogsStackStyles(false)}>
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} variant="rounded" height={96} sx={{ borderRadius: '20px' }} />
          ))}
        </Box>
      )}

      {!isLoading && logs.length === 0 && (
        <Paper elevation={0} sx={emptyPaperStyles}>
          <Typography variant="h6" component="h2">
            Nenhum log registrado para esta busca
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tente ajustar os filtros acima ou realizar uma nova ação na plataforma.
          </Typography>
        </Paper>
      )}

      {logs.length > 0 && (
        <Box sx={getLogsStackStyles(isLoading)}>
          {logs.map((entry) => {
            const levelMeta = getLevelMeta(entry.level)

            return (
              <Card key={entry.id} elevation={0} sx={logCardStyles}>
                <Box sx={logInfoColumnStyles}>
                  <Box sx={logBadgesRowStyles}>
                    <Chip
                      size="small"
                      color={levelMeta.color}
                      label={levelMeta.label}
                      sx={{ fontWeight: 700 }}
                    />
                    <Typography variant="subtitle1" fontWeight={700}>
                      {entry.title}
                    </Typography>
                    {showUserBadge && (
                      <Chip size="small" variant="outlined" label={getCategoryLabel(entry.category)} />
                    )}
                  </Box>

                  {entry.description && (
                    <Typography variant="body2" color="text.secondary">
                      {entry.description}
                    </Typography>
                  )}

                  <Typography variant="caption" color="text.secondary">
                    {formatDateTimePtBr(entry.createdAt)}
                    {showUserBadge && entry.userEmail ? ` • ${entry.userName ? `${entry.userName} (${entry.userEmail})` : entry.userEmail}` : ''}
                    {entry.targetName ? ` • Alvo: ${entry.targetName}` : ''}
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<InspectIcon />}
                  onClick={() => onSelectLog(entry)}
                  sx={detailsBtnStyles}
                >
                  Ver detalhes
                </Button>
              </Card>
            )
          })}
        </Box>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        isLoading={isLoading}
        onPageChange={onPageChange}
      />
    </Box>
  )
}

export default LogsTimeline

