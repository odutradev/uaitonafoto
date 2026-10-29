import { getLotteryRule } from '@utils/lotteryRules'

export interface GameAllocationItem {
  numbersCount: number
  count: number
  unitPrice: number
  totalPrice: number
}

export interface GameAllocationResult {
  allocations: GameAllocationItem[]
  totalAllocated: number
  remainingBudget: number
  totalGamesCount: number
}

export const allocateGamesByBudget = (
  lotteryType: string | undefined,
  availableBudget: number
): GameAllocationResult => {
  const rule = getLotteryRule(lotteryType)
  let remaining = Math.max(0, availableBudget)

  const numbersOptions = Object.keys(rule.prices)
    .map(Number)
    .filter((n) => !isNaN(n))
    .sort((a, b) => b - a)

  const allocations: GameAllocationItem[] = []
  let totalAllocated = 0
  let totalGamesCount = 0

  for (const numbersCount of numbersOptions) {
    const unitPrice = rule.prices[String(numbersCount)]
    if (!unitPrice || unitPrice <= 0) continue

    if (remaining >= unitPrice) {
      const count = Math.floor(remaining / unitPrice)
      if (count > 0) {
        const cost = count * unitPrice
        remaining = Number((remaining - cost).toFixed(2))
        totalAllocated = Number((totalAllocated + cost).toFixed(2))
        totalGamesCount += count

        allocations.push({
          numbersCount,
          count,
          unitPrice,
          totalPrice: cost
        })
      }
    }
  }

  return {
    allocations,
    totalAllocated,
    remainingBudget: remaining,
    totalGamesCount
  }
}

export const generateRandomGame = (
  lotteryType: string | undefined,
  numbersCount: number
): number[] => {
  const rule = getLotteryRule(lotteryType)
  const max = rule.totalNumbers || 60
  const count = Math.min(Math.max(numbersCount, rule.minNumbers), rule.maxNumbers, max)

  const selected = new Set<number>()
  while (selected.size < count) {
    const rand = Math.floor(Math.random() * max) + 1
    selected.add(rand)
  }

  return Array.from(selected).sort((a, b) => a - b)
}

export const generateAllocatedGames = (
  lotteryType: string | undefined,
  allocations: GameAllocationItem[]
): number[][] => {
  const games: number[][] = []

  for (const item of allocations) {
    for (let i = 0; i < item.count; i++) {
      games.push(generateRandomGame(lotteryType, item.numbersCount))
    }
  }

  return games
}
