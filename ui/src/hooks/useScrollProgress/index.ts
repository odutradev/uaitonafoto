import { useEffect, useState } from "react";

import type { ScrollProgressOptions, ScrollProgressTarget } from "./types";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const readProgress = (element: HTMLElement, mode: ScrollProgressOptions["mode"]) => {
  const rect = element.getBoundingClientRect();
  const viewport = window.innerHeight;
  if (mode === "through") return clamp((viewport - rect.top) / (viewport + rect.height));
  if (mode === "center") return clamp((viewport * 0.55 - rect.top) / rect.height);
  const distance = rect.height - viewport;
  if (distance <= 0) return rect.top < 0 ? 1 : 0;
  return clamp(-rect.top / distance);
};

const useScrollProgress = (
  target: ScrollProgressTarget,
  { steps = 100, mode = "pinned" }: ScrollProgressOptions = {}
) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = target.current;
    if (!element) return;
    const frame = { id: 0 };

    const update = () => {
      frame.id = 0;
      const value = readProgress(element, mode);
      element.style.setProperty("--progress", value.toFixed(4));
      setProgress(Math.round(value * steps) / steps);
    };

    const schedule = () => {
      if (!frame.id) frame.id = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.cancelAnimationFrame(frame.id);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [target, steps, mode]);

  return progress;
};

export default useScrollProgress;
