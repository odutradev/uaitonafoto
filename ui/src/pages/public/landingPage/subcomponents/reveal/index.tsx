import { useRef } from "react";

import useInView from "@hooks/useInView";

import { RevealBox } from "./styles";
import type { RevealProps } from "./types";

import type { CSSProperties } from "react";

const Reveal = ({ children, delay = 0, effect = "rise", className }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { threshold: 0.15 });

  return (
    <RevealBox
      ref={ref}
      className={className}
      data-effect={effect}
      data-visible={isInView}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </RevealBox>
  );
};

export default Reveal;
