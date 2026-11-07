import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { Refresh as RefreshIcon } from '@mui/icons-material'

import useLogs from './hooks/useLogs'
import LogsFilters from './sections/logsFilters'
import LogsTimeline from './sections/logsTimeline'
import LogDetailsDialog from './subcomponents/logDetailsDialog'
import { headerRowStyles, logsPageStyles, pageTitleStyles, refreshButtonStyles } from './styles'

const Logs = () => {
  const {
    isAdmin,
    logs,
    page,
    total,
    totalPages,
    searchInput,
    levelFilter,
    categoryFilter,
    scope,
    isLoading,
    hasActiveFilters,
    selectedLog,
    setSelectedLog,
    setSearchInput,
    handleLevelChange,
    handleCategoryChange,
    handleScopeChange,
    handleClearFilters,
    handlePageChange,
    handleRefresh
  } = useLogs()

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

      <LogsFilters
        isAdmin={isAdmin}
        searchInput={searchInput}
        levelFilter={levelFilter}
        categoryFilter={categoryFilter}
        scope={scope}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearchInput}
        onLevelChange={handleLevelChange}
        onCategoryChange={handleCategoryChange}
        onScopeChange={handleScopeChange}
        onClearFilters={handleClearFilters}
      />

      <LogsTimeline
        logs={logs}
        isAdmin={isAdmin}
        scope={scope}
        page={page}
        total={total}
        totalPages={totalPages}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onSelectLog={setSelectedLog}
      />

      <LogDetailsDialog
        log={selectedLog}
        isAdmin={isAdmin}
        onClose={() => setSelectedLog(null)}
      />
    </Box>
  )
}

export default Logs

