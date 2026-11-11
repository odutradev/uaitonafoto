import { styled } from "@mui/material/styles";

import { brandColors, landingColors } from "@styles/theme";

export const Body = styled("div")`
  position: relative;
  width: 100%;
  aspect-ratio: 9 / 19;
  padding: 7px;
  border-radius: 38px;
  background: linear-gradient(160deg, ${brandColors.darkBorder}, ${brandColors.ink} 40%);
  box-shadow:
    0 0 0 1px ${landingColors.glassBorder},
    0 40px 80px -20px ${landingColors.shadowDeep};
`;

export const Screen = styled("div")`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 31px;
  background: ${brandColors.darkBg};
  color: ${brandColors.paper};
`;

export const Island = styled("span")`
  position: absolute;
  top: 9px;
  left: 50%;
  z-index: 5;
  width: 34%;
  height: 20px;
  border-radius: 999px;
  background: ${brandColors.ink};
  transform: translateX(-50%);
`;
