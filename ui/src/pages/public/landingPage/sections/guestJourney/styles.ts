import { keyframes, styled } from "@mui/material/styles";

import { brandColors, landingColors } from "@styles/theme";

const scan = keyframes`
  0%, 100% { top: 6%; }
  50% { top: 88%; }
`;

const blink = keyframes`
  50% { opacity: 0; }
`;

const pop = keyframes`
  0% { opacity: 0; transform: scale(0.6); }
  60% { opacity: 1; transform: scale(1.08); }
  100% { opacity: 1; transform: scale(1); }
`;

const flash = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

export const Section = styled("section")`
  position: relative;
  height: 300vh;
  background: ${brandColors.darkBg};
  color: ${brandColors.paper};
`;

export const Sticky = styled("div")`
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing(9, 2, 3)};

  &::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 900px;
    height: 900px;
    border-radius: 50%;
    background: radial-gradient(circle, ${landingColors.yellowSoft}, transparent 65%);
    transform: translate(-30%, -50%);
    pointer-events: none;
  }

  ${({ theme }) => theme.breakpoints.up("md")} {
    padding: ${({ theme }) => theme.spacing(10, 4, 4)};
  }
`;

export const Inner = styled("div")`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing(3)};
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;

  ${({ theme }) => theme.breakpoints.up("md")} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: center;
    gap: ${({ theme }) => theme.spacing(6)};
  }
`;

export const Copy = styled("div")`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};

  ${({ theme }) => theme.breakpoints.up("md")} {
    gap: ${({ theme }) => theme.spacing(3)};
  }
`;

export const Eyebrow = styled("span")`
  align-self: flex-start;
  padding: 6px 14px;
  border-radius: 999px;
  background: ${brandColors.flashYellow};
  color: ${brandColors.ink};
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

export const Heading = styled("h2")`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.h2.fontFamily};
  font-weight: 800;
  font-size: clamp(1.8rem, 6vw, 3.8rem);
  line-height: 0.98;
  letter-spacing: -0.05em;

  & span {
    color: ${brandColors.flashYellow};
  }
`;

export const Description = styled("p")`
  display: none;
  margin: 0;
  max-width: 500px;
  line-height: 1.6;
  color: ${brandColors.darkTextSecondary};

  ${({ theme }) => theme.breakpoints.up("md")} {
    display: block;
  }
`;

export const Timer = styled("div")`
  display: flex;
  align-items: baseline;
  gap: 10px;
  font-family: ${({ theme }) => theme.typography.h2.fontFamily};
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  font-size: clamp(2.4rem, 7vw, 4.6rem);
  line-height: 1;
  letter-spacing: -0.04em;
  color: ${brandColors.flashYellow};

  & small {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${brandColors.darkTextSecondary};
  }
`;

export const Steps = styled("ol")`
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;

  ${({ theme }) => theme.breakpoints.up("sm")} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const Step = styled("li")`
  position: relative;
  display: none;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  overflow: hidden;
  border: 1px solid ${landingColors.glassBorder};
  border-radius: 16px;
  background: ${landingColors.glassLight};
  opacity: 0.45;
  transition:
    opacity 0.4s ease,
    border-color 0.4s ease,
    transform 0.4s ease;

  &[data-active="true"] {
    display: flex;
    opacity: 1;
    border-color: ${brandColors.flashYellow};
    transform: translateY(-3px);
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    height: 3px;
    width: 100%;
    background: ${brandColors.flashYellow};
    transform-origin: left;
    transform: scaleX(var(--fill, 0));
  }

  & strong {
    font-family: ${({ theme }) => theme.typography.h5.fontFamily};
    font-size: 1rem;
    letter-spacing: -0.02em;
  }

  & span {
    font-size: 0.8rem;
    line-height: 1.4;
    color: ${brandColors.darkTextSecondary};
  }

  & em {
    font-style: normal;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: ${brandColors.flashYellow};
  }

  ${({ theme }) => theme.breakpoints.up("sm")} {
    display: flex;
  }
`;

export const Devices = styled("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 0;
`;

export const PhoneSlot = styled("div")`
  position: relative;
  z-index: 2;
  width: min(230px, 24vh);

  ${({ theme }) => theme.breakpoints.up("md")} {
    width: min(280px, 31vh);
    margin-right: 22%;
  }
`;

export const TvSlot = styled("div")`
  position: absolute;
  right: 0;
  top: 12%;
  z-index: 1;
  display: none;
  width: 50%;
  transform: rotate(4deg);

  ${({ theme }) => theme.breakpoints.up("md")} {
    display: block;
  }
`;

export const TvPhoto = styled("div")`
  position: absolute;
  inset: 0;
  animation: ${pop} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
`;

export const TvFlash = styled("span")`
  position: absolute;
  inset: 0;
  z-index: 3;
  background: ${landingColors.flashWhite};
  animation: ${flash} 0.6s ease both;
`;

export const TvWaiting = styled("div")`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: ${brandColors.darkTextSecondary};
  font-size: 0.75rem;
  font-weight: 700;
`;

export const Screen = styled("div")`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  padding: 44px 14px 16px;
  transition:
    opacity 0.5s ease,
    transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);

  &[data-visible="false"] {
    opacity: 0;
    transform: translateX(var(--exit, 30px));
    pointer-events: none;
  }
