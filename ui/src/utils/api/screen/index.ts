import axios from "axios";

import defaultConfig from "@assets/config";
import { getClientDeviceId, getClientFingerprint } from "@hooks/usePinLockout";

import type { ScreenEventInfo } from "@utils/types/events";

export const screenTokenStoragePrefix = "uaitonafoto:screen:";
export const screenEventStoragePrefix = "uaitonafoto:screen:event:";
export const screenPinStoragePrefix = "uaitonafoto:screen:pin:";

const screenApi = axios.create({ baseURL: defaultConfig.baseURL });

screenApi.interceptors.request.use((config) => {
  config.headers["x-client-device-id"] = getClientDeviceId();
  config.headers["x-client-fingerprint"] = getClientFingerprint();
  return config;
});

export const getStoredScreenToken = (eventId: string): string | null =>
  localStorage.getItem(`${screenTokenStoragePrefix}${eventId}`);

export const getStoredScreenPin = (eventId: string): string | null =>
  localStorage.getItem(`${screenPinStoragePrefix}${eventId}`);

export const storeScreenPin = (eventId: string, pin: string | null): void => {
  if (pin) {
    localStorage.setItem(`${screenPinStoragePrefix}${eventId}`, pin);
  } else {
    localStorage.removeItem(`${screenPinStoragePrefix}${eventId}`);
  }
};

export const getStoredScreenEvent = (eventId: string): ScreenEventInfo | null => {
  const raw = localStorage.getItem(`${screenEventStoragePrefix}${eventId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ScreenEventInfo;
  } catch {
    return null;
  }
};

export const storeScreenCredential = (
  eventId: string,
  screenToken: string,
  event: ScreenEventInfo,
  pin?: string | null
): void => {
  localStorage.setItem(`${screenTokenStoragePrefix}${eventId}`, screenToken);
  localStorage.setItem(`${screenEventStoragePrefix}${eventId}`, JSON.stringify(event));
  if (pin !== undefined) {
    storeScreenPin(eventId, pin);
  }
};

export const clearScreenCredential = (eventId: string): void => {
  localStorage.removeItem(`${screenTokenStoragePrefix}${eventId}`);
  localStorage.removeItem(`${screenEventStoragePrefix}${eventId}`);
  localStorage.removeItem(`${screenPinStoragePrefix}${eventId}`);
};

export const withScreenToken = (screenToken: string) => ({
  headers: { Authorization: `Bearer ${screenToken}` }
});

export const buildScreenStreamUrl = (eventId: string, screenToken: string): string =>
  `${defaultConfig.baseURL}/events/${encodeURIComponent(eventId)}/screen/stream?token=${encodeURIComponent(screenToken)}`;

export default screenApi;
