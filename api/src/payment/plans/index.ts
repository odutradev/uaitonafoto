import createLogger from '@utils/logger'
import type { AbacatePayClient } from '../types'
import type { CachedPlan, PlanConfig } from './types'

const logger = createLogger('payment:plans')

export const freeTrialPlan: CachedPlan = {
  id: 'free_trial',
  abacateProductId: 'free_trial',
  type: 'FREE',
  credits: 1,
  tag: 'Degustação',
  name: 'Modo Degustação',
  title: 'Modo Degustação',
  price: 0,
  currency: 'BRL',
  period: 'sem cartão',
  subBadge: 'Até 25 fotos para testar',
  description: 'Experimente a dinâmica do telão e do aplicativo na sua festa sem nenhum compromisso financeiro.',
  features: [
    'Até 25 fotos compartilhadas no mural',
    'Modo Telão ao vivo com marca d\'água',
    'Código QR pronto para os convidados',
    'Mural no celular com curtidas em tempo real',
    'Galeria ativa por 7 dias'
  ],
  ctaText: 'Começar grátis',
  ctaHref: 'free_trial',
  highlighted: false,
  imageUrl: null,
  devMode: false
}

export const plansConfig: PlanConfig[] = [
  {
    id: 'prod_b2c_event_pass',
    abacateProductId: 'prod_b2c_event_pass',
    type: 'ONE_TIME',
    credits: 1,
    tag: 'Evento Único',
    name: 'Passe do Evento',
    title: 'Passe do Evento',
    price: 14700,
    currency: 'BRL',
    period: 'pagamento único',
    subBadge: 'Fotos e convidados ilimitados',
    description: 'Perfeito para noivos, aniversariantes e formaturas contratando para uma data especial.',
    features: [
      '1 evento completo com fotos ilimitadas',
      'Convidados ilimitados sem precisar baixar aplicativo',
      'Modo Telão ao vivo sem marcas d\'água',
      'Moderação de fotos com senha de segurança',
      'Baixe todas as fotos em alta resolução (.zip)',
      'Galeria ativa por 90 dias'
    ],
    ctaText: 'Criar meu evento',
    ctaHref: 'prod_b2c_event_pass',
    highlighted: false
  },
  {
    id: 'prod_b2c_upsell_year',
    abacateProductId: 'prod_b2c_upsell_year',
    type: 'UPSELL',
    credits: 0,
    extraStorageDays: 365,
    badge: 'Complemento Exclusivo',
    name: 'Extensão de Galeria por 1 Ano + Cápsula do Tempo',
    title: 'Extensão de Galeria por 1 Ano + Cápsula do Tempo',
    price: 3900,
    currency: 'BRL',
    description: 'Mantenha a galeria de recordações disponível por 1 ano completo e libere o Modo Cápsula do Tempo para revelar fotos apenas no dia seguinte.',
    features: [
      'Extensão da galeria ativa por 1 ano',
      'Modo Cápsula do Tempo incluso'
    ],
    ctaText: 'Adicionar ao pedido',
    ctaHref: 'prod_b2c_upsell_year'
  },
  {
    id: 'prod_agency_essential',
    abacateProductId: 'prod_agency_essential',
    type: 'SUBSCRIPTION',
    credits: 4,
    tag: 'Cerimonialistas',
    name: 'Agência Essencial',
    title: 'Agência Essencial',
    price: 24700,
    currency: 'BRL',
    period: '/mês',
    costPerEvent: 'R$ 61,75 por evento (58% de economia)',
    description: 'Para assessores e cerimonialistas que realizam eventos com frequência regular.',
    features: [
      '4 eventos inclusos por mês',
      'Sua própria marca no telão e no aplicativo',
      'Link para seu WhatsApp ou Instagram no telão',
      'Créditos acumulativos por 60 dias (contra baixa temporada)',
      'Acesso de moderação com senha para sua equipe',
      'Crédito extra avulso por R$ 69,00'
    ],
    ctaText: 'Assinar Essencial',
    ctaHref: 'prod_agency_essential',
    highlighted: false
  },
  {
    id: 'prod_agency_pro',
    abacateProductId: 'prod_agency_pro',
    type: 'SUBSCRIPTION',
    credits: 10,
    badge: 'Mais Escolhido',
    tag: 'Alta Demanda',
    name: 'Agência Pro',
    title: 'Agência Pro',
    price: 44700,
    currency: 'BRL',
    period: '/mês',
    costPerEvent: 'R$ 44,70 por evento (70% de economia)',
    description: 'O melhor custo-benefício para agências consolidadas com múltiplos eventos por semana.',
    features: [
      '10 eventos inclusos por mês',
      'Sua marca em destaque para atrair novos clientes',
      'Botão direto para seu WhatsApp no mural de fotos',
      'Créditos acumulativos por 60 dias (até 20 eventos)',
      'Painel de moderação para recepcionistas na festa',
      'Crédito extra avulso por apenas R$ 49,00',
      'Suporte prioritário via WhatsApp'
    ],
    ctaText: 'Assinar Agência Pro',
    ctaHref: 'prod_agency_pro',
    highlighted: true
  },
  {
    id: 'prod_agency_extra_credit',
    abacateProductId: 'prod_agency_extra_credit',
    type: 'ONE_TIME',
    credits: 1,
    tag: 'Crédito Extra',
    name: 'Crédito Extra Avulso - Agência',
    title: 'Crédito Extra Avulso',
    price: 6900,
    currency: 'BRL',
    period: 'avulso',
    description: 'Crédito avulso adicional para ativação de evento, exclusivo para assinantes ativos dos planos de agência.',
    features: [
      '1 evento adicional para ativação imediata',
      'Crédito não expira em planos ativos'
    ],
    ctaText: 'Comprar Crédito',
    ctaHref: 'prod_agency_extra_credit'
  }
]

