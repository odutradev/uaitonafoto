import type { EventPhase, EventType, PhotoVisibility } from '@actions/events/types'

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

export const eventPhaseLabels: Record<EventPhase, string> = {
  upcoming: 'Em breve',
  open: 'Recebendo fotos',
  closed: 'Envio encerrado',
  expired: 'Galeria encerrada'
}

export const buildGuestLink = (guestToken: string): string => `${window.location.origin}/e/${guestToken}`

export const getErrorMessage = (error: unknown, fallback: string): string => {
  const data = (error as { response?: { data?: { details?: unknown; message?: string } } })?.response?.data
  if (typeof data?.details === 'string') return data.details
  return data?.message ?? fallback
}
