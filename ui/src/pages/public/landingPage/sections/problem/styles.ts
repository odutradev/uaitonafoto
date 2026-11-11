import { keyframes, styled } from "@mui/material/styles";

import { brandColors, landingColors } from "@styles/theme";

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 ${landingColors.yellowGlow}; }
  50% { box-shadow: 0 0 0 18px transparent; }
`;

const textIn = keyframes`
  from { opacity: 0; transform: translateY(16px); filter: blur(4px); }
  to { opacity: 1; transform: none; filter: none; }
`;

const ease = "cubic-bezier(0.65, 0, 0.35, 1)";

export const Section = styled("section")`
  position: relative;
  height: 320vh;
  background: ${brandColors.paper};
  color: ${brandColors.ink};
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

  ${({ theme }) => theme.breakpoints.up("md")} {
    padding: ${({ theme }) => theme.spacing(10, 4, 4)};
  }
`;

export const Inner = styled("div")`
  display: grid;
  gap: ${({ theme }) => theme.spacing(3)};
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;

  ${({ theme }) => theme.breakpoints.up("md")} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
    align-items: center;
    gap: ${({ theme }) => theme.spacing(8)};
  }
`;

export const Copy = styled("div")`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};

  ${({ theme }) => theme.breakpoints.up("md")} {
    gap: ${({ theme }) => theme.spacing(3.5)};
  }
`;

export const Eyebrow = styled("span")`
  align-self: flex-start;
  padding: 6px 14px;
  border-radius: 999px;
  background: ${brandColors.flashYellow};
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

export const Heading = styled("h2")`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.h2.fontFamily};
  font-weight: 800;
  font-size: clamp(1.9rem, 6.4vw, 4rem);
  line-height: 0.98;
  letter-spacing: -0.05em;

  & span {
    background: linear-gradient(${brandColors.flashYellow}, ${brandColors.flashYellow}) left 88% / 100% 0.16em no-repeat;
  }
`;

export const Stage = styled("div")`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1.25)};
  min-height: 9.5rem;
  animation: ${textIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;

  ${({ theme }) => theme.breakpoints.up("md")} {
    min-height: 13rem;
  }
`;

export const StageLabel = styled("span")`
  align-self: flex-start;
  padding: 4px 12px;
  border: 1.5px solid ${brandColors.ink};
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;

  &[data-stage="1"] {
    border-color: ${brandColors.ink};
    background: ${brandColors.ink};
    color: ${brandColors.flashYellow};
  }

  &[data-stage="2"] {
    border-color: ${brandColors.flashYellow};
    background: ${brandColors.flashYellow};
  }
`;

export const StageTitle = styled("h3")`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.h3.fontFamily};
  font-weight: 800;
  font-size: clamp(1.2rem, 3.4vw, 1.75rem);
  line-height: 1.1;
  letter-spacing: -0.035em;
`;

export const StageText = styled("p")`
  display: none;
  margin: 0;
  max-width: 520px;
  line-height: 1.6;
  color: ${brandColors.textGray};

  ${({ theme }) => theme.breakpoints.up("sm")} {
    display: block;
  }
`;

export const Rail = styled("div")`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  max-width: 360px;
`;

export const RailSegment = styled("span")`
  position: relative;
  height: 4px;
  overflow: hidden;
  border-radius: 999px;
  background: ${brandColors.sandDark};

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: ${brandColors.ink};
    transform-origin: left;
    transform: scaleX(var(--fill, 0));
  }
`;

export const Canvas = styled("div")`
  position: relative;
  width: 100%;
  max-width: min(560px, 52vh);
  aspect-ratio: 1 / 1;
  margin: 0 auto;

  ${({ theme }) => theme.breakpoints.up("md")} {
    max-width: min(600px, 74vh);
  }
`;

export const Album = styled("div")`
  position: absolute;
  inset: 4% 2% 2%;
  border-radius: 28px;
  background: ${brandColors.ink};
  box-shadow: 0 50px 90px -40px ${landingColors.shadowDeep};
  opacity: 0;
  transform: scale(0.9);
  transition:
    opacity 0.8s ${ease},
    transform 0.8s ${ease};

  [data-stage="2"] > & {
    opacity: 1;
    transform: none;
  }
`;

