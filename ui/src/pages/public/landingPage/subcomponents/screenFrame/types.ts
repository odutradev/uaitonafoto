import type { ReactNode } from "react";

export interface ScreenFrameProps {
  children: ReactNode;
  label?: string;
  pin?: string;
  isLive?: boolean;
  className?: string;
}
