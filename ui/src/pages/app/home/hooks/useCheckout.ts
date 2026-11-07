import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
  cancelSubscription,
  createCheckout,
  getMySubscriptions,
  getPlans
} from '@actions/payments'
import { getMeData } from '@actions/auth'
import useQueryParams from '@hooks/useQueryParams'
import useAuthStore from '@stores/auth'
import { formatPlanCard } from '@pages/public/landingPage/sections/plans/utils'

import type { SubscriptionItem } from '@actions/payments/types'
import type { PlanCardData } from '@pages/public/landingPage/sections/plans/types'
import type { CheckoutQueryParams, UseCheckoutReturn } from './types'

const FREE_PLAN_ID = 'free_trial'
const CREDITS_REFRESH_ATTEMPTS = 5
const CREDITS_REFRESH_INTERVAL_MS = 2000

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const useCheckout = (): UseCheckoutReturn => {
  const navigate = useNavigate()
  const { checkout, payment } = useQueryParams<CheckoutQueryParams>()
  const user = useAuthStore((state) => state.auth.user)
  const updateUser = useAuthStore((state) => state.updateUser)
  const handledParamsRef = useRef('')

  const [plans, setPlans] = useState<PlanCardData[]>([])
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([])
  const [isLoadingPlans, setIsLoadingPlans] = useState(true)
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

  useEffect(() => {
    let isMounted = true

    getPlans()
      .then((items) => {
        if (isMounted) setPlans(items.filter((item) => item.type !== 'FREE').map(formatPlanCard))
      })
      .catch(() => {
        if (isMounted) setPlans([])
      })
      .finally(() => {
        if (isMounted) setIsLoadingPlans(false)
      })

    loadSubscriptions()

    return () => {
      isMounted = false
    }
  }, [loadSubscriptions])

  const startCheckout = useCallback(async (planId: string) => {
    setCheckoutPlanId(planId)

    try {
      const { checkoutUrl } = await createCheckout(planId)
      window.location.assign(checkoutUrl)
    } catch {
      toast.error('Não foi possível iniciar o pagamento. Tente novamente.')
      setCheckoutPlanId(null)
    }
  }, [])

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

  const refreshCredits = useCallback(async (initialPaidCredits: number) => {
    for (let attempt = 0; attempt < CREDITS_REFRESH_ATTEMPTS; attempt++) {
      await wait(CREDITS_REFRESH_INTERVAL_MS)

      try {
        const [freshUser, freshSubscriptions] = await Promise.all([
          getMeData(),
          getMySubscriptions()
        ])
        updateUser(freshUser)
        setSubscriptions(freshSubscriptions)
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

    if (checkout && checkout !== FREE_PLAN_ID) {
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
    isLoadingPlans,
    checkoutPlanId,
    cancellingSubscriptionId,
    startCheckout,
    handleCancelSubscription
  }
}

export default useCheckout
