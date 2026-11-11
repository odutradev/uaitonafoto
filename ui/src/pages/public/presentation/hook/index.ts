import { useCallback, useEffect, useRef, useState } from "react";

import { getPlans } from "@actions/payments";
import useAction from "@hooks/useAction";
import useSystemStore from "@stores/system";
import createPageContext from "@utils/functions/createPageContext";
import { formatPriceInBrl } from "@utils/functions/formatters";
import type { PlanApiItem } from "@utils/types/payments";

import presentationData from "@pages/public/presentation/data";
import type { PresentationPlan, SlideDirection, SlideId, UsePresentationReturn } from "./types";

import type { PointerEvent as ReactPointerEvent } from "react";

const slideIds = Object.keys(presentationData) as SlideId[];
const canvasWidth = 1600;
const canvasHeight = 900;
const swipeDistance = 50;
const nextKeys = ["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"];
const previousKeys = ["ArrowLeft", "ArrowUp", "PageUp", "Backspace"];
const interactiveSelector = "a, button, input, textarea, select";

const clampIndex = (index: number) => Math.min(slideIds.length - 1, Math.max(0, index));

const readIndexFromHash = () => {
  const value = Number.parseInt(window.location.hash.replace("#", ""), 10);
  return Number.isNaN(value) ? 0 : clampIndex(value - 1);
};

const readScale = () => Math.min(window.innerWidth / canvasWidth, window.innerHeight / canvasHeight);

const toPresentationPlan = (item: PlanApiItem): PresentationPlan => ({
  id: item.id || item.abacateProductId,
  title: item.title || item.name,
  price: formatPriceInBrl(item.price),
  period: item.period || (item.type === "SUBSCRIPTION" ? "/mês" : item.type === "FREE" ? "sem cartão" : "por evento"),
  description: item.description,
  features: (item.features || []).filter((feature) => !feature.toLowerCase().startsWith("tudo")).slice(0, 4),
  badge: item.badge,
  isHighlighted: Boolean(item.highlighted)
});

const usePresentationState = (): UsePresentationReturn => {
  const runAction = useAction();
  const { themeMode } = useSystemStore((state) => state.system);
  const toggleTheme = useSystemStore((state) => state.toggleTheme);
  const [currentIndex, setCurrentIndex] = useState(readIndexFromHash);
  const [direction, setDirection] = useState<SlideDirection>(1);
  const [scale, setScale] = useState(readScale);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [plans, setPlans] = useState<PresentationPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const pointerStart = useRef<number | null>(null);

  const handleGoTo = useCallback(
    (index: number) => {
      const next = clampIndex(index);
      if (next === currentIndex) return;
      setDirection(next > currentIndex ? 1 : -1);
      setCurrentIndex(next);
    },
    [currentIndex]
  );

  const handleNext = useCallback(() => handleGoTo(currentIndex + 1), [currentIndex, handleGoTo]);
  const handlePrevious = useCallback(() => handleGoTo(currentIndex - 1), [currentIndex, handleGoTo]);

  const handleToggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined);
      return;
    }
    document.documentElement.requestFullscreen?.().catch(() => undefined);
  }, []);

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    pointerStart.current = event.clientX;
  }, []);

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const start = pointerStart.current;
      pointerStart.current = null;
      if (start === null || (event.target as Element).closest(interactiveSelector)) return;
      const distance = event.clientX - start;
      if (Math.abs(distance) >= swipeDistance) {
        if (distance < 0) handleNext();
        if (distance > 0) handlePrevious();
        return;
      }
      if (event.pointerType !== "mouse") return;
      if (event.clientX < window.innerWidth / 3) {
        handlePrevious();
        return;
      }
      handleNext();
    },
    [handleNext, handlePrevious]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.target as Element).closest(interactiveSelector) && event.key !== "Escape") return;
      if (nextKeys.includes(event.key)) {
        event.preventDefault();
        handleNext();
        return;
      }
      if (previousKeys.includes(event.key)) {
        event.preventDefault();
        handlePrevious();
        return;
      }
      if (event.key === "Home") handleGoTo(0);
      if (event.key === "End") handleGoTo(slideIds.length - 1);
      if (event.key.toLowerCase() === "f") handleToggleFullscreen();
      if (event.key.toLowerCase() === "t") toggleTheme();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrevious, handleGoTo, handleToggleFullscreen, toggleTheme]);

  useEffect(() => {
    const handleResize = () => setScale(readScale());
    const handleFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    const handleHash = () => handleGoTo(readIndexFromHash());

    window.addEventListener("resize", handleResize);
    window.addEventListener("hashchange", handleHash);
    document.addEventListener("fullscreenchange", handleFullscreen);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("hashchange", handleHash);
      document.removeEventListener("fullscreenchange", handleFullscreen);
    };
  }, [handleGoTo]);

  useEffect(() => {
    window.history.replaceState(null, "", `#${currentIndex + 1}`);
  }, [currentIndex]);

  useEffect(() => {
    runAction({
      action: getPlans,
      callback: (items) =>
        setPlans(
          items
            .filter((item) => item.type !== "UPSELL" && item.abacateProductId !== "prod_agency_extra_credit")
            .map(toPresentationPlan)
        )
    }).finally(() => setIsLoadingPlans(false));
  }, [runAction]);

  return {
    data: presentationData,
    slideIds,
    currentIndex,
    currentSlide: slideIds[currentIndex],
    direction,
    total: slideIds.length,
    scale,
    isFullscreen,
    themeMode,
    plans,
    isLoadingPlans,
    handleNext,
    handlePrevious,
    handleGoTo,
    handleToggleFullscreen,
    handlePointerDown,
    handlePointerUp
  };
};

const { PageProvider: PresentationProvider, usePage: usePresentation } = createPageContext(
  usePresentationState,
  "usePresentation"
);

export { PresentationProvider };
export default usePresentation;