export const AlbumLabel = styled("span")`
  position: absolute;
  left: 6%;
  bottom: 5%;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${brandColors.flashYellow};
  font-size: clamp(0.7rem, 1.8vw, 0.85rem);
  font-weight: 800;
  letter-spacing: 0.04em;
`;

export const QrHub = styled("div")`
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 24%;
  aspect-ratio: 1;
  padding: 3%;
  border-radius: 22%;
  background: ${brandColors.flashYellow};
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.4) rotate(-20deg);
  transition:
    opacity 0.6s ${ease},
    transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);

  & svg {
    width: 100%;
    height: 100%;
  }

  [data-stage="1"] > & {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    animation: ${glow} 1.6s ease-out infinite;
  }
`;

export const Item = styled("article")`
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition:
    left 0.9s ${ease},
    top 0.9s ${ease},
    width 0.9s ${ease},
    height 0.9s ${ease},
    transform 0.9s ${ease};

  [data-stage="0"] > &:nth-of-type(1) {
    left: 0%;
    top: 12%;
    width: 31%;
    height: 66%;
    transform: rotate(-8deg);
  }

  [data-stage="0"] > &:nth-of-type(2) {
    left: 35%;
    top: 26%;
    width: 31%;
    height: 66%;
    transform: rotate(3deg);
  }

  [data-stage="0"] > &:nth-of-type(3) {
    left: 69%;
    top: 6%;
    width: 31%;
    height: 66%;
    transform: rotate(9deg);
  }

  [data-stage="1"] > &:nth-of-type(1) {
    left: 4%;
    top: 8%;
    width: 26%;
    height: 34%;
    transform: rotate(-6deg);
  }

  [data-stage="1"] > &:nth-of-type(2) {
    left: 37%;
    top: 66%;
    width: 26%;
    height: 34%;
    transform: rotate(4deg);
  }

  [data-stage="1"] > &:nth-of-type(3) {
    left: 70%;
    top: 8%;
    width: 26%;
    height: 34%;
    transform: rotate(7deg);
  }

  [data-stage="2"] > &:nth-of-type(1) {
    left: 7%;
    top: 10%;
    width: 50%;
    height: 72%;
    transform: none;
  }

  [data-stage="2"] > &:nth-of-type(2) {
    left: 60%;
    top: 10%;
    width: 33%;
    height: 35%;
    transform: none;
  }

  [data-stage="2"] > &:nth-of-type(3) {
    left: 60%;
    top: 47%;
    width: 33%;
    height: 35%;
    transform: none;
  }
`;

export const TrapLabel = styled("span")`
  display: flex;
  flex-direction: column;
  align-self: center;
  padding: 5px 10px;
  border-radius: 10px;
  background: ${brandColors.ink};
  color: ${brandColors.paper};
  font-size: clamp(0.55rem, 1.4vw, 0.72rem);
  font-weight: 700;
  line-height: 1.25;
  text-align: center;
  white-space: nowrap;
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;

  & small {
    color: ${landingColors.reject};
    font-size: 0.9em;
    font-weight: 600;
  }

  [data-stage="1"] &,
  [data-stage="2"] & {
    opacity: 0;
    transform: translateY(8px);
  }
`;

export const Shell = styled("div")`
  position: relative;
  flex: 1;
  min-height: 0;
  padding: 5px;
  border-radius: 22px;
  background: ${brandColors.ink};
  box-shadow: 0 24px 50px -20px ${landingColors.shadowDeep};
  transition:
    padding 0.9s ${ease},
    border-radius 0.9s ${ease},
    background 0.9s ${ease};

  & > figure {
    border-radius: 17px;
    transition: border-radius 0.9s ${ease};
  }

  [data-stage="1"] &,
  [data-stage="2"] & {
    padding: 3px;
    border-radius: 16px;
    background: ${brandColors.paper};
  }

  [data-stage="2"] & {
    padding: 0;
  }

  [data-stage="1"] & > figure,
  [data-stage="2"] & > figure {
    border-radius: 14px;
  }
`;
