import type { PlanApiItem } from '@actions/payments/types'
import type { PlanCardData, UpsellBannerData } from './types'

export const formatPriceInBrl = (priceInCents: number): string => {
  if (priceInCents === 0) return 'Grátis'
  return (priceInCents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  })
}

export const mergePlansWithApi = (
  staticPlans: PlanCardData[],
  apiPlans: PlanApiItem[]
): PlanCardData[] => {
  if (!apiPlans || apiPlans.length === 0) return staticPlans

  return staticPlans.map((plan) => {
    const apiMatch = apiPlans.find(
      (apiItem) =>
        apiItem.abacateProductId === plan.abacateProductId ||
        apiItem.productId === plan.abacateProductId ||
        apiItem.name.toLowerCase() === plan.title.toLowerCase()
    )

    if (!apiMatch) return plan

    return {
      ...plan,
      title: apiMatch.name || plan.title,
      price: formatPriceInBrl(apiMatch.price)
    }
  })
}

export const mergeUpsellWithApi = (
  staticUpsell: UpsellBannerData,
  apiPlans: PlanApiItem[]
): UpsellBannerData => {
  if (!apiPlans || apiPlans.length === 0) return staticUpsell

  const apiMatch = apiPlans.find(
    (apiItem) =>
      apiItem.type === 'UPSELL' ||
      apiItem.abacateProductId === staticUpsell.abacateProductId
  )

  if (!apiMatch) return staticUpsell

  return {
    ...staticUpsell,
    title: apiMatch.name || staticUpsell.title,
    price: `+ ${(apiMatch.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
  }
}
