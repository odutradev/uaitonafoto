import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { addAdminUserCredits, getAdminMetrics, listAdminUsers } from '@actions/admin'
import createPageContext from '@utils/functions/createPageContext'
import useAction from '@hooks/useAction'

import type { AddCreditsPayload, AdminMetrics, AdminPeriod, AdminUserItem } from '@utils/types/admin'
import type { AdminRoleFilter, UseAdminDashboardPageReturn } from './types'

const useAdminDashboardPageState = (): UseAdminDashboardPageReturn => {
  const runAction = useAction()
  const [period, setPeriod] = useState<AdminPeriod>('30d')
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null)
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true)

  const [users, setUsers] = useState<AdminUserItem[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)

  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<AdminRoleFilter>('all')

  const [selectedUserForCredits, setSelectedUserForCredits] = useState<AdminUserItem | null>(null)
  const [isAddCreditsOpen, setIsAddCreditsOpen] = useState(false)
  const [isSubmittingCredits, setIsSubmittingCredits] = useState(false)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput.trim())
      setPage(1)
    }, 400)
    return () => clearTimeout(handler)
  }, [searchInput])

  const fetchMetrics = useCallback(async () => {
    setIsLoadingMetrics(true)
    await runAction({
      action: () => getAdminMetrics({ period }),
      toastMessages: { error: 'Não foi possível carregar as métricas administrativas.' },
      shouldUseApiError: false,
      callback: setMetrics
    })
    setIsLoadingMetrics(false)
  }, [period, runAction])

  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true)
    await runAction({
      action: () =>
        listAdminUsers({
          page,
          limit,
          search: debouncedSearch || undefined,
          role: roleFilter === 'all' ? undefined : roleFilter
        }),
      toastMessages: { error: 'Erro ao listar usuários.' },
      shouldUseApiError: false,
      callback: (res) => {
        setUsers(res.data)
        setTotalUsers(res.meta.total)
        setTotalPages(res.meta.totalPages || 1)
      }
    })
    setIsLoadingUsers(false)
  }, [page, limit, debouncedSearch, roleFilter, runAction])

  useEffect(() => {
    fetchMetrics()
  }, [fetchMetrics])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleRefresh = async () => {
    await Promise.all([fetchMetrics(), fetchUsers()])
    toast.info('Dados administrativos atualizados.')
  }

  const handleOpenAddCredits = (user: AdminUserItem) => {
    setSelectedUserForCredits(user)
    setIsAddCreditsOpen(true)
  }

  const handleCloseAddCredits = () => {
    setIsAddCreditsOpen(false)
    setSelectedUserForCredits(null)
  }

  const handleConfirmAddCredits = async (payload: AddCreditsPayload) => {
    if (!selectedUserForCredits) return
    setIsSubmittingCredits(true)
    await runAction({
      action: () => addAdminUserCredits(selectedUserForCredits.id, payload),
      toastMessages: { success: `${payload.amount} crédito(s) adicionado(s) com sucesso.`, error: 'Falha ao conceder créditos.' },
      callback: async () => {
        handleCloseAddCredits()
        await Promise.all([fetchUsers(), fetchMetrics()])
      }
    })
    setIsSubmittingCredits(false)
  }

  return {
    period,
    setPeriod,
    metrics,
    isLoadingMetrics,
    isRefreshing: isLoadingMetrics || isLoadingUsers,
    users,
    totalUsers,
    page,
    limit,
    totalPages,
    setLimit: (newLimit: number) => {
      setLimit(newLimit)
      setPage(1)
    },
    isLoadingUsers,
    searchInput,
    setSearchInput,
    roleFilter,
    setRoleFilter: (role: AdminRoleFilter) => {
      setRoleFilter(role)
      setPage(1)
    },
    setPage,
    handleRefresh,
    selectedUserForCredits,
    isAddCreditsOpen,
    isSubmittingCredits,
    handleOpenAddCredits,
    handleCloseAddCredits,
    handleConfirmAddCredits
  }
}


const { PageProvider: AdminDashboardPageProvider, usePage: useAdminDashboardPage } = createPageContext(
  useAdminDashboardPageState,
  'useAdminDashboardPage'
)

export { AdminDashboardPageProvider }
export default useAdminDashboardPage
