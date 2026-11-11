import { styled } from "@mui/material/styles";

export const RevealBox = styled("div")`
  min-width: 0;
  --reveal-x: 0px;
  --reveal-y: 0px;
  --reveal-scale: 1;
  opacity: 0;
  transform: translate3d(var(--reveal-x), var(--reveal-y), 0) scale(var(--reveal-scale));
  transition:
    opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) var(--reveal-delay, 0ms),
    transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) var(--reveal-delay, 0ms),
    filter 0.9s ease var(--reveal-delay, 0ms);
  filter: blur(6px);

  &[data-effect="rise"] {
    --reveal-y: 36px;
  }

  &[data-effect="zoom"] {
    --reveal-scale: 0.92;
  }

  &[data-effect="slideLeft"] {
    --reveal-x: 48px;
  }

  &[data-effect="slideRight"] {
    --reveal-x: -48px;
  }

  &[data-visible="true"] {
    opacity: 1;
    filter: none;
    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    filter: none;
    transform: none;
    transition: none;
  }
`;
