import { styled } from "@mui/material/styles";

import { brandColors, landingColors } from "@styles/theme";

export const PhoneSlot = styled("div")`
  position: relative;
  width: 270px;
`;

export const PhotoArea = styled("div")`
  position: absolute;
  inset: 0;
`;

export const Delivered = styled("span")`
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 26px;
  z-index: 3;
  padding: 14px 18px;
  border-radius: 16px;
  background: ${brandColors.flashYellow};
  color: ${brandColors.ink};
  font-size: 22px;
  font-weight: 800;
  text-align: center;
`;

export const Stats = styled("div")`
  display: flex;
  gap: 36px;
  padding-top: 8px;
  border-top: 1px solid ${landingColors.glassBorder};

  & div {
    display: flex;
    flex-direction: column;
  }

  & strong {
    font-family: ${({ theme }) => theme.typography.h2.fontFamily};
    font-size: 44px;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.04em;
    color: ${brandColors.flashYellow};
  }

  & span {
    font-size: 20px;
    color: ${brandColors.darkTextSecondary};
  }
`;
