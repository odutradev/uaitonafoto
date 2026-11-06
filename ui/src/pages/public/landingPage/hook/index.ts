import { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'

import { getPlans } from '@actions/payments'
import { trackEvent } from '@actions/auth/firebase'
import type { PlanApiItem } from '@actions/payments/types'

import landingPageData from '../data'
import { mergePlansWithApi, mergeUpsellWithApi } from '../sections/plans/utils'
import type { PlanCardData, UpsellBannerData } from '../sections/plans/types'
import type { UseLandingPageReturn } from './types'

export const useLandingPage = (): UseLandingPageReturn => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const [isLoadingPlans, setIsLoadingPlans] = useState(true)
  const [plans, setPlans] = useState<PlanCardData[]>(landingPageData.plans.plans)
  const [upsell, setUpsell] = useState<UpsellBannerData>(landingPageData.plans.upsell)

  useEffect(() => {
    let isMounted = true

    getPlans()
      .then((items: PlanApiItem[]) => {
        if (!isMounted) return
        if (Array.isArray(items) && items.length > 0) {
          setPlans(mergePlansWithApi(landingPageData.plans.plans, items))
          setUpsell(mergeUpsellWithApi(landingPageData.plans.upsell, items))
        }
      })
      .catch(() => {})
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

  const onSelectUpsell = (upsellItem: UpsellBannerData) => {
    trackEvent('select_item', {
      item_list_name: 'landing_plans_upsell',
      item_id: upsellItem.abacateProductId || upsellItem.id,
      item_name: upsellItem.title,
      price: upsellItem.price
    })
  }

  return {
    isDark,
    plans,
    upsell,
    isLoadingPlans,
    data: landingPageData,
    onSelectPlan,
    onSelectUpsell
  }
}

export default useLandingPage
export * from './types'
