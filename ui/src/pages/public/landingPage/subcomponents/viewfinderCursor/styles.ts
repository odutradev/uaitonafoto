import { keyframes, styled } from "@mui/material/styles";

import { brandColors, landingColors } from "@styles/theme";

const flash = keyframes`
  0% { opacity: 0.9; transform: translate(-50%, -50%) scale(0.2); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(1.6); }
`;

const ring = keyframes`
  0% { opacity: 1; transform: translate(-50%, -50%) scale(0.4); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(2.2); }
`;

export const hideNativeCursorStyles = {
  "html[data-viewfinder], html[data-viewfinder] *": {
    cursor: "none !important"
  }
};

export const Layer = styled("div")`
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  pointer-events: none;
`;

export const Finder = styled("div")`
  --size: 38px;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  will-change: transform;
  transition: opacity 0.25s ease;

  &[data-visible="true"] {
    opacity: 1;
  }

  &[data-hover="true"] {
    --size: 62px;
  }

  &[data-pressed="true"] {
    --size: 26px;
  }
`;

export const Corners = styled("span")`
  position: absolute;
  left: calc(var(--size) / -2);
  top: calc(var(--size) / -2);
  width: var(--size);
  height: var(--size);
  transition:
    width 0.35s cubic-bezier(0.3, 1.5, 0.5, 1),
    height 0.35s cubic-bezier(0.3, 1.5, 0.5, 1),
    left 0.35s cubic-bezier(0.3, 1.5, 0.5, 1),
    top 0.35s cubic-bezier(0.3, 1.5, 0.5, 1);
  background:
    linear-gradient(${brandColors.flashYellow}, ${brandColors.flashYellow}) left top / 10px 2px no-repeat,
    linear-gradient(${brandColors.flashYellow}, ${brandColors.flashYellow}) left top / 2px 10px no-repeat,
    linear-gradient(${brandColors.flashYellow}, ${brandColors.flashYellow}) right top / 10px 2px no-repeat,
    linear-gradient(${brandColors.flashYellow}, ${brandColors.flashYellow}) right top / 2px 10px no-repeat,
    linear-gradient(${brandColors.flashYellow}, ${brandColors.flashYellow}) left bottom / 10px 2px no-repeat,
    linear-gradient(${brandColors.flashYellow}, ${brandColors.flashYellow}) left bottom / 2px 10px no-repeat,
    linear-gradient(${brandColors.flashYellow}, ${brandColors.flashYellow}) right bottom / 10px 2px no-repeat,
    linear-gradient(${brandColors.flashYellow}, ${brandColors.flashYellow}) right bottom / 2px 10px no-repeat;
  filter: drop-shadow(0 0 4px ${landingColors.shadowDeep});
`;

export const Dot = styled("span")`
  position: absolute;
  left: -3px;
  top: -3px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${brandColors.flashYellow};
  box-shadow: 0 0 0 2px ${brandColors.ink};
`;

export const Label = styled("span")`
  position: absolute;
  top: calc(var(--size) / 2 + 8px);
  left: 0;
  padding: 3px 8px;
  border-radius: 999px;
  background: ${brandColors.flashYellow};
  color: ${brandColors.ink};
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  opacity: 0;
  transform: translate(-50%, -4px);
  transition:
    opacity 0.2s ease,
    transform 0.3s ease,
    top 0.35s cubic-bezier(0.3, 1.5, 0.5, 1);

  [data-hover="true"] > & {
    opacity: 1;
    transform: translate(-50%, 0);
  }
`;

export const Flash = styled("span")`
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, ${landingColors.flashWhite} 0%, ${landingColors.yellowGlow} 35%, transparent 70%);
  mix-blend-mode: screen;
  animation: ${flash} 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) both;
`;

export const Ring = styled("span")`
  position: absolute;
  width: 48px;
  height: 48px;
  border: 2px solid ${brandColors.flashYellow};
  border-radius: 6px;
  animation: ${ring} 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
`;
