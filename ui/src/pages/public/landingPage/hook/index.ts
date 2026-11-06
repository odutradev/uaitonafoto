import { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'

import { getPlans } from '@actions/payments'
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
      .catch(() => {
        // Fallback já garantido pelos dados declarativos em data
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

  return {
    isDark,
    plans,
    upsell,
    isLoadingPlans,
    data: landingPageData
  }
}

export default useLandingPage
export * from './types'
