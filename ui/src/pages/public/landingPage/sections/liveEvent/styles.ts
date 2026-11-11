import { keyframes, styled } from "@mui/material/styles";

import { brandColors, landingColors } from "@styles/theme";

const swap = keyframes`
  from { opacity: 0; transform: scale(1.08); filter: brightness(1.8); }
  to { opacity: 1; transform: none; filter: none; }
`;

const ticker = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

export const Section = styled("section")`
  --progress: 0;
  position: relative;
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing(12, 2)};
  background:
    radial-gradient(ellipse 80% 50% at 50% 0%, ${landingColors.yellowSoft}, transparent 70%), ${brandColors.ink};
  color: ${brandColors.paper};

  ${({ theme }) => theme.breakpoints.up("md")} {
    padding: ${({ theme }) => theme.spacing(16, 4)};
  }
`;

export const Inner = styled("div")`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(8)};
  max-width: 1240px;
  margin: 0 auto;

  ${({ theme }) => theme.breakpoints.up("md")} {
    gap: ${({ theme }) => theme.spacing(12)};
  }
`;

export const Wall = styled("div")`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing(2)};
  perspective: 1600px;

  ${({ theme }) => theme.breakpoints.up("md")} {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.4fr) minmax(0, 0.8fr);
    align-items: center;
    gap: ${({ theme }) => theme.spacing(3)};
  }
`;

export const ScreenSlot = styled("div")`
  transition: transform 0.2s linear;

  &[data-position="center"] {
    grid-column: 1 / -1;
    order: -1;
    transform: translateY(calc((0.5 - var(--progress)) * 60px)) scale(calc(0.94 + var(--progress) * 0.08));
  }

  ${({ theme }) => theme.breakpoints.up("md")} {
    &[data-position="center"] {
      grid-column: auto;
      order: 0;
    }

    &[data-position="left"] {
      transform: rotateY(calc(10deg + var(--progress) * 16deg)) translateY(calc((0.5 - var(--progress)) * 120px));
      transform-origin: right center;
    }

    &[data-position="right"] {
      transform: rotateY(calc(-10deg - var(--progress) * 16deg)) translateY(calc((0.5 - var(--progress)) * 120px));
      transform-origin: left center;
    }
  }
`;

export const ScreenPhoto = styled("div")`
  position: absolute;
  inset: 0;
  animation: ${swap} 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
`;

export const Mosaic = styled("div")`
  position: absolute;
  right: 8px;
  bottom: 8px;
  z-index: 3;
  display: none;
  gap: 4px;

  & > div {
    width: 42px;
    height: 42px;
    overflow: hidden;
    border: 2px solid ${brandColors.paper};
    border-radius: 8px;
    animation: ${swap} 0.6s ease both;
  }

  [data-position="center"] & {
    display: flex;
  }
`;

export const Missions = styled("div")`
  display: grid;
  gap: ${({ theme }) => theme.spacing(4)};

  ${({ theme }) => theme.breakpoints.up("md")} {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    align-items: center;
    gap: ${({ theme }) => theme.spacing(6)};
  }
`;

export const MissionsCopy = styled("div")`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1.5)};

  & h3 {
    margin: 0;
    font-family: ${({ theme }) => theme.typography.h3.fontFamily};
    font-size: clamp(1.6rem, 4vw, 2.4rem);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.04em;
  }

  & p {
    margin: 0;
    max-width: 420px;
    line-height: 1.6;
    color: ${brandColors.darkTextSecondary};
  }
`;

export const Highlights = styled("div")`
  display: grid;
  gap: ${({ theme }) => theme.spacing(1.5)};
  ${({ theme }) => theme.breakpoints.up("sm")} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const Highlight = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: ${({ theme }) => theme.spacing(2.5)};
  border: 1px solid ${landingColors.glassBorder};
  border-radius: 20px;
  background: ${landingColors.glassLight};
  transition:
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.35s ease;

  &:hover {
    border-color: ${brandColors.flashYellow};
    transform: translateY(-4px);
  }

  & strong {
    font-family: ${({ theme }) => theme.typography.h4.fontFamily};
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: ${brandColors.flashYellow};
  }

  & span {
    font-size: 0.9rem;
    line-height: 1.5;
    color: ${brandColors.darkTextSecondary};
  }
`;

export const Ticker = styled("div")`
  overflow: hidden;
  border-block: 1px solid ${landingColors.glassBorder};
  padding-block: ${({ theme }) => theme.spacing(1.5)};
  margin-inline: ${({ theme }) => theme.spacing(-2)};

  & > div {
    display: flex;
    width: max-content;
    animation: ${ticker} 30s linear infinite;
  }

  & span {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding-inline: 20px;
    font-size: 0.9rem;
    color: ${brandColors.darkTextSecondary};
    white-space: nowrap;
  }

  & strong {
    color: ${brandColors.paper};
  }

  & span::before {
    content: "●";
    color: ${landingColors.live};
    font-size: 0.6rem;
  }

  @media (prefers-reduced-motion: reduce) {
    & > div {
      animation: none;
    }
  }
`;
