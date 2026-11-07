import { addDays } from '@utils/date'

export const computeNextBillingDate = (fromIsoDate: string, frequency = 'MONTHLY'): string => {
  const base = new Date(fromIsoDate)

  if (Number.isNaN(base.getTime())) {
    return computeNextBillingDate(new Date().toISOString(), frequency)
  }

  switch (frequency) {
    case 'DAILY':
      return addDays(base, 1).toISOString()
    case 'WEEKLY':
      return addDays(base, 7).toISOString()
    case 'QUARTERLY': {
      const next = new Date(base)
      next.setUTCMonth(next.getUTCMonth() + 3)
      return next.toISOString()
    }
    case 'SEMIANNUALLY': {
      const next = new Date(base)
      next.setUTCMonth(next.getUTCMonth() + 6)
      return next.toISOString()
    }
    case 'ANNUALLY': {
      const next = new Date(base)
      next.setUTCFullYear(next.getUTCFullYear() + 1)
      return next.toISOString()
    }
    case 'MONTHLY':
    default: {
      const next = new Date(base)
      next.setUTCMonth(next.getUTCMonth() + 1)
      return next.toISOString()
    }
  }
}

export default computeNextBillingDate
