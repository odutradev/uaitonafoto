import axios from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { getMeData } from '@actions/auth'
import {
  cancelSubscription,
  claimFreeTrial,
  createCheckout,
  getMyCreditUsages,
  getMyPurchases,
  getMySubscriptions,
  getMyTransactions,
  getPlans
} from '@actions/payments'
import useQueryParams from '@hooks/useQueryParams'
import useAuthStore from '@stores/auth'

import type {
  CreditUsageItem,
  PlanApiItem,
  PurchaseItem,
  SubscriptionItem,
  TransactionItem
} from '@actions/payments/types'
import type {
  BillingQueryParams,
  TransactionDirectionFilter,
  TransactionStatusFilter,
  TransactionTypeFilter,
  UseBillingReturn
} from '../types'

const FREE_PLAN_ID = 'free_trial'
const TRANSACTIONS_FETCH_LIMIT = 100
const CREDITS_REFRESH_ATTEMPTS = 5
const CREDITS_REFRESH_INTERVAL_MS = 2000

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const useBilling = (): UseBillingReturn => {
  const navigate = useNavigate()
  const { checkout, payment } = useQueryParams<BillingQueryParams>()
  const user = useAuthStore((state) => state.auth.user)
  const updateUser = useAuthStore((state) => state.updateUser)

  const handledParamsRef = useRef('')
  const isInitialFreeTrialRef = useRef(checkout === FREE_PLAN_ID)

  const [plans, setPlans] = useState<PlanApiItem[]>([])
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([])
  const [purchases, setPurchases] = useState<PurchaseItem[]>([])
  const [creditUsages, setCreditUsages] = useState<CreditUsageItem[]>([])
  const [transactions, setTransactions] = useState<TransactionItem[]>([])
  const [transactionsPage, setTransactionsPage] = useState(1)
  const [transactionsTotal, setTransactionsTotal] = useState(0)
  const [transactionsTotalPages, setTransactionsTotalPages] = useState(1)

  const [statusFilter, setStatusFilter] = useState<TransactionStatusFilter>('ALL')
  const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>('ALL')
  const [directionFilter, setDirectionFilter] = useState<TransactionDirectionFilter>('ALL')

  const [isLoadingInitial, setIsLoadingInitial] = useState(true)
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)
  const [checkoutPlanId, setCheckoutPlanId] = useState<string | null>(null)
  const [cancellingSubscriptionId, setCancellingSubscriptionId] = useState<string | null>(null)
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionItem | null>(null)
  const [confirmingPlan, setConfirmingPlan] = useState<PlanApiItem | null>(null)
  const [pendingCheckoutPlanId, setPendingCheckoutPlanId] = useState<string | null>(null)

  const loadTransactions = useCallback(
    async (page: number, status: TransactionStatusFilter, planType: TransactionTypeFilter) => {
      setIsLoadingTransactions(true)
      try {
        const response = await getMyTransactions({
          page: 1,
          limit: TRANSACTIONS_FETCH_LIMIT,
          status: status === 'ALL' ? undefined : status,
          planType: planType === 'ALL' ? undefined : planType
        })
        setTransactions(response.data)
        setTransactionsPage(page)
        setTransactionsTotal(response.meta.total)
        setTransactionsTotalPages(Math.max(1, response.meta.totalPages))
      } catch {
        setTransactions([])
        setTransactionsTotal(0)
        setTransactionsTotalPages(1)
      } finally {
        setIsLoadingTransactions(false)
      }
    },
    []
  )

  const loadSummaryData = useCallback(async () => {
    const [plansResult, subsResult, purchasesResult, creditUsagesResult] = await Promise.allSettled([
      getPlans(),
      getMySubscriptions(),
      getMyPurchases(),
      getMyCreditUsages()
    ])

    if (plansResult.status === 'fulfilled') setPlans(plansResult.value)
    if (subsResult.status === 'fulfilled') setSubscriptions(subsResult.value)
    if (purchasesResult.status === 'fulfilled') setPurchases(purchasesResult.value)
    if (creditUsagesResult.status === 'fulfilled') setCreditUsages(creditUsagesResult.value)
  }, [])

  useEffect(() => {
    let isMounted = true

    const bootstrap = async () => {
      if (!isInitialFreeTrialRef.current) {
        getMeData().then(updateUser).catch(() => undefined)
      }

      await Promise.all([loadSummaryData(), loadTransactions(1, 'ALL', 'ALL')])
      if (isMounted) setIsLoadingInitial(false)
    }

    bootstrap()

    return () => {
      isMounted = false
    }
  }, [loadSummaryData, loadTransactions, updateUser])

  const handleRefreshAll = useCallback(async () => {
    setIsLoadingTransactions(true)
    try {
      const freshUserPromise = getMeData().then(updateUser).catch(() => undefined)
      await Promise.all([
        freshUserPromise,
        loadSummaryData(),
        loadTransactions(transactionsPage, statusFilter, typeFilter)
      ])
    } finally {
      setIsLoadingTransactions(false)
    }
  }, [loadSummaryData, loadTransactions, statusFilter, transactionsPage, typeFilter, updateUser])

  const handleStatusFilterChange = useCallback(
    (nextStatus: TransactionStatusFilter) => {
      setStatusFilter(nextStatus)
      setTransactionsPage(1)
      loadTransactions(1, nextStatus, typeFilter)
    },
    [loadTransactions, typeFilter]
  )

  const handleTypeFilterChange = useCallback(
    (nextType: TransactionTypeFilter) => {
      setTypeFilter(nextType)
      setTransactionsPage(1)
      loadTransactions(1, statusFilter, nextType)
    },
    [loadTransactions, statusFilter]
  )

  const handleDirectionFilterChange = useCallback((nextDirection: TransactionDirectionFilter) => {
    setDirectionFilter(nextDirection)
    setTransactionsPage(1)
  }, [])

  const handlePageChange = useCallback((nextPage: number) => {
    setTransactionsPage(nextPage)
  }, [])

  const startCheckout = useCallback(
    async (planId: string) => {
      setCheckoutPlanId(planId)

      if (planId === FREE_PLAN_ID) {
        try {
          const { user: updatedUser } = await claimFreeTrial()
          updateUser(updatedUser)
          const freshPurchases = await getMyPurchases().catch(() => [])
          setPurchases(freshPurchases)
          toast.success('Teste Grátis ativado! Você recebeu 1 crédito grátis.')
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 409) {
            getMeData().then(updateUser).catch(() => undefined)
            toast.info('Você já resgatou o Teste Grátis nesta conta.')
          } else {
            toast.error('Não foi possível ativar o Teste Grátis. Tente novamente.')
          }
        } finally {
          setCheckoutPlanId(null)
        }
        return
      }

      try {
        const { checkoutUrl } = await createCheckout(planId)
        window.location.assign(checkoutUrl)
      } catch (error) {
        const apiMessage =
          axios.isAxiosError(error) && typeof error.response?.data?.message === 'string'
            ? error.response.data.message
            : 'Não foi possível iniciar o pagamento. Tente novamente.'
        toast.error(apiMessage)
        setCheckoutPlanId(null)
      }
    },
    [updateUser]
  )

  const handleOpenCheckoutConfirmation = useCallback(
    (planIdOrPlan: string | PlanApiItem) => {
      if (typeof planIdOrPlan === 'object') {
        if (planIdOrPlan.id === FREE_PLAN_ID || planIdOrPlan.abacateProductId === FREE_PLAN_ID) {
          startCheckout(FREE_PLAN_ID)
          return
        }
        setConfirmingPlan(planIdOrPlan)
        return
      }

      if (planIdOrPlan === FREE_PLAN_ID) {
        startCheckout(FREE_PLAN_ID)
        return
      }

      const found = plans.find(
        (p) =>
          p.id === planIdOrPlan ||
          p.abacateProductId === planIdOrPlan ||
          p.ctaHref === planIdOrPlan
      )

      if (found) {
        setConfirmingPlan(found)
      } else {
        setPendingCheckoutPlanId(planIdOrPlan)
      }
    },
    [plans, startCheckout]
  )

  const handleCloseCheckoutConfirmation = useCallback(() => {
    setConfirmingPlan(null)
    setPendingCheckoutPlanId(null)
  }, [])

  const handleConfirmCheckout = useCallback(async () => {
    if (!confirmingPlan) return
    const planId = confirmingPlan.ctaHref || confirmingPlan.id || confirmingPlan.abacateProductId
    await startCheckout(planId)
  }, [confirmingPlan, startCheckout])

  useEffect(() => {
    if (!pendingCheckoutPlanId || plans.length === 0) return

    const found = plans.find(
      (p) =>
        p.id === pendingCheckoutPlanId ||
        p.abacateProductId === pendingCheckoutPlanId ||
        p.ctaHref === pendingCheckoutPlanId
    )

    if (found) {
      setConfirmingPlan(found)
      setPendingCheckoutPlanId(null)
    }
  }, [pendingCheckoutPlanId, plans])

  const handleCancelSubscription = useCallback(async (subscriptionId: string): Promise<boolean> => {
    setCancellingSubscriptionId(subscriptionId)

    try {
      const updated = await cancelSubscription(subscriptionId)
      setSubscriptions((prev) => prev.map((sub) => (sub.id === updated.id ? updated : sub)))
      await loadTransactions(1, statusFilter, typeFilter)
      toast.success('Assinatura cancelada com sucesso. Seus créditos atuais seguem disponíveis.')
      return true
    } catch {
      toast.error('Não foi possível cancelar a assinatura. Tente novamente.')
      return false
    } finally {
      setCancellingSubscriptionId(null)
    }
  }, [loadTransactions, statusFilter, typeFilter])

  const pollPostPaymentUpdate = useCallback(
    async (initialPaidCredits: number) => {
      for (let attempt = 0; attempt < CREDITS_REFRESH_ATTEMPTS; attempt++) {
        await wait(CREDITS_REFRESH_INTERVAL_MS)

        try {
          const [freshUser, freshSubs, freshPurchases, freshTransactions] = await Promise.all([
            getMeData(),
            getMySubscriptions(),
            getMyPurchases(),
            getMyTransactions({ page: 1, limit: TRANSACTIONS_FETCH_LIMIT })
          ])

          updateUser(freshUser)
          setSubscriptions(freshSubs)
          setPurchases(freshPurchases)
          setTransactions(freshTransactions.data)
          setTransactionsPage(freshTransactions.meta.page)
          setTransactionsTotal(freshTransactions.meta.total)
          setTransactionsTotalPages(Math.max(1, freshTransactions.meta.totalPages))
          setStatusFilter('ALL')
          setTypeFilter('ALL')

          if (freshUser.paidCredits > initialPaidCredits) return
        } catch {
          return
        }
      }
    },
    [updateUser]
  )

  useEffect(() => {
    const paramsKey = `${checkout ?? ''}|${payment ?? ''}`
    if (paramsKey === '|') {
      handledParamsRef.current = ''
      return
    }

    if (handledParamsRef.current === paramsKey) return

    handledParamsRef.current = paramsKey
    navigate('/app/billing', { replace: true })

    if (checkout) {
      if (checkout === FREE_PLAN_ID) {
        startCheckout(FREE_PLAN_ID)
      } else {
        handleOpenCheckoutConfirmation(checkout)
      }
      return
    }

    if (payment === 'success') {
      toast.success('Pagamento confirmado! Atualizando seus créditos e faturas...')
      pollPostPaymentUpdate(user?.paidCredits ?? 0)
      return
    }

    if (payment === 'cancelled') {
      toast.info('Checkout não concluído. Você pode retomar ou escolher outra opção abaixo.')
      loadTransactions(1, statusFilter, typeFilter)
    }
  }, [
    checkout,
    handleOpenCheckoutConfirmation,
    loadTransactions,
    navigate,
    payment,
    pollPostPaymentUpdate,
    startCheckout,
    statusFilter,
    typeFilter,
    user?.paidCredits
  ])

  return {
    user,
    plans,
    subscriptions,
    purchases,
    creditUsages,
    transactions,
    transactionsPage,
    transactionsTotal,
    transactionsTotalPages,
    statusFilter,
    typeFilter,
    directionFilter,
    isLoadingInitial,
    isLoadingTransactions,
    checkoutPlanId,
    cancellingSubscriptionId,
    selectedTransaction,
    confirmingPlan,
    setSelectedTransaction,
    handleStatusFilterChange,
    handleTypeFilterChange,
    handleDirectionFilterChange,
    handlePageChange,
    handleRefreshAll,
    startCheckout,
    handleOpenCheckoutConfirmation,
    handleCloseCheckoutConfirmation,
    handleConfirmCheckout,
    handleCancelSubscription
  }
}

export default useBilling
