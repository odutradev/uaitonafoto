import purchaseRepository from '@domains/payments/repositories/purchases'
import userRepository from '@domains/users/repositories/users'
import logRepository from '@domains/system/repositories/logs'
import { claimFreeTrialResponseSchema } from './schemas'
import defineAction from '@factories/defineAction'
import { freeTrialPlan } from '@payment/plans'

import type { ManageRequestResponse } from '@middlewares/manageRequest/types'
import type { ClaimFreeTrialResponse } from './types'

export const claimFreeTrial = defineAction(
  {
    method: 'post',
    path: '/payments/free-trial/claim',
    summary: 'Resgatar o crédito do Teste Grátis (limitado a 1 uso por conta)',
    tags: ['Pagamentos'],
    authenticate: true,
    responses: {
      200: { description: 'Teste Grátis ativado com sucesso', schema: claimFreeTrialResponseSchema },
      404: { description: 'Usuário não encontrado' },
      409: { description: 'Teste Grátis já resgatado nesta conta' }
    }
  },
  async ({ ids, manageError }): ManageRequestResponse<ClaimFreeTrialResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const user = await userRepository.findById(ids.userId)
    if (!user) return manageError({ code: 'user_not_found' })

    if (user.freeTrialClaimedAt) {
      return manageError({
        code: 'conflict',
        details: 'O Teste Grátis já foi resgatado nesta conta.'
      })
    }

    const updatedUser = await userRepository.claimFreeTrial(user.id, freeTrialPlan.credits)
    if (!updatedUser) {
      return manageError({
        code: 'conflict',
        details: 'O Teste Grátis já foi resgatado nesta conta.'
      })
    }

    const freeTrialTransactionId = `free_trial_${user.id}`
    const existingPurchase = await purchaseRepository.findByTransactionId(freeTrialTransactionId)

    if (!existingPurchase) {
      await purchaseRepository.create({
        userId: user.id,
        transactionId: freeTrialTransactionId,
        planId: freeTrialPlan.id,
        planType: freeTrialPlan.type,
        planName: freeTrialPlan.name,
        abacateProductId: freeTrialPlan.abacateProductId,
        planSnapshot: freeTrialPlan,
        amount: 0,
        currency: freeTrialPlan.currency,
        credits: freeTrialPlan.credits,
        creditType: 'free',
        extraStorageDays: 0
      })
    }

    logRepository.create({
      category: 'user',
      level: 'info',
      action: 'FREE_TRIAL_CLAIMED',
      title: 'Teste Grátis ativado',
      description: `${updatedUser.fullName || updatedUser.name} resgatou ${freeTrialPlan.credits} crédito do Teste Grátis`,
      userId: updatedUser.id,
      userName: updatedUser.fullName || updatedUser.name,
      userEmail: updatedUser.email
    })

    return { user: updatedUser }
  }
)
