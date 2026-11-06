import { ProductCycle } from '@abacatepay/types/v2'
import type { AbacatePayClient } from '@payment'
import createLogger from '@utils/logger'

const logger = createLogger('payment:seed:plans')

export interface SeedProduct {
  externalId: string
  name: string
  price: number
  currency: 'BRL'
  description: string
  cycle?: ProductCycle
}

export const SEED_PLANS: SeedProduct[] = [
  {
    externalId: 'prod_b2c_event_pass',
    name: 'Passe Evento Completo',
    price: 14700,
    currency: 'BRL',
    description: 'Fotos e convidados ilimitados, Modo Telão liberado sem marca d\'água, moderação por PIN, download em .zip e galeria ativa por 90 dias.'
  },
  {
    externalId: 'prod_b2c_upsell_year',
    name: 'Extensão Galeria 1 Ano + Cápsula do Tempo',
    price: 3900,
    currency: 'BRL',
    description: 'Extensão da galeria online para 1 ano completo e liberação do Modo Cápsula do Tempo.'
  },
  {
    externalId: 'prod_agency_essential',
    name: 'Plano Agência Essencial',
    price: 24700,
    currency: 'BRL',
    description: 'Franquia de 4 eventos por mês, selo White-Label da assessoria, rollover de créditos por 60 dias e painel de moderação de equipe.',
    cycle: ProductCycle.Monthly
  },
  {
    externalId: 'prod_agency_pro',
    name: 'Plano Agência Pro',
    price: 44700,
    currency: 'BRL',
    description: 'Franquia de 10 eventos por mês, selo White-Label da assessoria, rollover de créditos por 60 dias e painel de moderação de equipe.',
    cycle: ProductCycle.Monthly
  },
  {
    externalId: 'prod_agency_extra_credit',
    name: 'Crédito Extra Avulso - Agência',
    price: 6900,
    currency: 'BRL',
    description: 'Crédito avulso adicional para ativação de evento, exclusivo para assinantes ativos dos planos de agência.'
  }
]

export const seedPlans = async (client: AbacatePayClient): Promise<void> => {
  logger.info(`Starting plans seed (${SEED_PLANS.length} products to verify)...`)

  for (const product of SEED_PLANS) {
    try {
      const checkResponse = await client.products.get({ externalId: product.externalId })

      if (checkResponse.data) {
        logger.info(
          `[seedPlans] Product "${product.name}" (${product.externalId}) already exists (ID: ${checkResponse.data.id}). Skipping.`
        )
        continue
      }

      logger.info(`[seedPlans] Creating product "${product.name}" (${product.externalId})...`)

      const createResponse = await client.products.create({
        externalId: product.externalId,
        name: product.name,
        price: product.price,
        currency: product.currency,
        description: product.description,
        cycle: product.cycle
      })

      if (createResponse.error || !createResponse.data) {
        logger.error(`[seedPlans] Error creating "${product.name}":`, createResponse.error)
      } else {
        logger.success(`[seedPlans] Product "${product.name}" created successfully (ID: ${createResponse.data.id}).`)
      }
    } catch (err) {
      logger.error(`[seedPlans] Exception while processing "${product.name}":`, err)
    }
  }

  logger.success('[seedPlans] Plans seed completed.')
}
