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

export const formatPlanCard = (item: PlanApiItem): PlanCardData => {
  const period =
    item.period ||
    (item.type === 'SUBSCRIPTION'
      ? '/mês'
      : item.type === 'FREE'
        ? 'sem cartão'
        : 'pagamento único')

  return {
    id: item.id || item.abacateProductId,
    abacateProductId: item.abacateProductId,
    tag: item.tag || '',
    badge: item.badge,
    title: item.title || item.name,
    price: formatPriceInBrl(item.price),
    period,
    subBadge: item.subBadge,
    costPerEvent: item.costPerEvent,
    description: item.description,
    features: item.features || [],
    ctaText: item.ctaText || 'Escolher Plano',
    ctaHref: item.ctaHref || item.id || item.abacateProductId,
    highlighted: Boolean(item.highlighted)
  }
}

export const formatUpsellBanner = (item: PlanApiItem): UpsellBannerData => ({
  id: item.id || item.abacateProductId,
  abacateProductId: item.abacateProductId,
  badge: item.badge || 'Complemento Exclusivo',
  title: item.title || item.name,
  price: `+ ${(item.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
  description: item.description,
  ctaText: item.ctaText || 'Adicionar ao pedido',
  ctaHref: item.ctaHref || item.id || item.abacateProductId
})
