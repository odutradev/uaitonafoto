import { addDays } from '@utils/date'
import createLogger from '@utils/logger'
import userRepository from '@domains/users/repositories'
import logRepository from '@domains/system/repositories'
import purchaseRepository from '../repositories/purchases'
import computeNextBillingDate from './computeNextBillingDate'

import type { CachedPlan } from '@payment/plans/types'
import type { SubscriptionEntity } from '../repositories/subscriptions/types'

const logger = createLogger('payments:rollover')

export const DEFAULT_ROLLOVER_DAYS = 30

export const computeCycleCreditsExpiration = (
  paidAt: string,
  frequency = 'MONTHLY',
  rolloverDays = DEFAULT_ROLLOVER_DAYS
): string => {
  const cycleEndIso = computeNextBillingDate(paidAt, frequency)
  return addDays(new Date(cycleEndIso), rolloverDays).toISOString()
}

export interface ApplyRolloverParams {
  subscription: SubscriptionEntity
  plan?: CachedPlan
  paidAt: string
  frequency: string
}

export interface ApplyRolloverResult {
  creditsToGrant: number
  carriedOverCredits: number
  expiredCredits: number
  creditsExpiresAt: string
}

export const applySubscriptionRolloverOnRenewal = async ({
  subscription,
  plan,
  paidAt,
  frequency
}: ApplyRolloverParams): Promise<ApplyRolloverResult> => {
  const rolloverDays = plan?.rolloverDays ?? DEFAULT_ROLLOVER_DAYS
  const planCredits = plan?.credits ?? subscription.creditsPerCycle
  const maxAccumulatedCredits = plan?.maxAccumulatedCredits ?? planCredits * 2

  const activeBatches = await purchaseRepository.listActiveBySubscription(subscription.subscriptionId)
  const paidAtTime = new Date(paidAt).getTime()

  let expiredCredits = 0
  let carriedOverCredits = 0

  for (let index = 0; index < activeBatches.length; index++) {
    const batch = activeBatches[index]
    const isMostRecentCycle = index === activeBatches.length - 1
    const isPastExpiration = Boolean(
      batch.creditsExpiresAt && new Date(batch.creditsExpiresAt).getTime() <= paidAtTime
    )

    if (!isMostRecentCycle || isPastExpiration) {
      const expired = await purchaseRepository.expirePurchaseCredits(batch.id, paidAt)
      if (expired > 0) {
        expiredCredits += expired
        await userRepository.deductCredits(subscription.userId, 'paid', expired)
      }
      continue
    }

    const rolloverExpiresAt = addDays(new Date(paidAt), rolloverDays).toISOString()
    await purchaseRepository.updateCreditsExpiration(batch.id, rolloverExpiresAt)
    carriedOverCredits += batch.remainingCredits
  }

  if (expiredCredits > 0) {
    logger.info(
      `Expired ${expiredCredits} rollover credits beyond ${rolloverDays}d window for subscription ${subscription.subscriptionId}`
    )

    logRepository.create({
      category: 'system',
      level: 'info',
      action: 'SUBSCRIPTION_CREDITS_EXPIRED',
      title: 'Créditos acumulados expirados',
      description: `${expiredCredits} crédito(s) de ${subscription.planName} expiraram após o limite de ${rolloverDays} dias de acúmulo`,
      userId: subscription.userId,
      targetId: subscription.subscriptionId,
      targetName: subscription.planName,
      details: { expiredCredits, rolloverDays }
    })
  }

  const creditsToGrant = Math.max(0, Math.min(planCredits, maxAccumulatedCredits - carriedOverCredits))
  const creditsExpiresAt = computeCycleCreditsExpiration(paidAt, frequency, rolloverDays)

  return {
    creditsToGrant,
    carriedOverCredits,
    expiredCredits,
    creditsExpiresAt
  }
}

export const expireOverdueSubscriptionCredits = async (
  nowIso: string = new Date().toISOString()
): Promise<void> => {
  const overduePurchases = await purchaseRepository.listExpiredSubscriptionPurchases(nowIso)

  for (const purchase of overduePurchases) {
    const expired = await purchaseRepository.expirePurchaseCredits(purchase.id, nowIso)
    if (expired <= 0) continue

    await userRepository.deductCredits(purchase.userId, 'paid', expired)

    logger.info(`Expired ${expired} overdue subscription credits from purchase ${purchase.id}`)

    logRepository.create({
      category: 'system',
      level: 'info',
      action: 'SUBSCRIPTION_CREDITS_EXPIRED',
      title: 'Créditos acumulados expirados',
      description: `${expired} crédito(s) do plano ${purchase.planName} expiraram após o prazo de acúmulo de 30 dias`,
      userId: purchase.userId,
      targetId: purchase.subscriptionId ?? purchase.id,
      targetName: purchase.planName,
      details: { purchaseId: purchase.id, expiredCredits: expired }
    })
  }
}
