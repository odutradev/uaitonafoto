import { styled } from "@mui/material/styles";

import { brandColors, landingColors } from "@styles/theme";

export const Chips = styled("div")`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  & span {
    padding: 10px 20px;
    border-radius: 999px;
    background: ${brandColors.flashYellow};
    color: ${brandColors.ink};
    font-size: 20px;
    font-weight: 800;
  }
`;

export const Scene = styled("div")`
  position: relative;
  width: 100%;
`;

export const QrCard = styled("div")`
  position: absolute;
  right: -24px;
  bottom: -40px;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 22px 16px 16px;
  border-radius: 22px;
  background: ${brandColors.flashYellow};
  color: ${brandColors.ink};
  font-size: 22px;
  font-weight: 800;
  line-height: 1.15;
  box-shadow: 0 30px 60px -20px ${landingColors.shadowDeep};

  & svg {
    width: 96px;
    height: 96px;
    padding: 6px;
    border-radius: 12px;
    background: ${brandColors.paper};
  }
`;
