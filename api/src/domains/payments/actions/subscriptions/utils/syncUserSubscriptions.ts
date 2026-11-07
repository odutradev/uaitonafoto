import transactionRepository from '../../../repositories/transactions'
import ensureSubscriptionRecord from '../../../utils/ensureSubscriptionRecord'

export const syncUserSubscriptions = async (userId: string): Promise<void> => {
  const userTransactions = await transactionRepository.listByUser(userId)
  const unlinked = userTransactions.filter(
    (tx) => tx.planType === 'SUBSCRIPTION' && tx.status === 'PAID' && !tx.subscriptionId
  )

  for (const tx of unlinked) {
    await ensureSubscriptionRecord(tx)
  }
}

export default syncUserSubscriptions
