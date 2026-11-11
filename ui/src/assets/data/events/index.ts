import type { EventPhase, EventPlanTier, EventType, PhotoVisibility, PinRotationMinutes } from "@utils/types/events";

export const eventPlanLimits: Record<EventPlanTier, { maxOrganizers: number; maxScreens: number }> = {
  single: { maxOrganizers: 1, maxScreens: 2 },
  essential: { maxOrganizers: 2, maxScreens: 3 },
  pro: { maxOrganizers: 5, maxScreens: 4 }
};

export const eventTypeLabels: Record<EventType, string> = {
  birthday: "Aniversário",
  wedding: "Casamento",
  corporate: "Corporativo",
  other: "Outro"
};

export const photoVisibilityLabels: Record<PhotoVisibility, string> = {
  during_event: "Durante o evento",
  after_event: "Somente após o evento"
};

export const pinRotationLabels: Record<PinRotationMinutes, string> = {
  5: "A cada 5 minutos",
  15: "A cada 15 minutos",
  30: "A cada 30 minutos",
  60: "A cada 60 minutos"
};

export const eventPhaseLabels: Record<EventPhase, string> = {
  upcoming: "Em breve",
  open: "Recebendo fotos",
  closed: "Envio encerrado",
  expired: "Galeria encerrada"
};

export const maxEventScreens = 2;

export const maxEventOrganizers = 5;
