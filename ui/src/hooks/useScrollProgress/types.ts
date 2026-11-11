import type { RefObject } from "react";

export type ScrollProgressTarget = RefObject<HTMLElement | null>;

export interface ScrollProgressOptions {
  steps?: number;
  mode?: "pinned" | "through" | "center";
}