`;

export const CameraView = styled("div")`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 50% 120%, ${brandColors.darkBorder}, transparent 60%),
    linear-gradient(${brandColors.darkSurface}, ${brandColors.ink});
`;

export const TableCard = styled("div")`
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 58%;
  padding: 10px;
  border-radius: 10px;
  background: ${brandColors.paper};
  color: ${brandColors.ink};
  font-size: 0.6rem;
  font-weight: 800;
  text-align: center;
  transform: translate(-50%, -50%) perspective(400px) rotateX(18deg) scale(var(--zoom, 1));
  transition: transform 0.3s ease;

  & svg {
    width: 100%;
    height: auto;
  }
`;

export const ScanFrame = styled("div")`
  position: absolute;
  left: 15%;
  right: 15%;
  top: 28%;
  bottom: 28%;
  border-radius: 14px;
  box-shadow: 0 0 0 999px rgba(0, 0, 0, 0.35);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    border: 2px solid ${brandColors.flashYellow};
    mask:
      linear-gradient(#000, #000) left top / 26px 26px no-repeat,
      linear-gradient(#000, #000) right top / 26px 26px no-repeat,
      linear-gradient(#000, #000) left bottom / 26px 26px no-repeat,
      linear-gradient(#000, #000) right bottom / 26px 26px no-repeat;
  }

  &::after {
    content: "";
    position: absolute;
    left: 6%;
    right: 6%;
    height: 2px;
    background: ${brandColors.flashYellow};
    box-shadow: 0 0 12px 2px ${landingColors.yellowGlow};
    animation: ${scan} 2.2s ease-in-out infinite;
  }
`;

export const LinkPill = styled("div")`
  position: absolute;
  left: 10%;
  right: 10%;
  bottom: 12%;
  padding: 10px 12px;
  border-radius: 14px;
  background: ${brandColors.paper};
  color: ${brandColors.ink};
  font-size: 0.66rem;
  font-weight: 700;
  line-height: 1.3;
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity 0.35s ease,
    transform 0.4s ease;

  & small {
    display: block;
    color: ${brandColors.textGray};
    font-weight: 500;
  }

  &[data-visible="true"] {
    opacity: 1;
    transform: none;
  }
`;

export const EventTag = styled("span")`
  align-self: center;
  padding: 4px 10px;
  border-radius: 999px;
  background: ${landingColors.glassLight};
  font-size: 0.62rem;
  font-weight: 700;
`;

export const Prompt = styled("h4")`
  margin: 22px 0 6px;
  font-family: ${({ theme }) => theme.typography.h4.fontFamily};
  font-size: 1.2rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
`;

export const Hint = styled("p")`
  margin: 0 0 16px;
  font-size: 0.7rem;
  color: ${brandColors.darkTextSecondary};
`;

export const Input = styled("div")`
  display: flex;
  align-items: center;
  min-height: 40px;
  padding: 0 12px;
  border: 1.5px solid ${brandColors.flashYellow};
  border-radius: 12px;
  background: ${brandColors.darkSurface};
  font-size: 0.92rem;
  font-weight: 600;

  &::after {
    content: "";
    width: 2px;
    height: 18px;
    margin-left: 2px;
    background: ${brandColors.flashYellow};
    animation: ${blink} 1s step-end infinite;
  }
`;

export const Placeholder = styled("span")`
  color: ${brandColors.darkTextSecondary};
  font-weight: 500;
`;

export const PrimaryButton = styled("span")`
  display: grid;
  place-items: center;
  margin-top: auto;
  min-height: 42px;
  border-radius: 999px;
  background: ${brandColors.flashYellow};
  color: ${brandColors.ink};
  font-size: 0.82rem;
  font-weight: 800;
  transform: scale(var(--press, 1));
  transition: transform 0.2s ease;
`;

export const Feed = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
`;

export const FeedHeader = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.72rem;
  font-weight: 700;

  & span:last-of-type {
    color: ${brandColors.flashYellow};
  }
`;

export const Upload = styled("div")`
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border-radius: 16px;
`;

export const Progress = styled("div")`
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 12px;
  background: ${landingColors.glass};
  backdrop-filter: blur(8px);
  font-size: 0.66rem;
  font-weight: 700;

  & i {
    display: block;
    height: 4px;
    border-radius: 999px;
    background: ${brandColors.flashYellow};
    transform-origin: left;
    transform: scaleX(var(--upload, 0));
  }

  &[data-done="true"] {
    background: ${brandColors.flashYellow};
    color: ${brandColors.ink};
  }
`;

export const MissionChip = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 12px;
  background: ${landingColors.glassLight};
  font-size: 0.66rem;
  font-weight: 700;
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;

  & b {
    color: ${landingColors.live};
  }

  &[data-visible="true"] {
    opacity: 1;
    transform: none;
  }
`;
