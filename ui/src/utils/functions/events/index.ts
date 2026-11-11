import { eventPlanLimits } from '@assets/data/events'

import type { EventPlanTier } from '@utils/types/events'

export const getEventLimits = (event?: { planTier?: EventPlanTier; maxOrganizers?: number; maxScreens?: number } | null) => {
  const tier: EventPlanTier = event?.planTier ?? 'single'
  const fallback = eventPlanLimits[tier] || eventPlanLimits.single
  return {
    tier,
    maxOrganizers: event?.maxOrganizers ?? fallback.maxOrganizers,
    maxScreens: event?.maxScreens ?? fallback.maxScreens
  }
}

export const generateRandomPin = (excludePin?: string): string => {
  let pin = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')
  while (excludePin && pin === excludePin) {
    pin = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')
  }
  return pin
}

export const buildGuestLink = (guestToken: string): string => `${window.location.origin}/e/${guestToken}`

export const buildScreenLink = (guestToken: string): string => `${window.location.origin}/e/${guestToken}/screen`

export const getErrorMessage = (error: unknown, fallback: string): string => {
  const data = (error as { response?: { data?: { details?: unknown; message?: string } } })?.response?.data
  if (typeof data?.details === 'string') return data.details
  return data?.message ?? fallback
}

export const formatGuestTaNaFoto = (name: string): string => {
  const trimmed = name.trim()
  if (!trimmed) return 'voceTaNaFoto'

  const words = trimmed.split(/\s+/).filter(Boolean)
  const camelWords = words.map((word, idx) => {
    const clean = word.replace(/[^a-zA-Z0-9À-ÿ]/g, '')
    if (!clean) return ''
    const lower = clean.toLowerCase()
    return idx === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1)
  })

  const base = camelWords.join('') || 'alguem'
  return `${base}TaNaFoto`
}
