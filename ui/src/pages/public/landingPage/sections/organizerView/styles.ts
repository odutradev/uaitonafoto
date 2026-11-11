import { keyframes, styled } from "@mui/material/styles";

import { brandColors, landingColors } from "@styles/theme";

const enter = keyframes`
  from { opacity: 0; transform: translateY(30px) scale(0.92) rotate(-2deg); }
  to { opacity: 1; transform: none; }
`;

const exitApprove = keyframes`
  to { opacity: 0; transform: translate(70%, 40%) scale(0.3) rotate(12deg); }
`;

const exitReject = keyframes`
  to { opacity: 0; transform: translateX(-80%) rotate(-18deg); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 ${landingColors.yellowGlow}; }
  100% { box-shadow: 0 0 0 14px transparent; }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px) scale(0.8); }
  to { opacity: 1; transform: none; }
`;

const countdown = keyframes`
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
`;

export const Section = styled("section")`
  position: relative;
  padding: ${({ theme }) => theme.spacing(12, 2)};
  background: ${brandColors.paper};
  color: ${brandColors.ink};

  ${({ theme }) => theme.breakpoints.up("md")} {
    padding: ${({ theme }) => theme.spacing(16, 4)};
  }
`;

export const Inner = styled("div")`
  display: grid;
  gap: ${({ theme }) => theme.spacing(6)};
  max-width: 1240px;
  margin: 0 auto;

  ${({ theme }) => theme.breakpoints.up("lg")} {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    align-items: center;
    gap: ${({ theme }) => theme.spacing(8)};
  }
`;

export const Copy = styled("div")`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

export const Bullets = styled("div")`
  display: grid;
  gap: ${({ theme }) => theme.spacing(1.5)};
`;

export const Bullet = styled("div")`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1.5)};
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing(2)};
  border: 1px solid ${brandColors.lightBorder};
  border-radius: 18px;
  background: ${brandColors.sand};

  & > span:first-of-type {
    display: grid;
    place-items: center;
    flex: none;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: ${brandColors.ink};
    color: ${brandColors.flashYellow};
  }

  & strong {
    display: block;
    font-family: ${({ theme }) => theme.typography.h6.fontFamily};
    letter-spacing: -0.02em;
  }

  & p {
    margin: 2px 0 0;
    font-size: 0.9rem;
    color: ${brandColors.textGray};
  }
`;

export const Panel = styled("div")`
  position: relative;
  display: grid;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(2)};
  border-radius: 28px;
  background: ${brandColors.ink};
  color: ${brandColors.paper};
  box-shadow: 0 60px 120px -50px ${landingColors.shadowDeep};

  ${({ theme }) => theme.breakpoints.up("sm")} {
    padding: ${({ theme }) => theme.spacing(3)};
  }
`;

export const PanelHeader = styled("div")`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  font-weight: 700;

  & span:last-of-type {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    background: ${landingColors.live};
    font-size: 0.62rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
`;

export const Stats = styled("div")`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

export const Stat = styled("div")`
  padding: 10px 12px;
  border-radius: 14px;
  background: ${landingColors.glassLight};

  & strong {
    display: block;
    font-family: ${({ theme }) => theme.typography.h4.fontFamily};
    font-size: clamp(1.1rem, 3vw, 1.6rem);
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.03em;
    color: ${brandColors.flashYellow};
  }

  & span {
    font-size: 0.68rem;
    color: ${brandColors.darkTextSecondary};
  }
`;

export const Workspace = styled("div")`
  display: grid;
  gap: ${({ theme }) => theme.spacing(2)};

  ${({ theme }) => theme.breakpoints.up("sm")} {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  }
`;

export const Queue = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const QueueLabel = styled("span")`
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${brandColors.darkTextSecondary};
`;

export const Card = styled("div")`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 20px;
  background: ${brandColors.darkSurface};
  animation: ${enter} 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;

  &[data-exit="approve"] {
    animation: ${exitApprove} 0.5s cubic-bezier(0.6, 0, 0.4, 1) forwards;
  }

  &[data-exit="reject"] {
    animation: ${exitReject} 0.45s cubic-bezier(0.6, 0, 0.4, 1) forwards;
  }
`;

export const CardPhoto = styled("div")`
  position: relative;
  aspect-ratio: 4 / 3.4;
`;

export const Timer = styled("i")`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 3;
  height: 3px;
  background: ${brandColors.flashYellow};
  transform-origin: left;
  animation: ${countdown} var(--auto, 3.4s) linear both;
`;

export const CardMeta = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  font-size: 0.78rem;

  & strong {
    font-weight: 800;
  }

  & small {
    display: block;
    color: ${brandColors.darkTextSecondary};
  }

  & em {
    flex: none;
    padding: 3px 8px;
    border-radius: 999px;
    background: ${landingColors.yellowSoft};
    color: ${brandColors.flashYellow};
    font-size: 0.64rem;
    font-style: normal;
    font-weight: 700;
  }

  & em[data-warning="true"] {
    background: ${landingColors.glassLight};
    color: ${landingColors.reject};
  }
`;

export const Decisions = styled("div")`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 8px;
`;

export const DecisionButton = styled("button")`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  border: 1.5px solid ${landingColors.glassBorder};
  border-radius: 999px;
  background: transparent;
  color: ${brandColors.paper};
  font: inherit;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.96);
  }

  &[data-variant="approve"] {
    border-color: ${landingColors.approve};
    background: ${landingColors.approve};
    color: ${brandColors.ink};
  }

  &[data-variant="reject"]:hover {
    border-color: ${landingColors.reject};
    color: ${landingColors.reject};
  }

  &[data-suggested="true"] {
    animation: ${pulse} 1.2s ease-out infinite;
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;

export const Side = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Tables = styled("div")`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
`;

export const TableCell = styled("div")`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 52px;
  padding: 7px 8px;
  overflow: hidden;
  border-radius: 12px;
  background: ${landingColors.glassLight};
  font-size: 0.62rem;
  font-weight: 700;
  transition: transform 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: ${brandColors.flashYellow};
    opacity: calc(var(--heat, 0) * 0.85);
    transition: opacity 0.6s ease;
  }

  & > * {
    position: relative;
  }

  & strong {
    font-size: 0.9rem;
    font-variant-numeric: tabular-nums;
  }

  &[data-hot="true"] {
    color: ${brandColors.ink};
  }

  &[data-active="true"] {
    outline: 2px solid ${brandColors.paper};
    outline-offset: 1px;
    transform: scale(1.05);
  }
`;

export const OnScreen = styled("div")`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  min-height: 58px;

  & > div {
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 10px;
    animation: ${slideIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
`;

export const EmptySlot = styled("span")`
  aspect-ratio: 1;
  border: 1.5px dashed ${landingColors.glassBorder};
  border-radius: 10px;
`;
