import { keyframes, styled } from "@mui/material/styles";

import { brandColors, landingColors } from "@styles/theme";

const drop = keyframes`
  from { opacity: 0; transform: translateY(-18px) rotate(calc(var(--rot) * 2)) scale(0.96); }
  to { opacity: 1; transform: rotate(var(--rot)); }
`;

const grow = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const shimmer = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
`;

export const Section = styled("section")`
  position: relative;
  overflow: hidden;
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

  ${({ theme }) => theme.breakpoints.up("md")} {
    gap: ${({ theme }) => theme.spacing(8)};
  }
`;

export const Perspective = styled("div")`
  display: grid;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(2)};
  border: 1px solid ${landingColors.glassBorder};
  border-radius: 32px;
  background: linear-gradient(160deg, ${brandColors.darkPaper}, ${brandColors.darkBg});

  ${({ theme }) => theme.breakpoints.up("md")} {
    grid-template-columns: 280px 1fr;
    padding: ${({ theme }) => theme.spacing(3)};
  }
`;

export const Guests = styled("div")`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;

  ${({ theme }) => theme.breakpoints.up("md")} {
    flex-direction: column;
    overflow: visible;
  }
`;

export const GuestsLabel = styled("span")`
  display: none;
  margin-bottom: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${brandColors.darkTextSecondary};

  ${({ theme }) => theme.breakpoints.up("md")} {
    display: block;
  }
`;

export const GuestButton = styled("button")`
  position: relative;
  display: flex;
  flex: none;
  align-items: center;
  gap: 10px;
  padding: 8px 14px 8px 8px;
  overflow: hidden;
  border: 1px solid ${landingColors.glassBorder};
  border-radius: 999px;
  background: transparent;
  color: ${brandColors.paper};
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    color 0.3s ease;

  & strong {
    display: block;
    font-size: 0.9rem;
  }

  & small {
    display: none;
    font-size: 0.72rem;
    color: ${brandColors.darkTextSecondary};
  }

  &[aria-pressed="true"] {
    border-color: ${brandColors.flashYellow};
    background: ${brandColors.flashYellow};
    color: ${brandColors.ink};
  }

  &[aria-pressed="true"] small {
    color: ${brandColors.ink};
  }

  &[aria-pressed="true"]::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    height: 3px;
    width: 100%;
    background: ${brandColors.ink};
    transform-origin: left;
    animation: ${grow} var(--cycle, 5s) linear both;
  }

  &[data-paused="true"]::after {
    display: none;
  }

  ${({ theme }) => theme.breakpoints.up("md")} {
    border-radius: 18px;

    & small {
      display: block;
    }
  }
`;

export const Avatar = styled("span")`
  display: grid;
  place-items: center;
  flex: none;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  color: ${brandColors.ink};
  font-weight: 800;
  text-transform: uppercase;
`;

export const Timeline = styled("div")`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  min-width: 0;
`;

export const TimelineHeader = styled("div")`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;

  & h3 {
    margin: 0;
    font-family: ${({ theme }) => theme.typography.h3.fontFamily};
    font-size: clamp(1.3rem, 3.6vw, 2rem);
    font-weight: 800;
    letter-spacing: -0.04em;
  }

  & h3 span {
    color: ${brandColors.flashYellow};
  }

  & small {
    font-size: 0.8rem;
    color: ${brandColors.darkTextSecondary};
  }
`;

export const Night = styled("div")`
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(1, 0.5, 0)};

  ${({ theme }) => theme.breakpoints.up("sm")} {
    grid-template-columns: repeat(4, 1fr);
    padding-top: ${({ theme }) => theme.spacing(5)};

    &::before {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      top: 18px;
      height: 2px;
      background: linear-gradient(90deg, ${brandColors.flashYellow}, ${landingColors.glassBorder});
    }
  }
`;

export const Polaroid = styled("figure")`
  --rot: 0deg;
  position: relative;
  margin: 0;
  padding: 8px 8px 0;
  border-radius: 10px;
  background: ${brandColors.paper};
  color: ${brandColors.ink};
  box-shadow: 0 24px 40px -18px ${landingColors.shadowDeep};
  transform: rotate(var(--rot));
  animation: ${drop} 0.45s cubic-bezier(0.34, 1.4, 0.64, 1) both;
  animation-delay: calc(var(--i) * 50ms);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    z-index: 2;
    transform: rotate(0deg) translateY(-8px) scale(1.04);
  }

  & > div {
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 4px;
  }

  & figcaption {
    display: flex;
    justify-content: space-between;
    gap: 6px;
    padding: 8px 2px 10px;
    font-size: 0.74rem;
    font-weight: 700;
  }

  & figcaption span:last-of-type {
    color: ${brandColors.textGray};
    font-variant-numeric: tabular-nums;
  }

  ${({ theme }) => theme.breakpoints.up("sm")} {
    &::before {
      content: "";
      position: absolute;
      left: 50%;
      top: -32px;
      width: 12px;
      height: 12px;
      margin-left: -6px;
      border: 3px solid ${brandColors.darkBg};
      border-radius: 50%;
      background: ${brandColors.flashYellow};
    }
  }
