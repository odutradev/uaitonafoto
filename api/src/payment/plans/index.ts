import createLogger from '@utils/logger'
import type { AbacatePayClient } from '../types'
import type { CachedPlan, PlanConfig } from './types'

const logger = createLogger('payment:plans')

export const plansConfig: PlanConfig[] = [
  {
    abacateProductId: 'prod_b2c_event_pass',
    type: 'ONE_TIME',
    credits: 1
  },
  {
    abacateProductId: 'prod_b2c_upsell_year',
    type: 'UPSELL',
    credits: 0,
    extraStorageDays: 365
  },
  {
    abacateProductId: 'prod_agency_essential',
    type: 'SUBSCRIPTION',
    credits: 4
  },
  {
    abacateProductId: 'prod_agency_pro',
    type: 'SUBSCRIPTION',
    credits: 10
  },
  {
    abacateProductId: 'prod_agency_extra_credit',
    type: 'ONE_TIME',
    credits: 1
  }
]

export const freeTrialPlan: CachedPlan = {
  abacateProductId: 'free_trial',
  type: 'FREE',
  credits: 1,
  name: 'Modo Degustação',
  description: 'Até 25 fotos compartilhadas no mural, Modo Telão ao vivo com marca d\'água e galeria ativa por 7 dias.',
  price: 0,
  imageUrl: null,
  currency: 'BRL',
  devMode: false
}

let cachedPlans: CachedPlan[] = []

export const getCachedPlans = (): CachedPlan[] => {
  return [freeTrialPlan, ...cachedPlans]
}

export const getPlanByProductId = (productId: string): CachedPlan | undefined => {
  if (productId === 'free_trial') return freeTrialPlan
  return cachedPlans.find((plan) => plan.abacateProductId === productId || plan.productId === productId)
}

export const getUpsellPlans = (): CachedPlan[] => {
  return cachedPlans.filter((plan) => plan.type === 'UPSELL')
}

export const getGalleryStorageUpsell = (): CachedPlan | undefined => {
  return cachedPlans.find((plan) => plan.abacateProductId === 'prod_b2c_upsell_year')
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
            abacateProductId: plan.abacateProductId,
            productId: product.id,
            type: plan.type,
            credits: plan.credits,
            extraStorageDays: plan.extraStorageDays,
            name: product.name,
            description: product.description,
            price: product.price,
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

    cachedPlans = fetchedPlans.filter((plan): plan is CachedPlan => plan !== null)

    logger.success(`[syncPlansCache] Synchronized ${cachedPlans.length}/${plansConfig.length} plans in memory cache`)

    return cachedPlans
  } catch (error) {
    logger.error('[syncPlansCache] Failed to synchronize plans cache:', error)
    return cachedPlans
  }
}

export * from './types'

