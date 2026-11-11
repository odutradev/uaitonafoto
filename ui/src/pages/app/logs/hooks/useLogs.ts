import { useCallback, useEffect, useState } from 'react'

import { getLogs } from '@actions/logs'
import useSystemStore from '@stores/system'
import useAuthStore from '@stores/auth'

import type { LogItem, LogScope } from '@utils/types/logs'
import type { LogCategoryFilter, LogLevelFilter, UseLogsReturn } from '@pages/app/logs/types'

const LOGS_PER_PAGE = 10
const SEARCH_DEBOUNCE_MS = 350

export const useLogs = (): UseLogsReturn => {
  const user = useAuthStore((state) => state.auth.user)
  const hasPermissions = useSystemStore((state) => state.hasPermissions)
  const isAdmin = hasPermissions(user?.role, ['view_all_logs'])
  const defaultScope: LogScope = isAdmin ? 'all' : 'me'

  const [logs, setLogs] = useState<LogItem[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const [searchInput, setSearchInputState] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState<LogLevelFilter>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<LogCategoryFilter>('ALL')
  const [scope, setScope] = useState<LogScope>(defaultScope)

  const [isLoading, setIsLoading] = useState(true)
  const [selectedLog, setSelectedLog] = useState<LogItem | null>(null)
  const [refreshTick, setRefreshTick] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim())
      setPage(1)
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    getLogs({
      page,
      limit: LOGS_PER_PAGE,
      level: levelFilter === 'ALL' ? undefined : levelFilter,
      category: categoryFilter === 'ALL' ? undefined : categoryFilter,
      search: debouncedSearch || undefined,
      scope: isAdmin ? scope : 'me'
    })
      .then((response) => {
        if (!isMounted) return
        setLogs(response.data)
        setTotal(response.meta.total)
        setTotalPages(Math.max(1, response.meta.totalPages))
      })
      .catch(() => {
        if (!isMounted) return
        setLogs([])
        setTotal(0)
        setTotalPages(1)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [categoryFilter, debouncedSearch, isAdmin, levelFilter, page, refreshTick, scope])

  const setSearchInput = useCallback((value: string) => {
    setSearchInputState(value)
  }, [])

  const handleLevelChange = useCallback((nextLevel: LogLevelFilter) => {
    setLevelFilter(nextLevel)
    setPage(1)
  }, [])

  const handleCategoryChange = useCallback((nextCategory: LogCategoryFilter) => {
    setCategoryFilter(nextCategory)
    setPage(1)
  }, [])

  const handleScopeChange = useCallback((nextScope: LogScope) => {
    setScope(nextScope)
    setPage(1)
  }, [])

  const handleClearFilters = useCallback(() => {
    setSearchInputState('')
    setDebouncedSearch('')
    setLevelFilter('ALL')
    setCategoryFilter('ALL')
    setScope(defaultScope)
    setPage(1)
  }, [defaultScope])

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage)
  }, [])

  const handleRefresh = useCallback(() => {
    setRefreshTick((prev) => prev + 1)
  }, [])

  const hasActiveFilters =
    Boolean(searchInput.trim()) ||
    levelFilter !== 'ALL' ||
    categoryFilter !== 'ALL' ||
    (isAdmin && scope !== defaultScope)

  return {
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
  }
}

export default useLogs