`;

export const Extras = styled("div")`
  display: grid;
  gap: ${({ theme }) => theme.spacing(2)};

  ${({ theme }) => theme.breakpoints.up("md")} {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  }
`;

export const Card = styled("div")`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  height: 100%;
  padding: ${({ theme }) => theme.spacing(2.5)};
  border: 1px solid ${landingColors.glassBorder};
  border-radius: 28px;
  background: ${landingColors.glassLight};

  & h3 {
    margin: 0;
    font-family: ${({ theme }) => theme.typography.h4.fontFamily};
    font-size: clamp(1.2rem, 3vw, 1.6rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.03em;
  }

  & p {
    margin: 0;
    font-size: 0.92rem;
    color: ${brandColors.darkTextSecondary};
  }

  ${({ theme }) => theme.breakpoints.up("sm")} {
    padding: ${({ theme }) => theme.spacing(3)};
  }
`;

export const Compare = styled("div")`
  --split: 50%;
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 20px;
  touch-action: pan-y;
`;

export const CompareLayer = styled("div")`
  position: absolute;
  inset: 0;

  &[data-side="after"] {
    clip-path: inset(0 0 0 var(--split));
  }
`;

export const CompareTag = styled("span")`
  position: absolute;
  top: 12px;
  z-index: 3;
  padding: 4px 10px;
  border-radius: 999px;
  background: ${landingColors.glass};
  backdrop-filter: blur(6px);
  font-size: 0.68rem;
  font-weight: 800;

  &[data-side="before"] {
    left: 12px;
    color: ${landingColors.whatsapp};
  }

  &[data-side="after"] {
    right: 12px;
    background: ${brandColors.flashYellow};
    color: ${brandColors.ink};
  }
`;

export const Handle = styled("span")`
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--split);
  z-index: 3;
  width: 2px;
  margin-left: -1px;
  background: ${brandColors.flashYellow};
  pointer-events: none;

  &::after {
    content: "⟷";
    position: absolute;
    left: 50%;
    top: 50%;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${brandColors.flashYellow};
    color: ${brandColors.ink};
    font-weight: 800;
    transform: translate(-50%, -50%);
    box-shadow: 0 6px 20px ${landingColors.shadowDeep};
  }
`;

export const RangeInput = styled("input")`
  position: absolute;
  inset: 0;
  z-index: 4;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: ew-resize;

  &:focus-visible + span::after {
    outline: 2px solid ${brandColors.paper};
    outline-offset: 2px;
  }
`;

export const ZipFile = styled("div")`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border-radius: 18px;
  background: ${brandColors.darkSurface};

  & > span:first-of-type {
    display: grid;
    place-items: center;
    flex: none;
    width: 52px;
    height: 60px;
    border-radius: 10px 18px 10px 10px;
    background: ${brandColors.flashYellow};
    color: ${brandColors.ink};
    font-size: 0.7rem;
    font-weight: 800;
  }

  & strong {
    display: block;
    font-size: 0.92rem;
    word-break: break-all;
  }

  & small {
    color: ${brandColors.darkTextSecondary};
  }
`;

export const DownloadButton = styled("button")`
  position: relative;
  min-height: 52px;
  margin-top: auto;
  overflow: hidden;
  border: 0;
  border-radius: 999px;
  background: ${brandColors.darkSurface};
  color: ${brandColors.paper};
  font: inherit;
  font-weight: 800;
  cursor: pointer;

  & > i {
    position: absolute;
    inset: 0;
    background: ${brandColors.flashYellow};
    transform-origin: left;
    transform: scaleX(var(--done, 0));
    transition: transform 0.12s linear;
  }

  & > i::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, ${landingColors.flashWhite}, transparent);
    opacity: 0.5;
    animation: ${shimmer} 1s linear infinite;
  }

  & > span {
    position: relative;
    mix-blend-mode: difference;
    color: ${brandColors.paper};
  }

  &[data-state="idle"] {
    background: ${brandColors.flashYellow};
    color: ${brandColors.ink};
  }

  &[data-state="idle"] > span,
  &[data-state="done"] > span {
    mix-blend-mode: normal;
    color: ${brandColors.ink};
  }

  &[data-state="done"] > i::after {
    display: none;
  }
`;

export const Thumbs = styled("div")`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;

  & > div {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 10px;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  & > div:hover {
    transform: scale(1.08) rotate(-3deg);
  }

  & > div:last-of-type::after {
    content: attr(data-more);
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    background: ${landingColors.glass};
    color: ${brandColors.flashYellow};
    font-size: 0.8rem;
    font-weight: 800;
  }
`;
