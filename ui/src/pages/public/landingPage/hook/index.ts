import { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'

import { getPlans } from '@actions/payments'
import { trackEvent } from '@actions/auth/firebase'
import { formatPriceInBrl } from '@config/formatters'
import useAuth from '@hooks/useAuth'
import type { PlanApiItem } from '@actions/payments/types'

import landingPageData from '../data'
import type { PlanCardData } from '../sections/plans/types'
import type { UseLandingPageReturn } from './types'

const formatPlanCard = (item: PlanApiItem): PlanCardData => {
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

const DEFAULT_FALLBACK_PLANS: PlanCardData[] = [
  {
    id: 'prod_b2c_event_pass',
    abacateProductId: 'prod_b2c_event_pass',
    tag: 'Evento Único',
    title: 'Passe do Evento',
    price: 'R$ 147,00',
    period: 'pagamento único',
    subBadge: 'Fotos e convidados ilimitados',
    description: 'Para casamentos, aniversários e festas em data única.',
    features: [
      '1 evento completo com fotos ilimitadas',
      '8 horas de telão ao vivo e recepção de fotos',
      '2 telões simultâneos com PIN individual',
      '1 convidado na equipe organizadora',
      'Convidados ilimitados sem app e sem cadastro',
      'Moderação de fotos em tempo real com PIN',
      'Missões fotográficas interativas',
      'Display de mesa com QR Code para impressão',
      'Download de todas as fotos em alta resolução (.zip)',
      'Galeria online ativa por 90 dias'
    ],
    ctaText: 'Criar meu evento',
    ctaHref: 'prod_b2c_event_pass',
    highlighted: false
  },
  {
    id: 'prod_agency_essential',
    abacateProductId: 'prod_agency_essential',
    tag: 'Cerimonialistas',
    title: 'Agência Essencial',
    price: 'R$ 247,00',
    period: '/mês',
    costPerEvent: 'R$ 61,75 por evento (58% de economia)',
    description: 'Para assessores e cerimonialistas com eventos regulares.',
    features: [
      'Tudo que tem no Avulso, mais:',
      '4 eventos inclusos por mês',
      '3 telões simultâneos por evento',
      '2 convidados na equipe organizadora',
      'Sua própria marca White-Label no telão e app',
      'Créditos acumulativos enquanto o plano estiver ativo',
      'Crédito extra avulso por R$ 69,00'
    ],
    ctaText: 'Assinar Essencial',
    ctaHref: 'prod_agency_essential',
    highlighted: false
  },
  {
    id: 'prod_agency_pro',
    abacateProductId: 'prod_agency_pro',
    badge: 'Mais Escolhido',
    tag: 'Alta Demanda',
    title: 'Agência Pro',
    price: 'R$ 447,00',
    period: '/mês',
    costPerEvent: 'R$ 44,70 por evento (70% de economia)',
    description: 'Para agências consolidadas com múltiplos eventos semanais.',
    features: [
      'Tudo que tem no Essencial, mais:',
      '10 eventos inclusos por mês',
      '4 telões simultâneos por evento',
      '5 convidados na equipe organizadora',
      'Sua marca em destaque para atrair novos clientes',
      'Botão direto para seu WhatsApp no mural de fotos'
    ],
    ctaText: 'Assinar Pro',
    ctaHref: 'prod_agency_pro',
    highlighted: true
  }
]

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
          setPlans(DEFAULT_FALLBACK_PLANS)
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
