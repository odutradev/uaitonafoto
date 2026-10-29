import lotteriesRulesJson from '../data/lotteriesRules.json'

export interface LotteryRule {
  name: string
  totalNumbers: number
  minNumbers: number
  maxNumbers: number
  prices: Record<string, number>
}

export type LotteryRulesMap = Record<string, LotteryRule>

export const LOTTERIES_RULES = lotteriesRulesJson as LotteryRulesMap

export const normalizeLotteryKey = (type?: string): string => {
  if (!type) return 'megasena'
  return type.toLowerCase().replace(/[^a-z]/g, '')
}

export const getLotteryRule = (type?: string): LotteryRule => {
  const key = normalizeLotteryKey(type)
  return LOTTERIES_RULES[key] || LOTTERIES_RULES.megasena
}

export const getGamePrice = (type: string | undefined, numbersCount: number): number => {
  const rule = getLotteryRule(type)
  const price = rule.prices[String(numbersCount)]
  if (price !== undefined) return price
  const minPrice = rule.prices[String(rule.minNumbers)]
  return minPrice || 0
}

export const combinations = (n: number, k: number): number => {
  if (k < 0 || k > n) return 0
  if (k === 0 || k === n) return 1
  const c = Math.min(k, n - k)
  let result = 1
  for (let i = 1; i <= c; i++) {
    result = (result * (n - i + 1)) / i
  }
  return Math.round(result)
}

export const getLotteryOdds = (type: string | undefined, numbersCount: number): string => {
  const rule = getLotteryRule(type)
  const n = rule.totalNumbers
  const s = rule.minNumbers
  const totalCombinations = combinations(n, s)
  const gameCombinations = combinations(numbersCount, s)

  if (gameCombinations <= 0) return '—'
  const odds = Math.round(totalCombinations / gameCombinations)
  return `1 em ${odds.toLocaleString('pt-BR')}`
}

export const getEquivalentGamesCount = (type: string | undefined, numbersCount: number): number => {
  const rule = getLotteryRule(type)
  return combinations(numbersCount, rule.minNumbers)
}

