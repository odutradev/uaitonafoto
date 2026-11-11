import { styled } from "@mui/material/styles";

export const RevealBox = styled("div")`
  min-width: 0;
  --reveal-x: 0px;
  --reveal-y: 0px;
  --reveal-scale: 1;
  opacity: 0;
  transform: translate3d(var(--reveal-x), var(--reveal-y), 0) scale(var(--reveal-scale));
  transition:
    opacity 0.45s ease-out var(--reveal-delay, 0ms),
    transform 0.55s cubic-bezier(0.22, 1, 0.36, 1) var(--reveal-delay, 0ms);
  will-change: opacity, transform;

  &[data-effect="rise"] {
    --reveal-y: 18px;
  }

  &[data-effect="zoom"] {
    --reveal-scale: 0.96;
  }

  &[data-effect="slideLeft"] {
    --reveal-x: 24px;
  }

  &[data-effect="slideRight"] {
    --reveal-x: -24px;
  }

  &[data-visible="true"] {
    opacity: 1;
    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    filter: none;
    transform: none;
    transition: none;
  }
`;
