import type { EventPhase, EventPlanTier, EventType, PhotoVisibility, PinRotationMinutes } from '@actions/events/types'

export const EVENT_PLAN_LIMITS: Record<EventPlanTier, { maxOrganizers: number; maxScreens: number }> = {
  single: { maxOrganizers: 1, maxScreens: 2 },
  essential: { maxOrganizers: 2, maxScreens: 3 },
  pro: { maxOrganizers: 5, maxScreens: 4 }
}

export const getEventLimits = (event?: { planTier?: EventPlanTier; maxOrganizers?: number; maxScreens?: number } | null) => {
  const tier: EventPlanTier = event?.planTier ?? 'single'
  const fallback = EVENT_PLAN_LIMITS[tier] || EVENT_PLAN_LIMITS.single
  return {
    tier,
    maxOrganizers: event?.maxOrganizers ?? fallback.maxOrganizers,
    maxScreens: event?.maxScreens ?? fallback.maxScreens
  }
}

export const eventTypeLabels: Record<EventType, string> = {
  birthday: 'Aniversário',
  wedding: 'Casamento',
  corporate: 'Corporativo',
  other: 'Outro'
}

export const photoVisibilityLabels: Record<PhotoVisibility, string> = {
  during_event: 'Durante o evento',
  after_event: 'Somente após o evento'
}

export const pinRotationLabels: Record<PinRotationMinutes, string> = {
  5: 'A cada 5 minutos',
  15: 'A cada 15 minutos',
  30: 'A cada 30 minutos',
  60: 'A cada 60 minutos'
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

export const eventPhaseLabels: Record<EventPhase, string> = {
  upcoming: 'Em breve',
  open: 'Recebendo fotos',
  closed: 'Envio encerrado',
  expired: 'Galeria encerrada'
}

export const MAX_EVENT_SCREENS = 2
export const MAX_EVENT_ORGANIZERS = 5

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
