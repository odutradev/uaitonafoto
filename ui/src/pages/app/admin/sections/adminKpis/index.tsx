import { Box, Card, Skeleton, Stack, Typography } from '@mui/material'
import {
  EventAvailableOutlined as EventIcon,
  MonetizationOnOutlined as MoneyIcon,
  PeopleAltOutlined as UsersIcon,
  PhotoCameraOutlined as PhotoIcon,
  StarsOutlined as CreditsIcon,
  WorkspacePremiumOutlined as PlanIcon
} from '@mui/icons-material'

import { kpiCardStyles, kpiGridStyles } from '../../styles'
import type { AdminMetrics } from '@actions/admin'

interface AdminKpisProps {
  metrics: AdminMetrics | null
  isLoading: boolean
}

const formatCurrencyBrl = (cents: number): string => {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

export const AdminKpis = ({ metrics, isLoading }: AdminKpisProps) => {
  if (isLoading || !metrics) {
    return (
      <Box sx={kpiGridStyles}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} elevation={0} sx={kpiCardStyles}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="40%" height={40} />
            <Skeleton variant="text" width="80%" height={20} />
          </Card>
        ))}
      </Box>
    )
  }

  const { users, events, plans } = metrics

  return (
    <Box sx={kpiGridStyles}>
      <Card elevation={0} sx={kpiCardStyles}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            USUÁRIOS TOTAIS
          </Typography>
          <UsersIcon fontSize="small" color="primary" />
        </Stack>
        <Typography variant="h4" fontWeight={800}>
          {users.total}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {users.admins} admin(s) • {users.trialClaimed} resgataram teste grátis
        </Typography>
      </Card>

      <Card elevation={0} sx={kpiCardStyles}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            EVENTOS NA PLATAFORMA
          </Typography>
          <EventIcon fontSize="small" color="success" />
        </Stack>
        <Typography variant="h4" fontWeight={800}>
          {events.total}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {events.active} ativos no momento • {events.closed} encerrados
        </Typography>
      </Card>

      <Card elevation={0} sx={kpiCardStyles}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            FOTOS COMPARTILHADAS
          </Typography>
          <PhotoIcon fontSize="small" color="secondary" />
        </Stack>
        <Typography variant="h4" fontWeight={800}>
          {events.totalPhotos.toLocaleString('pt-BR')}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Total de uploads recebidos nos eventos
        </Typography>
      </Card>

      <Card elevation={0} sx={kpiCardStyles}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            ASSINATURAS E PLANOS
          </Typography>
          <PlanIcon fontSize="small" color="info" />
        </Stack>
        <Typography variant="h4" fontWeight={800}>
          {plans.activeSubscriptions}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {plans.cancelledSubscriptions} canceladas • {plans.totalTransactions} pagamentos confirmados
        </Typography>
      </Card>

      <Card elevation={0} sx={kpiCardStyles}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            CRÉDITOS EM CIRCULAÇÃO
          </Typography>
          <CreditsIcon fontSize="small" color="warning" />
        </Stack>
        <Typography variant="h4" fontWeight={800}>
          {users.totalPaidCredits + users.totalFreeCredits}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {users.totalPaidCredits} pagos • {users.totalFreeCredits} cortesia / degustação
        </Typography>
      </Card>

      <Card elevation={0} sx={kpiCardStyles}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            RECEITA BRUTA ESTIMADA
          </Typography>
          <MoneyIcon fontSize="small" color="success" />
        </Stack>
        <Typography variant="h4" fontWeight={800}>
          {formatCurrencyBrl(plans.totalRevenue)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Total arrecadado em assinaturas e compras
        </Typography>
      </Card>
    </Box>
  )
}

export default AdminKpis

