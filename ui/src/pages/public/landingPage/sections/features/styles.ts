import { styled } from "@mui/material/styles";

import { brandColors, landingColors } from "@styles/theme";

export const Section = styled("section")`
  position: relative;
  padding: ${({ theme }) => theme.spacing(12, 2)};
  background: ${brandColors.darkBg};
  color: ${brandColors.paper};

  ${({ theme }) => theme.breakpoints.up("md")} {
    padding: ${({ theme }) => theme.spacing(16, 4)};
  }
`;

export const Inner = styled("div")`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
  max-width: 1240px;
  margin: 0 auto;
`;

export const Grid = styled("div")`
  display: grid;
  gap: ${({ theme }) => theme.spacing(2)};

  ${({ theme }) => theme.breakpoints.up("sm")} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${({ theme }) => theme.breakpoints.up("md")} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const Card = styled("article")`
  --x: 50%;
  --y: 50%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1.5)};
  height: 100%;
  padding: ${({ theme }) => theme.spacing(3)};
  overflow: hidden;
  border: 1px solid ${landingColors.glassBorder};
  border-radius: 24px;
  background: ${brandColors.darkPaper};
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.4s ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(320px circle at var(--x) var(--y), ${landingColors.yellowSoft}, transparent 60%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover {
    border-color: ${landingColors.yellowGlow};
    transform: translateY(-6px);
  }

  &:hover::before {
    opacity: 1;
  }

  & > * {
    position: relative;
  }

  & h3 {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-family: ${({ theme }) => theme.typography.h5.fontFamily};
    font-size: 1.2rem;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  & p {
    margin: 0;
    font-size: 0.94rem;
    line-height: 1.55;
    color: ${brandColors.darkTextSecondary};
  }
`;

export const Icon = styled("span")`
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${brandColors.flashYellow};
  color: ${brandColors.ink};
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);

  article:hover > & {
    transform: rotate(-8deg) scale(1.08);
  }
`;

export const Badge = styled("span")`
  padding: 2px 8px;
  border-radius: 999px;
  background: ${brandColors.flashYellow};
  color: ${brandColors.ink};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;
