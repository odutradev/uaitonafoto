import { keyframes, styled } from "@mui/material/styles";

import { brandColors } from "@styles/theme";

const enterForward = keyframes`
  from { opacity: 0; transform: translateX(48px); }
  to { opacity: 1; transform: none; }
`;

const enterBackward = keyframes`
  from { opacity: 0; transform: translateX(-48px); }
  to { opacity: 1; transform: none; }
`;

export const Viewport = styled("main")`
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: ${brandColors.darkBg};
  touch-action: none;
  transition: background 0.35s ease;

  &:has([data-tone="light"]) {
    background: ${brandColors.paper};
  }

  &:has([data-tone="yellow"]) {
    background: ${brandColors.flashYellow};
  }
  user-select: none;
`;

export const Canvas = styled("div")`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 1600px;
  height: 900px;
  overflow: hidden;
  transform: translate(-50%, -50%) scale(var(--scale, 1));
  transform-origin: center;
`;

export const SlideFrame = styled("div")`
  width: 100%;
  height: 100%;
  animation: ${enterForward} 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;

  &[data-direction="-1"] {
    animation-name: ${enterBackward};
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;

    & * {
      animation: none !important;
    }
  }
`;
