import { styled } from "@mui/material/styles";

import { brandColors, landingColors } from "@styles/theme";

export const Heading = styled("header")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing(2)};
  max-width: 760px;

  &[data-align="center"] {
    align-items: center;
    text-align: center;
    margin-inline: auto;
  }
`;

export const Eyebrow = styled("span")`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  background: ${brandColors.flashYellow};
  color: ${brandColors.ink};
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  [data-tone="yellow"] & {
    background: ${brandColors.ink};
    color: ${brandColors.flashYellow};
  }
`;

export const Title = styled("h2")`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.h2.fontFamily};
  font-weight: 800;
  font-size: clamp(2.1rem, 7vw, 4.4rem);
  line-height: 0.98;
  letter-spacing: -0.05em;
  color: ${brandColors.paper};

  [data-tone="light"] &,
  [data-tone="yellow"] & {
    color: ${brandColors.ink};
  }
`;

export const Mark = styled("span")`
  background-image: linear-gradient(${brandColors.flashYellow}, ${brandColors.flashYellow});
  background-repeat: no-repeat;
  background-position: left 92%;
  background-size: 0% 0.16em;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  transition: background-size 1s cubic-bezier(0.16, 1, 0.3, 1) 0.35s;

  [data-visible="true"] & {
    background-size: 100% 0.16em;
  }

  [data-tone="dark"] & {
    color: ${brandColors.flashYellow};
    background-image: linear-gradient(${landingColors.yellowGlow}, ${landingColors.yellowGlow});
  }

  [data-tone="yellow"] & {
    background-image: linear-gradient(${brandColors.ink}, ${brandColors.ink});
  }
`;

export const Description = styled("p")`
  margin: 0;
  max-width: 620px;
  font-size: clamp(1rem, 2.4vw, 1.15rem);
  line-height: 1.6;
  color: ${brandColors.darkTextSecondary};

  [data-tone="light"] &,
  [data-tone="yellow"] & {
    color: ${brandColors.textGray};
  }

  [data-tone="yellow"] & {
    color: ${brandColors.ink};
  }
`;
