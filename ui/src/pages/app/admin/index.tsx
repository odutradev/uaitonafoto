import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material'
import {
  AdminPanelSettings as AdminIcon,
  CalendarMonthOutlined as CalendarIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'

import useAdminDashboardPage, { AdminDashboardPageProvider } from './hook'

import type { AdminPeriod } from '@utils/types/admin'
import AdminCharts from './sections/adminCharts'
import AdminKpis from './sections/adminKpis'
import AdminUsersTable from './sections/adminUsersTable'
import AddCreditsDialog from './subcomponents/addCreditsDialog'
import { adminPageStyles, headerRowStyles, pageTitleStyles } from './styles'

const AdminDashboardContent = () => {
  const { period, setPeriod, isLoadingMetrics, isRefreshing, handleRefresh } = useAdminDashboardPage()

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

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center">
          <Select
            size="small"
            value={period}
            onChange={(e) => setPeriod(e.target.value as AdminPeriod)}
            disabled={isLoadingMetrics}
            startAdornment={<CalendarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />}
            sx={{ minWidth: 170, borderRadius: '10px' }}
          >
            <MenuItem value="7d">Últimos 7 dias</MenuItem>
            <MenuItem value="30d">Últimos 30 dias</MenuItem>
            <MenuItem value="90d">Últimos 90 dias</MenuItem>
            <MenuItem value="6m">Últimos 6 meses</MenuItem>
            <MenuItem value="12m">Últimos 12 meses</MenuItem>
            <MenuItem value="all">Todo o histórico</MenuItem>
          </Select>

          <Button
            variant="outlined"
            disabled={isRefreshing}
            onClick={handleRefresh}
            startIcon={isRefreshing ? <CircularProgress size={18} color="inherit" /> : <RefreshIcon />}
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
          >
            Atualizar dados
          </Button>
        </Stack>
      </Box>

      <AdminKpis />

      <AdminCharts />

      <AdminUsersTable />

      <AddCreditsDialog />
    </Box>
  )
}

export const AdminDashboard = () => (
  <AdminDashboardPageProvider>
    <AdminDashboardContent />
  </AdminDashboardPageProvider>
)

export default AdminDashboard

