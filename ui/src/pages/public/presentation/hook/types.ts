import type { PointerEvent as ReactPointerEvent } from "react";

import type { PresentationData } from "@pages/public/presentation/data";

export type SlideId = keyof PresentationData;

export type SlideDirection = 1 | -1;

export interface PresentationPlan {
  id: string;
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  badge?: string;
  isHighlighted: boolean;
}

export interface UsePresentationReturn {
  data: PresentationData;
  slideIds: SlideId[];
  currentIndex: number;
  currentSlide: SlideId;
  direction: SlideDirection;
  total: number;
  scale: number;
  isFullscreen: boolean;
  plans: PresentationPlan[];
  isLoadingPlans: boolean;
  handleNext: () => void;
  handlePrevious: () => void;
  handleGoTo: (index: number) => void;
  handleToggleFullscreen: () => void;
  handlePointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  handlePointerUp: (event: ReactPointerEvent<HTMLElement>) => void;
}
