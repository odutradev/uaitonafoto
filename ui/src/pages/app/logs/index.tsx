import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { Refresh as RefreshIcon } from '@mui/icons-material'

import useLogsPage, { LogsPageProvider } from './hook'
import LogsFilters from './sections/logsFilters'
import LogsTimeline from './sections/logsTimeline'
import LogDetailsDialog from './subcomponents/logDetailsDialog'
import { headerRowStyles, logsPageStyles, pageTitleStyles, refreshButtonStyles } from './styles'

const LogsContent = () => {
  const { isAdmin, isLoading, handleRefresh } = useLogsPage()

  return (
    <Box sx={logsPageStyles}>
      <Box component="header" sx={headerRowStyles}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h3" component="h1" sx={pageTitleStyles}>
            {isAdmin ? 'Logs de auditoria e atividades' : 'Logs de atividades'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isAdmin
              ? 'Monitore eventos do sistema, autenticações, alterações de perfil e confirmações de pagamento.'
              : 'Acompanhe o histórico de acessos, atualizações cadastrais e movimentações da sua conta.'}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          disabled={isLoading}
          onClick={handleRefresh}
          startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <RefreshIcon />}
          sx={refreshButtonStyles}
        >
          Atualizar
        </Button>
      </Box>

      <LogsFilters />

      <LogsTimeline />

      <LogDetailsDialog />
    </Box>
  )
}

const Logs = () => (
  <LogsPageProvider>
    <LogsContent />
  </LogsPageProvider>
)

export default Logs
