import { styled } from "@mui/material/styles";

import { brandColors, landingColors } from "@styles/theme";

export const Panel = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 480px;
  padding: 26px;
  border-radius: 32px;
  background: ${brandColors.ink};
  color: ${brandColors.paper};
  box-shadow: 0 50px 100px -40px ${landingColors.shadowDeep};
`;

export const Header = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 700;

  & em {
    padding: 4px 12px;
    border-radius: 999px;
    background: ${landingColors.live};
    font-size: 14px;
    font-style: normal;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
`;

export const Photo = styled("div")`
  height: 280px;
  overflow: hidden;
  border-radius: 22px;
`;

export const Meta = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;

  & small {
    display: block;
    color: ${brandColors.darkTextSecondary};
    font-size: 17px;
  }

  & em {
    padding: 6px 12px;
    border-radius: 999px;
    background: ${landingColors.yellowSoft};
    color: ${brandColors.flashYellow};
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
  }
`;

export const Actions = styled("div")`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  & span {
    display: grid;
    place-items: center;
    min-height: 58px;
    border: 2px solid ${landingColors.glassBorder};
    border-radius: 999px;
    font-size: 20px;
    font-weight: 800;
  }

  & span:last-of-type {
    border-color: ${landingColors.approve};
    background: ${landingColors.approve};
    color: ${brandColors.ink};
  }
`;
