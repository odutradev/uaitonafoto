import type { CreatedAtRange } from './types'

export const formatTimestamp = (date: Date = new Date()): string => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`
}

export const formatDateBR = (date: Date): string => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')

  return `${dd}/${mm}/${yyyy}`
}

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const isPast = (date: Date): boolean => {
  return date.getTime() < new Date().getTime()
}

export const buildCreatedAtFilter = ({ since, until }: CreatedAtRange = {}): Record<string, unknown> => {
  if (!since && !until) return {}
  return { createdAt: { ...(since ? { $gte: since } : {}), ...(until ? { $lte: until } : {}) } }
}
