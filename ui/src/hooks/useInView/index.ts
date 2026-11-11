import { useEffect, useState } from "react";

import type { InViewOptions, InViewTarget } from "./types";

const useInView = (target: InViewTarget, { once = true, threshold = 0.2, rootMargin = "0px" }: InViewOptions = {}) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = target.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.disconnect();
          return;
        }
        if (!once) setIsInView(false);
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [target, once, threshold, rootMargin]);

  return isInView;
};

export default useInView;
