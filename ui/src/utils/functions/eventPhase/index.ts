import type { EventPhase } from "@utils/types/events";

export const getEventPhase = (event: {
  startsAt: string;
  uploadsCloseAt: string;
  galleryExpiresAt: string;
  closedAt?: string;
}): EventPhase => {
  const now = Date.now();
  if (now < new Date(event.startsAt).getTime()) return "upcoming";
  if (now > new Date(event.galleryExpiresAt).getTime()) return "expired";
  if (event.closedAt) return "closed";
  if (now <= new Date(event.uploadsCloseAt).getTime()) return "open";
  return "closed";
};

export const isEventStarted = (startsAt: string): boolean => Date.now() >= new Date(startsAt).getTime();

export const canReopenEvent = (event: {
  startsAt: string;
  closedAt?: string;
  creditType?: "free" | "paid";
}): boolean => {
  if (!event.closedAt) return false;
  const durationHours = event.creditType === "free" ? 4 : 8;
  const maxEndsAt = new Date(event.startsAt).getTime() + durationHours * 60 * 60 * 1000;
  return Date.now() < maxEndsAt;
};

export const getEventRemainingOpenTime = (event: {
  startsAt: string;
  creditType?: "free" | "paid";
}): { hours: number; minutes: number } | null => {
  const durationHours = event.creditType === "free" ? 4 : 8;
  const maxEndsAt = new Date(event.startsAt).getTime() + durationHours * 60 * 60 * 1000;
  const diffMs = maxEndsAt - Date.now();
  if (diffMs <= 0) return null;
  const hours = Math.floor(diffMs / (60 * 60 * 1000));
  const minutes = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));
  return { hours, minutes };
};
