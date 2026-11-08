import { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'

import { getPlans } from '@actions/payments'
import { trackEvent } from '@actions/auth/firebase'
import useAuth from '@hooks/useAuth'
import type { PlanApiItem } from '@actions/payments/types'

import landingPageData from '../data'
import { formatPlanCard } from '../sections/plans/utils'
import type { PlanCardData } from '../sections/plans/types'
import type { UseLandingPageReturn } from './types'

export const useLandingPage = (): UseLandingPageReturn => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const { user } = useAuth()

  const [isLoadingPlans, setIsLoadingPlans] = useState(true)
  const [plans, setPlans] = useState<PlanCardData[]>([])

  useEffect(() => {
    let isMounted = true

    getPlans()
      .then((items: PlanApiItem[]) => {
        if (!isMounted) return
        if (Array.isArray(items) && items.length > 0) {
          const displayPlans = items
            .filter((p) => p.type !== 'UPSELL' && p.abacateProductId !== 'prod_agency_extra_credit')
            .map(formatPlanCard)

          setPlans(displayPlans)
        }
      })
      .catch(() => {
        if (isMounted) {
          setPlans([])
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingPlans(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!isLoadingPlans && plans.length > 0) {
      trackEvent('view_item_list', {
        item_list_name: 'landing_plans',
        items: plans.map((p) => ({
          item_id: p.abacateProductId || p.id,
          item_name: p.title,
          price: p.price
        }))
      })
    }
  }, [isLoadingPlans, plans])

  const onSelectPlan = (plan: PlanCardData) => {
    trackEvent('select_item', {
      item_list_name: 'landing_plans',
      item_id: plan.abacateProductId || plan.id,
      item_name: plan.title,
      price: plan.price
    })
  }

  return {
    isDark,
    plans,
    isLoadingPlans,
    data: landingPageData,
    user,
    onSelectPlan
  }
}

export default useLandingPage
export * from './types'
