import type { ReactNode } from "react";

export type RevealEffect = "rise" | "fade" | "zoom" | "slideLeft" | "slideRight";

export interface RevealProps {
  children: ReactNode;
  delay?: number;
  effect?: RevealEffect;
  className?: string;
}
