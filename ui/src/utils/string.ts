export const capitalizeWords = (text?: string | null): string => {
  if (!text) return ''
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('pt-BR', {
    currency: 'BRL',
    style: 'currency'
  }).format(value)

export const formatCompactCurrency = (value: number, includePrefix = true): string => {
  const prefix = includePrefix ? 'R$ ' : ''

  if (!value || isNaN(value)) {
    return `${prefix}0`
  }

  const absValue = Math.abs(value)
  const sign = value < 0 ? '-' : ''

  if (absValue >= 1_000_000_000) {
    const formatted = (absValue / 1_000_000_000).toLocaleString('pt-BR', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    })
    const unit = absValue < 2_000_000_000 ? 'bilhão' : 'bilhões'
    return `${sign}${prefix}${formatted} ${unit}`
  }

  if (absValue >= 1_000_000) {
    const formatted = (absValue / 1_000_000).toLocaleString('pt-BR', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    })
    const unit = absValue < 2_000_000 ? 'milhão' : 'milhões'
    return `${sign}${prefix}${formatted} ${unit}`
  }

  if (absValue >= 10_000) {
    const formatted = (absValue / 1_000).toLocaleString('pt-BR', {
      maximumFractionDigits: 1,
      minimumFractionDigits: 0
    })
    return `${sign}${prefix}${formatted} mil`
  }

  const formatted = absValue.toLocaleString('pt-BR', {
    maximumFractionDigits: 0
  })

  return `${sign}${prefix}${formatted}`
}

export const normalizeString = (text?: string | null): string => {
  if (!text) return ''
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

const computeJaro = (a: string, b: string): number => {
  if (a === b) return 1
  const lenA = a.length
  const lenB = b.length
  if (lenA === 0 || lenB === 0) return 0
  const matchRange = Math.max(Math.floor(Math.max(lenA, lenB) / 2) - 1, 0)
  const aMatches = new Array<boolean>(lenA).fill(false)
  const bMatches = new Array<boolean>(lenB).fill(false)
  let matches = 0
  for (let i = 0; i < lenA; i++) {
    const start = Math.max(0, i - matchRange)
    const end = Math.min(i + matchRange + 1, lenB)
    for (let j = start; j < end; j++) {
      if (bMatches[j] || a[i] !== b[j]) continue
      aMatches[i] = true
      bMatches[j] = true
      matches++
      break
    }
  }
  if (matches === 0) return 0
  let transpositions = 0
  let k = 0
  for (let i = 0; i < lenA; i++) {
    if (!aMatches[i]) continue
    while (!bMatches[k]) k++
    if (a[i] !== b[k]) transpositions++
    k++
  }
  return (matches / lenA + matches / lenB + (matches - transpositions / 2) / matches) / 3
}

export const jaroWinklerSimilarity = (a: string, b: string): number => {
  const jaroScore = computeJaro(a, b)
  let prefix = 0
  const limit = Math.min(4, a.length, b.length)
  for (let i = 0; i < limit; i++) {
    if (a[i] !== b[i]) break
    prefix++
  }
  return jaroScore + prefix * 0.1 * (1 - jaroScore)
}