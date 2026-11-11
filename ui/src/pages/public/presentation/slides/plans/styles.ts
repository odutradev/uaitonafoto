import { styled } from "@mui/material/styles";

import { brandColors, landingColors } from "@styles/theme";

export const Grid = styled("div")`
  display: grid;
  grid-template-columns: repeat(var(--columns, 4), minmax(0, 1fr));
  gap: 18px;
  width: 100%;
`;

export const Card = styled("article")`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  padding: 26px;
  border: 1px solid ${brandColors.lightBorder};
  border-radius: 26px;
  background: ${landingColors.flashWhite};

  &[data-highlighted="true"] {
    border-color: ${brandColors.ink};
    background: ${brandColors.ink};
    color: ${brandColors.paper};
  }

  & h3 {
    margin: 0;
    font-family: ${({ theme }) => theme.typography.h4.fontFamily};
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  & ul {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 6px 0 0;
    padding: 0;
    list-style: none;
    font-size: 18px;
  }

  & li::before {
    content: "●";
    margin-right: 8px;
    color: ${brandColors.flashYellow};
    font-size: 12px;
    vertical-align: middle;
  }
`;

export const Badge = styled("span")`
  position: absolute;
  top: -14px;
  right: 20px;
  padding: 5px 12px;
  border-radius: 999px;
  background: ${brandColors.flashYellow};
  color: ${brandColors.ink};
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const Price = styled("div")`
  display: flex;
  align-items: baseline;
  gap: 8px;

  & strong {
    font-family: ${({ theme }) => theme.typography.h2.fontFamily};
    font-size: 46px;
    font-weight: 800;
    letter-spacing: -0.05em;
  }

  & span {
    font-size: 18px;
    color: ${brandColors.textGray};
  }

  [data-highlighted="true"] & span {
    color: ${brandColors.darkTextSecondary};
  }
`;

export const Notice = styled("p")`
  margin: 0;
  padding: 22px 26px;
  border-radius: 20px;
  background: ${brandColors.sand};
  font-size: 24px;
  font-weight: 700;
`;
