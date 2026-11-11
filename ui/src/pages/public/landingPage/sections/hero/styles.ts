import { keyframes, styled } from "@mui/material/styles";

import { brandColors, landingColors } from "@styles/theme";

const wordRise = keyframes`
  from { transform: translateY(100%); }
  to { transform: none; }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: none; }
`;

const kenBurns = keyframes`
  from { transform: scale(1.12) translate(2%, 1%); }
  to { transform: scale(1) translate(0, 0); }
`;

const crossIn = keyframes`
  from { opacity: 0; filter: brightness(2.4); }
  to { opacity: 1; filter: none; }
`;

const fly = keyframes`
  0% { opacity: 0; transform: translate(0, 0) scale(0.32) rotate(-10deg); }
  12% { opacity: 1; }
  70% { opacity: 1; transform: translate(var(--fly-x), var(--fly-y)) scale(1.2) rotate(2deg); }
  100% { opacity: 0; transform: translate(var(--fly-x), var(--fly-y)) scale(1.3) rotate(0deg); }
`;

const toastIn = keyframes`
  0% { opacity: 0; transform: translateY(14px) scale(0.96); }
  12%, 85% { opacity: 1; transform: none; }
  100% { opacity: 0; transform: translateY(-10px); }
`;

const shutter = keyframes`
  0%, 100% { opacity: 0; }
  8% { opacity: 1; }
`;

const bob = keyframes`
  0%, 100% { transform: translateY(0) rotate(-8deg); }
  50% { transform: translateY(-10px) rotate(-6deg); }
`;

const scrollCue = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(220%); }
`;

export const Section = styled("section")`
  --mx: 50%;
  --my: 30%;
  position: relative;
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing(15, 2, 8)};
  background:
    radial-gradient(600px circle at var(--mx) var(--my), ${landingColors.yellowSoft}, transparent 60%),
    ${brandColors.darkBg};
  color: ${brandColors.paper};

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
      linear-gradient(${landingColors.glassLight} 1px, transparent 1px),
      linear-gradient(90deg, ${landingColors.glassLight} 1px, transparent 1px);
    background-size: 64px 64px;
    mask-image: radial-gradient(ellipse at 50% 30%, #000 20%, transparent 75%);
  }

  ${({ theme }) => theme.breakpoints.up("md")} {
    padding: ${({ theme }) => theme.spacing(18, 4, 10)};
  }
`;

export const Inner = styled("div")`
  position: relative;
  display: grid;
  gap: ${({ theme }) => theme.spacing(7)};
  max-width: 1240px;
  margin: 0 auto;

  ${({ theme }) => theme.breakpoints.up("lg")} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.08fr);
    align-items: center;
    gap: ${({ theme }) => theme.spacing(6)};
  }
`;

export const Copy = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const Eyebrow = styled("span")`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px 6px 10px;
  border: 1px solid ${landingColors.glassBorder};
  border-radius: 999px;
  background: ${landingColors.glassLight};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  animation: ${fadeUp} 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${landingColors.live};
    box-shadow: 0 0 0 4px ${landingColors.glassLight};
  }
`;

export const Title = styled("h1")`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.h1.fontFamily};
  font-weight: 800;
  font-size: clamp(2.8rem, 10.5vw, 5.2rem);
  line-height: 0.92;
  letter-spacing: -0.055em;
`;

export const Word = styled("span")`
  display: inline-block;
  overflow: hidden;
  padding-top: 0.16em;
  margin-top: -0.16em;
  padding-bottom: 0.08em;
  margin-bottom: -0.08em;
  vertical-align: top;

  & > span {
    display: inline-block;
    animation: ${wordRise} 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: calc(var(--i) * 35ms + 60ms);
  }

  &[data-highlight="true"] > span {
    color: ${brandColors.flashYellow};
  }
`;

export const Description = styled("p")`
  margin: 0;
  max-width: 560px;
  font-size: clamp(1rem, 2.6vw, 1.12rem);
  line-height: 1.65;
  color: ${brandColors.darkTextSecondary};
  animation: ${fadeUp} 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;

  & strong {
    color: ${brandColors.flashYellow};
    font-weight: 700;
  }
`;

export const Chips = styled("ul")`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
  animation: ${fadeUp} 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.38s both;
`;

export const Chip = styled("li")`
  padding: 7px 14px;
  border: 1px solid ${landingColors.glassBorder};
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  color: ${brandColors.paper};

  &[data-strong="true"] {
    border-color: ${brandColors.flashYellow};
    background: ${brandColors.flashYellow};
    color: ${brandColors.ink};
  }
`;

export const Actions = styled("div")`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  animation: ${fadeUp} 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.45s both;

  & .MuiButton-root {
    padding: 14px 26px;
    font-size: 1rem;
  }

  & .MuiButton-outlined {
    border-color: ${landingColors.glassBorder};
    color: ${brandColors.paper};
  }
`;

export const Stage = styled("div")`
  --rx: 0deg;
  --ry: 0deg;
  position: relative;
  perspective: 1400px;
  animation: ${fadeUp} 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
