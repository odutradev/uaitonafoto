import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { createCheckout, getPlans } from '@actions/payments'
import { formatPlanCard } from '@pages/public/landingPage/sections/plans/utils'

import type { PlanCardData } from '@pages/public/landingPage/sections/plans/types'
import type { UseCheckoutReturn } from './types'

export const useCheckout = (): UseCheckoutReturn => {
  const [plans, setPlans] = useState<PlanCardData[]>([])
  const [isLoadingPlans, setIsLoadingPlans] = useState(true)
  const [checkoutPlanId, setCheckoutPlanId] = useState<string | null>(null)

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

    return () => {
      isMounted = false
    }
  }, [])

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

  return { plans, isLoadingPlans, checkoutPlanId, startCheckout }
}

export default useCheckout
