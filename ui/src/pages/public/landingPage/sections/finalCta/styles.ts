import { keyframes, styled } from "@mui/material/styles";

import { brandColors, landingColors } from "@styles/theme";

const float = keyframes`
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -14px; }
`;

const ring = keyframes`
  0% { transform: scale(0.9); opacity: 0.8; }
  100% { transform: scale(1.35); opacity: 0; }
`;

export const Section = styled("section")`
  --progress: 0;
  position: relative;
  padding: ${({ theme }) => theme.spacing(4, 2)};
  background: ${brandColors.paper};

  ${({ theme }) => theme.breakpoints.up("md")} {
    padding: ${({ theme }) => theme.spacing(6, 4, 10)};
  }
`;

export const Block = styled("div")`
  position: relative;
  max-width: 1240px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(8, 3)};
  overflow: hidden;
  border-radius: 36px;
  background: ${brandColors.flashYellow};
  color: ${brandColors.ink};

  ${({ theme }) => theme.breakpoints.up("md")} {
    padding: ${({ theme }) => theme.spacing(12, 8)};
  }
`;

export const Content = styled("div")`
  position: relative;
  z-index: 2;
  display: grid;
  gap: ${({ theme }) => theme.spacing(4)};

  ${({ theme }) => theme.breakpoints.up("md")} {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.6fr);
    align-items: end;
  }
`;

export const Copy = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing(3)};

  & h2 {
    margin: 0;
    font-family: ${({ theme }) => theme.typography.h1.fontFamily};
    font-size: clamp(2.2rem, 7.5vw, 5rem);
    font-weight: 800;
    line-height: 0.95;
    letter-spacing: -0.055em;
  }

  & p {
    margin: 0;
    max-width: 480px;
    font-size: 1.05rem;
    line-height: 1.55;
  }
`;

export const ButtonWrap = styled("div")`
  position: relative;
  display: inline-flex;

  &::before,
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border: 2px solid ${brandColors.ink};
    border-radius: 999px;
    animation: ${ring} 2s ease-out infinite;
    pointer-events: none;
  }

  &::after {
    animation-delay: 1s;
  }

  & .MuiButton-root {
    position: relative;
    padding: 16px 30px;
    background: ${brandColors.ink};
    color: ${brandColors.flashYellow};
    font-size: 1.05rem;
  }

  & .MuiButton-root:hover {
    background: ${brandColors.darkPaper};
  }

  @media (prefers-reduced-motion: reduce) {
    &::before,
    &::after {
      display: none;
    }
  }
`;

export const QrBox = styled("div")`
  display: flex;
  align-items: center;
  gap: 14px;
  justify-self: start;
  padding: 14px;
  border-radius: 22px;
  background: ${brandColors.ink};
  color: ${brandColors.paper};

  & svg {
    flex: none;
    width: 84px;
    height: 84px;
    padding: 6px;
    border-radius: 12px;
    background: ${brandColors.paper};
  }

  & strong {
    display: block;
    font-family: ${({ theme }) => theme.typography.h5.fontFamily};
    font-size: 1.05rem;
    color: ${brandColors.flashYellow};
  }

  & small {
    color: ${brandColors.darkTextSecondary};
  }

  ${({ theme }) => theme.breakpoints.up("md")} {
    justify-self: end;
  }
`;

export const Floating = styled("div")`
  position: absolute;
  z-index: 1;
  display: none;
  width: 120px;
  padding: 6px 6px 18px;
  border-radius: 8px;
  background: ${brandColors.paper};
  box-shadow: 0 20px 40px -16px ${landingColors.shadowDeep};
  transform: translateY(calc((0.5 - var(--progress)) * var(--depth, 80px))) rotate(var(--rot, 0deg));
  animation: ${float} 6s ease-in-out infinite;
  animation-delay: var(--delay, 0s);

  & > div {
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 4px;
  }

  ${({ theme }) => theme.breakpoints.up("md")} {
    display: block;
  }
`;
