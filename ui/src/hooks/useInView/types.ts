import type { RefObject } from "react";

export type InViewTarget = RefObject<Element | null>;

export interface InViewOptions {
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
}
