import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

import {
  addAdminUserCredits,
  getAdminMetrics,
  listAdminUsers,
  type AddCreditsPayload,
  type AdminMetrics,
  type AdminPeriod,
  type AdminUserItem
} from '@actions/admin'

export const useAdminDashboard = () => {
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
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all')

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
    try {
      setIsLoadingMetrics(true)
      const data = await getAdminMetrics({ period })
      setMetrics(data)
    } catch {
      toast.error('Não foi possível carregar as métricas administrativas.')
    } finally {
      setIsLoadingMetrics(false)
    }
  }, [period])

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoadingUsers(true)
      const res = await listAdminUsers({
        page,
        limit,
        search: debouncedSearch || undefined,
        role: roleFilter === 'all' ? undefined : roleFilter
      })
      setUsers(res.data)
      setTotalUsers(res.meta.total)
      setTotalPages(res.meta.totalPages || 1)
    } catch {
      toast.error('Erro ao listar usuários.')
    } finally {
      setIsLoadingUsers(false)
    }
  }, [page, limit, debouncedSearch, roleFilter])

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
    try {
      setIsSubmittingCredits(true)
      const res = await addAdminUserCredits(selectedUserForCredits.id, payload)
      toast.success(res.message || 'Créditos concedidos com sucesso!')
      handleCloseAddCredits()
      await Promise.all([fetchUsers(), fetchMetrics()])
    } catch (err: unknown) {
      let msg = 'Falha ao conceder créditos.'
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        msg = String(err.response.data.message)
      }
      toast.error(msg)
    } finally {
      setIsSubmittingCredits(false)
    }
  }

  return {
    period,
    setPeriod,
    metrics,
    isLoadingMetrics,
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
    setRoleFilter: (role: 'all' | 'admin' | 'user') => {
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

export default useAdminDashboard
