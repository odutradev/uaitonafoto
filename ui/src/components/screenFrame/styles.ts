import { keyframes, styled } from "@mui/material/styles";

import { brandColors, landingColors } from "@styles/theme";

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.35; transform: scale(0.7); }
`;

export const Wrapper = styled("div")`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const Bezel = styled("div")`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  padding: 6px;
  border-radius: 14px;
  background: ${brandColors.ink};
  box-shadow:
    0 0 0 1px ${landingColors.glassBorder},
    0 30px 70px -25px ${landingColors.shadowDeep},
    0 0 90px -30px ${landingColors.yellowGlow};
`;

export const Display = styled("div")`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 9px;
  background: ${brandColors.darkBg};
`;

export const Stand = styled("span")`
  width: 18%;
  height: 10px;
  margin-top: -1px;
  border-radius: 0 0 10px 10px;
  background: linear-gradient(${brandColors.ink}, ${brandColors.darkSurface});
`;

export const Badges = styled("div")`
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  z-index: 4;
  display: flex;
  justify-content: space-between;
  gap: 6px;
  pointer-events: none;
`;

export const Badge = styled("span")`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: 999px;
  background: ${landingColors.glass};
  backdrop-filter: blur(6px);
  color: ${brandColors.paper};
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;

  &[data-live="true"] {
    background: ${landingColors.live};
  }

  &[data-live="true"]::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${brandColors.paper};
    animation: ${pulse} 1.4s ease-in-out infinite;
  }
`;
