import subscriptionRepository from '@domains/payments/repositories/subscriptions'

import type { EventEntity, EventPlanTier } from '@domains/events/repositories/events/types'

export interface EventLimits {
  tier: EventPlanTier
  maxOrganizers: number
  maxScreens: number
}

export const EVENT_PLAN_LIMITS: Record<EventPlanTier, { maxOrganizers: number; maxScreens: number }> = {
  single: {
    maxOrganizers: 1,
    maxScreens: 2
  },
  essential: {
    maxOrganizers: 2,
    maxScreens: 3
  },
  pro: {
    maxOrganizers: 5,
    maxScreens: 4
  }
}

export const resolveUserPlanTier = async (userId: string): Promise<EventPlanTier> => {
  const subscriptions = await subscriptionRepository.listByUser(userId)
  const activeSub = subscriptions.find((sub) => sub.status === 'ACTIVE')

  if (activeSub) {
    const productId = activeSub.abacateProductId || activeSub.planId
    if (productId === 'prod_agency_pro') return 'pro'
    if (productId === 'prod_agency_essential') return 'essential'
  }

  return 'single'
}

export const resolveEventLimits = async (event: EventEntity): Promise<EventLimits> => {
  if (event.planTier && EVENT_PLAN_LIMITS[event.planTier]) {
    const limits = EVENT_PLAN_LIMITS[event.planTier]
    return {
      tier: event.planTier,
      ...limits
    }
  }

  const creator = event.members?.find((member) => member.role === 'creator')
  const tier = creator ? await resolveUserPlanTier(creator.userId) : 'single'
  const limits = EVENT_PLAN_LIMITS[tier]

  return {
    tier,
    ...limits
  }
}

export default resolveEventLimits
