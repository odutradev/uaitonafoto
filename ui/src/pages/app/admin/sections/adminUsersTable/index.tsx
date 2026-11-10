import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import {
  AddCircleOutline as AddCreditsIcon,
  Search as SearchIcon
} from '@mui/icons-material'

import { filterRowStyles, tableCardStyles, tableContainerStyles } from '../../styles'
import type { AdminUserItem } from '@actions/admin'

interface AdminUsersTableProps {
  users: AdminUserItem[]
  totalUsers: number
  page: number
  totalPages: number
  isLoading: boolean
  searchInput: string
  roleFilter: 'all' | 'admin' | 'user'
  onSearchChange: (value: string) => void
  onRoleFilterChange: (role: 'all' | 'admin' | 'user') => void
  onPageChange: (newPage: number) => void
  onAddCredits: (user: AdminUserItem) => void
}

const formatDatePtBr = (isoDate?: string): string => {
  if (!isoDate) return '-'
  const parsed = new Date(isoDate)
  if (Number.isNaN(parsed.getTime())) return '-'
  return parsed.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export const AdminUsersTable = ({
  users,
  totalUsers,
  page,
  totalPages,
  isLoading,
  searchInput,
  roleFilter,
  onSearchChange,
  onRoleFilterChange,
  onPageChange,
  onAddCredits
}: AdminUsersTableProps) => {
  return (
    <Card elevation={0} sx={tableCardStyles}>
      <Box sx={filterRowStyles}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Gestão de usuários ({totalUsers})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consulte contas cadastradas, planos contratados e conceda créditos
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center">
          <TextField
            size="small"
            placeholder="Buscar por nome ou e-mail..."
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              )
            }}
            sx={{ minWidth: { xs: '100%', sm: 260 } }}
          />

          <Select
            size="small"
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value as 'all' | 'admin' | 'user')}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="all">Todos os papéis</MenuItem>
            <MenuItem value="admin">Administradores</MenuItem>
            <MenuItem value="user">Usuários</MenuItem>
          </Select>
        </Stack>
      </Box>

      <TableContainer sx={tableContainerStyles}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell sx={{ fontWeight: 700 }}>Usuário</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Papel</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Plano / Assinatura</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Saldo de Créditos</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Cadastro</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={32} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Carregando usuários...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" fontWeight={600}>
                    Nenhum usuário encontrado
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tente ajustar os filtros ou termo de busca.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const displayName = user.fullName || user.name
                const isAdmin = user.role === 'admin'

                return (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar src={user.photoUrl} alt={displayName} sx={{ width: 38, height: 38 }}>
                          {displayName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="subtitle2" fontWeight={700} noWrap>
                            {displayName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap display="block">
                            {user.email}
                          </Typography>
                          {user.phone && (
                            <Typography variant="caption" color="text.disabled" display="block">
                              Tel: {user.phone}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        color={isAdmin ? 'secondary' : 'default'}
                        variant={isAdmin ? 'filled' : 'outlined'}
                        label={isAdmin ? 'Admin' : 'Usuário'}
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>

                    <TableCell>
                      {user.hasActiveSubscription ? (
                        <Chip
                          size="small"
                          color="primary"
                          label={user.planName || 'Assinatura Ativa'}
                          sx={{ fontWeight: 600 }}
                        />
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Sem plano ativo
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          size="small"
                          color="primary"
                          variant="outlined"
                          label={`${user.paidCredits} pago(s)`}
                          sx={{ fontWeight: 600 }}
                        />
                        {user.freeCredits > 0 && (
                          <Chip
                            size="small"
                            color="default"
                            label={`${user.freeCredits} cortesia`}
                            sx={{ fontWeight: 600 }}
                          />
                        )}
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDatePtBr(user.createdAt)}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="Conceder créditos a este usuário">
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          startIcon={<AddCreditsIcon fontSize="small" />}
                          onClick={() => onAddCredits(user)}
                          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px' }}
                        >
                          + Créditos
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => onPageChange(newPage)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Card>
  )
}

export default AdminUsersTable
