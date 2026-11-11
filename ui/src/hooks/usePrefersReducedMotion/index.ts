import { useEffect, useState } from "react";

const query = "(prefers-reduced-motion: reduce)";

const readPreference = () => typeof window !== "undefined" && window.matchMedia(query).matches;

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(readPreference);

  useEffect(() => {
    const media = window.matchMedia(query);
    const handleChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
};

export default usePrefersReducedMotion;