const basePlans: CachedPlan[] = plansConfig.map((config) => ({
  ...config,
  imageUrl: null,
  devMode: false
}))

let cachedPlans: CachedPlan[] = []

export const getCachedPlans = (): CachedPlan[] => {
  if (cachedPlans.length > 0) {
    return [freeTrialPlan, ...cachedPlans]
  }
  return [freeTrialPlan, ...basePlans]
}

export const getPlanByProductId = (productId: string): CachedPlan | undefined => {
  const all = getCachedPlans()
  return all.find(
    (plan) =>
      plan.id === productId ||
      plan.abacateProductId === productId ||
      plan.productId === productId
  )
}

export const getUpsellPlans = (): CachedPlan[] => {
  return getCachedPlans().filter((plan) => plan.type === 'UPSELL')
}

export const getGalleryStorageUpsell = (): CachedPlan | undefined => {
  return getCachedPlans().find((plan) => plan.abacateProductId === 'prod_b2c_upsell_year')
}

export const syncPlansCache = async (client: AbacatePayClient): Promise<CachedPlan[]> => {
  try {
    const fetchedPlans = await Promise.all(
      plansConfig.map(async (plan): Promise<CachedPlan | null> => {
        try {
          const query = plan.abacateProductId.startsWith('prod_')
            ? { id: plan.abacateProductId }
            : { externalId: plan.abacateProductId }

          let response = await client.products.get(query)

          if ((response.error || !response.data) && plan.abacateProductId.startsWith('prod_')) {
            response = await client.products.get({ externalId: plan.abacateProductId })
          }

          if (response.error || !response.data) {
            logger.warn(
              `[syncPlansCache] Could not fetch product "${plan.abacateProductId}" from AbacatePay: ${response.error ?? 'Not found'}`
            )
            return null
          }

          const product = response.data

          return {
            ...plan,
            productId: product.id,
            price: typeof product.price === 'number' ? product.price : plan.price,
            name: product.name || plan.name,
            imageUrl: product.imageUrl ?? null,
            currency: product.currency ?? 'BRL',
            devMode: product.devMode
          }
        } catch (fetchError) {
          logger.warn(`[syncPlansCache] Error loading product "${plan.abacateProductId}":`, fetchError)
          return null
        }
      })
    )

    const synchronized = fetchedPlans.filter((plan): plan is CachedPlan => plan !== null)

    if (synchronized.length > 0) {
      cachedPlans = plansConfig.map((config) => {
        const synced = synchronized.find((s) => s.abacateProductId === config.abacateProductId)
        return synced || { ...config, imageUrl: null, devMode: false }
      })
      logger.success(`[syncPlansCache] Synchronized ${synchronized.length}/${plansConfig.length} plans in memory cache`)
    }

    return getCachedPlans()
  } catch (error) {
    logger.error('[syncPlansCache] Failed to synchronize plans cache:', error)
    return getCachedPlans()
  }
}

export * from './types'