`;

export const StageTilt = styled("div")`
  position: relative;
  padding: ${({ theme }) => theme.spacing(1.5)};
  border: 1px solid ${landingColors.glassBorder};
  border-radius: 28px;
  background: linear-gradient(160deg, ${brandColors.darkPaper}, ${brandColors.darkBg});
  box-shadow: 0 50px 120px -40px ${landingColors.shadowDeep};
  transform: rotateX(var(--rx)) rotateY(var(--ry));
  transform-style: preserve-3d;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  ${({ theme }) => theme.breakpoints.up("sm")} {
    padding: ${({ theme }) => theme.spacing(2.5)};
  }
`;

export const Board = styled("div")`
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing(1.25)};

  ${({ theme }) => theme.breakpoints.up("sm")} {
    gap: ${({ theme }) => theme.spacing(1.75)};
  }
`;

export const MainSlot = styled("div")`
  position: relative;
  aspect-ratio: 4 / 4.6;
  overflow: hidden;
  border-radius: 18px;
  background: ${brandColors.darkSurface};
`;

export const MainPhoto = styled("div")`
  position: absolute;
  inset: 0;
  border-radius: inherit;
  animation: ${crossIn} 0.45s ease-out both;

  & svg {
    animation: ${kenBurns} 3.2s ease-out both;
  }
`;

export const ShutterFlash = styled("span")`
  position: absolute;
  inset: 0;
  z-index: 3;
  background: ${landingColors.flashWhite};
  pointer-events: none;
  animation: ${shutter} 0.45s ease-out both;
`;

export const LiveBadge = styled("span")`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 4;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  background: ${landingColors.live};
  color: ${brandColors.paper};
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${brandColors.paper};
  }
`;

export const Side = styled("div")`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-auto-rows: 1fr;
  gap: ${({ theme }) => theme.spacing(1.25)};

  ${({ theme }) => theme.breakpoints.up("sm")} {
    gap: ${({ theme }) => theme.spacing(1.75)};
  }
`;

export const Tile = styled("div")`
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  animation: ${crossIn} 0.4s ease-out both;
`;

export const QrCard = styled("div")`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 14px;
  background: ${brandColors.flashYellow};
  color: ${brandColors.ink};
  font-size: 0.78rem;
  font-weight: 800;
  line-height: 1.15;

  & svg {
    flex: none;
    width: 46px;
    height: 46px;
    padding: 4px;
    border-radius: 8px;
    background: ${brandColors.paper};
  }

  ${({ theme }) => theme.breakpoints.up("sm")} {
    font-size: 0.9rem;

    & svg {
      width: 58px;
      height: 58px;
    }
  }
`;

export const Toast = styled("div")`
  position: absolute;
  left: 12px;
  bottom: 12px;
  z-index: 4;
  max-width: calc(100% - 24px);
  padding: 8px 12px;
  border-radius: 12px;
  background: ${landingColors.glass};
  backdrop-filter: blur(10px);
  font-size: 0.78rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  animation: ${toastIn} 2.4s ease both;

  & strong {
    font-weight: 800;
  }
`;

export const Phone = styled("div")`
  position: absolute;
  left: -10px;
  bottom: -46px;
  z-index: 6;
  width: 84px;
  transform: translateZ(60px);
  animation: ${bob} 5s ease-in-out infinite;

  ${({ theme }) => theme.breakpoints.up("sm")} {
    left: -44px;
    bottom: -64px;
    width: 112px;
  }
`;

export const Viewfinder = styled("div")`
  position: absolute;
  inset: 0;

  &::after {
    content: "";
    position: absolute;
    inset: 22% 14%;
    border: 1.5px solid ${brandColors.flashYellow};
    border-radius: 8px;
  }
`;

export const ShootButton = styled("span")`
  position: absolute;
  left: 50%;
  bottom: 10px;
  z-index: 3;
  width: 26px;
  height: 26px;
  border: 3px solid ${brandColors.paper};
  border-radius: 50%;
  background: ${brandColors.flashYellow};
  transform: translateX(-50%);

  ${({ theme }) => theme.breakpoints.up("sm")} {
    width: 34px;
    height: 34px;
  }
`;

export const FlyingPhoto = styled("div")`
  --fly-x: 22%;
  --fly-y: -48%;
  position: absolute;
  left: 4%;
  bottom: 4%;
  z-index: 7;
  width: 40%;
  aspect-ratio: 4 / 4.6;
  overflow: hidden;
  border: 3px solid ${brandColors.paper};
  border-radius: 14px;
  box-shadow: 0 20px 40px -10px ${landingColors.shadowDeep};
  pointer-events: none;
  animation: ${fly} 0.8s cubic-bezier(0.45, 0, 0.2, 1) both;

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

export const ScrollCue = styled("a")`
  position: relative;
  display: none;
  width: 24px;
  height: 40px;
  margin: ${({ theme }) => theme.spacing(8)} auto 0;
  overflow: hidden;
  border: 1.5px solid ${landingColors.glassBorder};
  border-radius: 999px;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 6px;
    width: 4px;
    height: 10px;
    margin-left: -2px;
    border-radius: 999px;
    background: ${brandColors.flashYellow};
    animation: ${scrollCue} 1.8s ease-in-out infinite;
  }

  ${({ theme }) => theme.breakpoints.up("md")} {
    display: block;
  }
`;
