import type { EventPhase, EventType, PhotoVisibility, PinRotationMinutes } from '@actions/events/types'

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

export const buildGuestLink = (guestToken: string): string => `${window.location.origin}/e/${guestToken}`

export const buildScreenLink = (guestToken: string): string => `${window.location.origin}/e/${guestToken}/screen`

export const getErrorMessage = (error: unknown, fallback: string): string => {
  const data = (error as { response?: { data?: { details?: unknown; message?: string } } })?.response?.data
  if (typeof data?.details === 'string') return data.details
  return data?.message ?? fallback
}
