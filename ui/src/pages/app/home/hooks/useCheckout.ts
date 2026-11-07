import axios from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
  cancelSubscription,
  claimFreeTrial,
  createCheckout,
  getMySubscriptions,
  getMyTransactions,
  getPlans
} from '@actions/payments'
import { getMeData } from '@actions/auth'
import useQueryParams from '@hooks/useQueryParams'
import useAuthStore from '@stores/auth'
import { formatPlanCard } from '@pages/public/landingPage/sections/plans/utils'

import type { SubscriptionItem, TransactionItem } from '@actions/payments/types'
import type { PlanCardData } from '@pages/public/landingPage/sections/plans/types'
import type { CheckoutQueryParams, UseCheckoutReturn } from './types'

const FREE_PLAN_ID = 'free_trial'
const CREDITS_REFRESH_ATTEMPTS = 5
const CREDITS_REFRESH_INTERVAL_MS = 2000
const INVOICES_PER_PAGE = 5

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const useCheckout = (): UseCheckoutReturn => {
  const navigate = useNavigate()
  const { checkout, payment } = useQueryParams<CheckoutQueryParams>()
  const user = useAuthStore((state) => state.auth.user)
  const updateUser = useAuthStore((state) => state.updateUser)
  const handledParamsRef = useRef('')
  const isInitialFreeTrialCheckoutRef = useRef(checkout === FREE_PLAN_ID)

  const [plans, setPlans] = useState<PlanCardData[]>([])
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([])
  const [invoices, setInvoices] = useState<TransactionItem[]>([])
  const [invoicesPage, setInvoicesPage] = useState(1)
  const [invoicesTotalPages, setInvoicesTotalPages] = useState(1)
  const [isLoadingPlans, setIsLoadingPlans] = useState(true)
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false)
  const [checkoutPlanId, setCheckoutPlanId] = useState<string | null>(null)
  const [cancellingSubscriptionId, setCancellingSubscriptionId] = useState<string | null>(null)

  const loadSubscriptions = useCallback(async () => {
    try {
      const items = await getMySubscriptions()
      setSubscriptions(items)
    } catch {
      setSubscriptions([])
    }
  }, [])

  const loadInvoices = useCallback(async (targetPage: number) => {
    setIsLoadingInvoices(true)
    try {
      const response = await getMyTransactions({
        page: targetPage,
        limit: INVOICES_PER_PAGE,
        status: 'PAID'
      })
      setInvoices(response.data)
      setInvoicesPage(response.meta.page)
      setInvoicesTotalPages(response.meta.totalPages)
    } catch {
      setInvoices([])
    } finally {
      setIsLoadingInvoices(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    if (!isInitialFreeTrialCheckoutRef.current) {
      getMeData().then(updateUser).catch(() => undefined)
    }

    getPlans()
      .then((items) => {
        if (isMounted) setPlans(items.map(formatPlanCard))
      })
      .catch(() => {
        if (isMounted) setPlans([])
      })
      .finally(() => {
        if (isMounted) setIsLoadingPlans(false)
      })

    loadSubscriptions()
    loadInvoices(1)

    return () => {
      isMounted = false
    }
  }, [loadSubscriptions, loadInvoices, updateUser])

  const startCheckout = useCallback(async (planId: string) => {
    setCheckoutPlanId(planId)

    if (planId === FREE_PLAN_ID) {
      try {
        const { user: updatedUser } = await claimFreeTrial()
        updateUser(updatedUser)
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
    } catch {
      toast.error('Não foi possível iniciar o pagamento. Tente novamente.')
      setCheckoutPlanId(null)
    }
  }, [updateUser])

  const handleCancelSubscription = useCallback(async (subscriptionId: string): Promise<boolean> => {
    setCancellingSubscriptionId(subscriptionId)

    try {
      const updated = await cancelSubscription(subscriptionId)
      setSubscriptions((prev) => prev.map((sub) => (sub.id === updated.id ? updated : sub)))
      toast.success('Assinatura cancelada com sucesso.')
      return true
    } catch {
      toast.error('Não foi possível cancelar a assinatura. Tente novamente.')
      return false
    } finally {
      setCancellingSubscriptionId(null)
    }
  }, [])

  const handleInvoicesPageChange = useCallback(
    (nextPage: number) => {
      loadInvoices(nextPage)
    },
    [loadInvoices]
  )

  const refreshCredits = useCallback(async (initialPaidCredits: number) => {
    for (let attempt = 0; attempt < CREDITS_REFRESH_ATTEMPTS; attempt++) {
      await wait(CREDITS_REFRESH_INTERVAL_MS)

      try {
        const [freshUser, freshSubscriptions, freshInvoices] = await Promise.all([
          getMeData(),
          getMySubscriptions(),
          getMyTransactions({ page: 1, limit: INVOICES_PER_PAGE, status: 'PAID' })
        ])
        updateUser(freshUser)
        setSubscriptions(freshSubscriptions)
        setInvoices(freshInvoices.data)
        setInvoicesPage(freshInvoices.meta.page)
        setInvoicesTotalPages(freshInvoices.meta.totalPages)
        if (freshUser.paidCredits > initialPaidCredits) return
      } catch {
        return
      }
    }
  }, [updateUser])

  useEffect(() => {
    const paramsKey = `${checkout ?? ''}|${payment ?? ''}`
    if (paramsKey === '|') {
      handledParamsRef.current = ''
      return
    }

    if (handledParamsRef.current === paramsKey) return

    handledParamsRef.current = paramsKey
    navigate('/app', { replace: true })

    if (checkout) {
      startCheckout(checkout)
      return
    }

    if (payment === 'success') {
      toast.success('Pagamento recebido! Estamos atualizando seus créditos.')
      refreshCredits(user?.paidCredits ?? 0)
      return
    }

    if (payment === 'cancelled') {
      toast.info('Pagamento cancelado. Você pode tentar novamente quando quiser.')
    }
  }, [checkout, payment, navigate, startCheckout, refreshCredits, user?.paidCredits])

  return {
    plans,
    subscriptions,
    invoices,
    invoicesPage,
    invoicesTotalPages,
    isLoadingPlans,
    isLoadingInvoices,
    checkoutPlanId,
    cancellingSubscriptionId,
    startCheckout,
    handleCancelSubscription,
    handleInvoicesPageChange
  }
}

export default useCheckout
