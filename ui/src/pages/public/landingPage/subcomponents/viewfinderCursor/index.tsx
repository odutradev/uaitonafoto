import { useEffect, useRef, useState } from "react";
import { GlobalStyles } from "@mui/material";

import usePrefersReducedMotion from "@hooks/usePrefersReducedMotion";

import { Corners, Dot, Finder, Flash, hideNativeCursorStyles, Label, Layer, Ring } from "./styles";
import type { CursorShot, CursorTarget } from "./types";

const interactiveSelector = "a, button, [role='button'], input, label, [data-cursor]";

const readLabel = (element: Element | null) => {
  const target = element?.closest(interactiveSelector);
  if (!target) return null;
  return target.getAttribute("data-cursor") ?? "clique";
};

const ViewfinderCursor = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const finderRef = useRef<HTMLDivElement>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [shots, setShots] = useState<CursorShot[]>([]);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    const sync = () => setIsEnabled(media.matches && !prefersReducedMotion);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!isEnabled) return;
    const root = document.documentElement;
    root.setAttribute("data-viewfinder", "");

    const target: CursorTarget = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current: CursorTarget = { ...target };
    const frame = { id: 0 };

    const tick = () => {
      current.x += (target.x - current.x) * 0.32;
      current.y += (target.y - current.y) * 0.32;
      const tilt = Math.max(-12, Math.min(12, (target.x - current.x) * 0.25));
      if (finderRef.current) {
        finderRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) rotate(${tilt}deg)`;
      }
      frame.id = window.requestAnimationFrame(tick);
    };

    const handleMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      setIsVisible(true);
      setHoverLabel(readLabel(event.target as Element | null));
    };

    const handleLeave = () => setIsVisible(false);
    const handleDown = () => setIsPressed(true);
    const handleUp = (event: PointerEvent) => {
      setIsPressed(false);
      const shot = { id: Date.now() + Math.random(), x: event.clientX, y: event.clientY };
      setShots((previous) => [...previous.slice(-3), shot]);
      window.setTimeout(() => setShots((previous) => previous.filter((item) => item.id !== shot.id)), 700);
    };

    frame.id = window.requestAnimationFrame(tick);
    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);
    document.addEventListener("pointerleave", handleLeave);

    return () => {
      root.removeAttribute("data-viewfinder");
      window.cancelAnimationFrame(frame.id);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      document.removeEventListener("pointerleave", handleLeave);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <Layer aria-hidden="true">
      <GlobalStyles styles={hideNativeCursorStyles} />
      {shots.map((shot) => (
        <span key={shot.id}>
          <Flash style={{ left: shot.x, top: shot.y }} />
          <Ring style={{ left: shot.x, top: shot.y }} />
        </span>
      ))}
      <Finder ref={finderRef} data-visible={isVisible} data-hover={Boolean(hoverLabel)} data-pressed={isPressed}>
        <Corners />
        <Dot />
        <Label>{hoverLabel ?? ""}</Label>
      </Finder>
    </Layer>
  );
};

export default ViewfinderCursor;
