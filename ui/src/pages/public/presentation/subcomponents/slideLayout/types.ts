import type { ReactNode } from "react";

export type SlideTone = "dark" | "light" | "yellow";

export interface SlideLayoutProps {
  eyebrow: string;
  title: string;
  highlight: string;
  tone?: SlideTone;
  lead?: string;
  visual?: ReactNode;
  children?: ReactNode;
}
