import { styled } from "@mui/material/styles";

import { brandColors, landingColors } from "@styles/theme";

export const Box = styled("aside")`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2.5)};
  max-width: 1240px;
  margin: ${({ theme }) => theme.spacing(8)} auto 0;
  padding: ${({ theme }) => theme.spacing(3)};
  border: 1px solid ${brandColors.lightBorder};
  border-radius: 28px;
  background: ${brandColors.sand};
  color: ${brandColors.ink};

  &[data-tone="dark"] {
    border-color: ${landingColors.glassBorder};
    background: ${landingColors.glassLight};
    color: ${brandColors.paper};
  }

  &[data-layout="stack"] {
    margin-top: ${({ theme }) => theme.spacing(4)};
    background: ${brandColors.paper};
  }

  ${({ theme }) => theme.breakpoints.up("md")} {
    &[data-layout="bar"] {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: ${({ theme }) => theme.spacing(4)};
      padding: ${({ theme }) => theme.spacing(3, 3, 3, 4)};
    }
  }
`;

export const Copy = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;

  & strong {
    font-family: ${({ theme }) => theme.typography.h3.fontFamily};
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.15;
  }

  & span {
    font-size: 0.95rem;
    line-height: 1.5;
    color: ${brandColors.textGray};
  }

  [data-tone="dark"] & span {
    color: ${brandColors.darkTextSecondary};
  }
`;

export const Actions = styled("div")`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex-shrink: 0;

  & .MuiButton-root {
    padding: 12px 22px;
    font-size: 0.95rem;
  }

  [data-tone="light"] & .MuiButton-contained {
    background: ${brandColors.ink};
    color: ${brandColors.flashYellow};
  }

  [data-tone="light"] & .MuiButton-contained:hover {
    background: ${brandColors.darkPaper};
  }

  [data-tone="light"] & .MuiButton-outlined {
    border-color: ${brandColors.ink};
    color: ${brandColors.ink};
  }

  [data-tone="dark"] & .MuiButton-outlined {
    border-color: ${landingColors.glassBorder};
    color: ${brandColors.paper};
  }
`;
