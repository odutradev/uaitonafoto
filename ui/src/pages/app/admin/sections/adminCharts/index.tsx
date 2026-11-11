import { Box, Card, Skeleton, Typography, useTheme } from '@mui/material'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import { chartCardStyles, chartsGridStyles } from '@pages/app/admin/styles'
import type { AdminMetrics } from '@actions/admin'

interface AdminChartsProps {
  metrics: AdminMetrics | null
  isLoading: boolean
}

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6']

export const AdminCharts = ({ metrics, isLoading }: AdminChartsProps) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
  const textColor = isDark ? '#94a3b8' : '#64748b'
  const tooltipBg = isDark ? '#1e293b' : '#ffffff'
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0'

  if (isLoading || !metrics) {
    return (
      <Box sx={chartsGridStyles}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} elevation={0} sx={chartCardStyles}>
            <Skeleton variant="text" width="40%" height={32} />
            <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: '12px' }} />
          </Card>
        ))}
      </Box>
    )
  }

  const { timeline, plans, events, users } = metrics

  const pieData = plans.distribution.length > 0
    ? plans.distribution
    : [
        { name: 'Planos Ativos', count: plans.activeSubscriptions || 1 },
        { name: 'Cancelados', count: plans.cancelledSubscriptions || 0 }
      ]

  const eventBarData = [
    { name: 'Ativos', valor: events.active, fill: '#10b981' },
    { name: 'Encerrados', valor: events.closed, fill: '#64748b' },
    { name: 'Média Fotos/Evt', valor: events.avgPhotosPerEvent, fill: '#6366f1' }
  ]

  const creditsPieData = [
    { name: 'Créditos Pagos', count: users.totalPaidCredits, fill: '#6366f1' },
    { name: 'Créditos Cortesia', count: users.totalFreeCredits, fill: '#f59e0b' }
  ]

  return (
    <Box sx={chartsGridStyles}>
      {/* Gráfico 1: Evolução da Plataforma */}
      <Card elevation={0} sx={chartCardStyles}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Evolução da plataforma
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Novos cadastros de usuários, eventos criados e transações no período
          </Typography>
        </Box>

        <Box sx={{ width: '100%', height: 300, mt: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="label" stroke={textColor} fontSize={12} tickLine={false} />
              <YAxis stroke={textColor} fontSize={12} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  borderRadius: 10,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  color: isDark ? '#fff' : '#000'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: 10, fontSize: 13 }} />
              <Area
                type="monotone"
                dataKey="newUsers"
                name="Novos Usuários"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
              <Area
                type="monotone"
                dataKey="newEvents"
                name="Novos Eventos"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorEvents)"
              />
              <Area
                type="monotone"
                dataKey="transactions"
                name="Transações Pagas"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTx)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Card>

      {/* Gráfico 2: Distribuição de Planos */}
      <Card elevation={0} sx={chartCardStyles}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Distribuição de planos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Proporção de assinaturas e planos contratados
          </Typography>
        </Box>

        <Box sx={{ width: '100%', height: 300, mt: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  borderRadius: 10,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  color: isDark ? '#fff' : '#000'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: 10, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Card>

      {/* Gráfico 3: Status dos Eventos e Engajamento */}
      <Card elevation={0} sx={chartCardStyles}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Status dos eventos e engajamento
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comparativo entre eventos ativos, encerrados e média de fotos
          </Typography>
        </Box>

        <Box sx={{ width: '100%', height: 300, mt: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={eventBarData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} />
              <YAxis stroke={textColor} fontSize={12} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  borderRadius: 10,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  color: isDark ? '#fff' : '#000'
                }}
              />
              <Bar dataKey="valor" name="Quantidade" radius={[8, 8, 0, 0]}>
                {eventBarData.map((entry, index) => (
                  <Cell key={`bar-cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Card>

      {/* Gráfico 4: Balanço de Créditos */}
      <Card elevation={0} sx={chartCardStyles}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Balanço de créditos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Proporção de créditos pagos vs créditos cortesia em circulação
          </Typography>
        </Box>

        <Box sx={{ width: '100%', height: 300, mt: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={creditsPieData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
              >
                {creditsPieData.map((entry, index) => (
                  <Cell key={`credit-cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  borderRadius: 10,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  color: isDark ? '#fff' : '#000'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: 10, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Card>
    </Box>
  )
}

export default AdminCharts
