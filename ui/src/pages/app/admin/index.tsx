import { Box, Button, CircularProgress, Typography } from '@mui/material'
import {
  AdminPanelSettings as AdminIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'

import useAdminDashboard from './hooks/useAdminDashboard'
import AdminCharts from './sections/adminCharts'
import AdminKpis from './sections/adminKpis'
import AdminUsersTable from './sections/adminUsersTable'
import AddCreditsDialog from './subcomponents/addCreditsDialog'
import { adminPageStyles, headerRowStyles, pageTitleStyles } from './styles'

export const AdminDashboard = () => {
  const {
    metrics,
    isLoadingMetrics,
    users,
    totalUsers,
    page,
    totalPages,
    isLoadingUsers,
    searchInput,
    setSearchInput,
    roleFilter,
    setRoleFilter,
    setPage,
    handleRefresh,
    selectedUserForCredits,
    isAddCreditsOpen,
    isSubmittingCredits,
    handleOpenAddCredits,
    handleCloseAddCredits,
    handleConfirmAddCredits
  } = useAdminDashboard()

  const isRefreshing = isLoadingMetrics || isLoadingUsers

  return (
    <Box sx={adminPageStyles}>
      <Box component="header" sx={headerRowStyles}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h3" component="h1" sx={pageTitleStyles}>
            <AdminIcon color="primary" fontSize="inherit" />
            Gestão geral do sistema
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Visão unificada da plataforma: métricas de eventos, planos e gestão centralizada de usuários e créditos.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          disabled={isRefreshing}
          onClick={handleRefresh}
          startIcon={isRefreshing ? <CircularProgress size={18} color="inherit" /> : <RefreshIcon />}
          sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
        >
          Atualizar dados
        </Button>
      </Box>

      <AdminKpis metrics={metrics} isLoading={isLoadingMetrics} />

      <AdminCharts metrics={metrics} isLoading={isLoadingMetrics} />

      <AdminUsersTable
        users={users}
        totalUsers={totalUsers}
        page={page}
        totalPages={totalPages}
        isLoading={isLoadingUsers}
        searchInput={searchInput}
        roleFilter={roleFilter}
        onSearchChange={setSearchInput}
        onRoleFilterChange={setRoleFilter}
        onPageChange={setPage}
        onAddCredits={handleOpenAddCredits}
      />

      <AddCreditsDialog
        open={isAddCreditsOpen}
        user={selectedUserForCredits}
        isSubmitting={isSubmittingCredits}
        onClose={handleCloseAddCredits}
        onConfirm={handleConfirmAddCredits}
      />
    </Box>
  )
}

export default AdminDashboard

