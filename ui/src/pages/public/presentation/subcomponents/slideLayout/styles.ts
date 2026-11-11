import { keyframes, styled } from "@mui/material/styles";

import { brandColors, landingColors } from "@styles/theme";

const appear = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: none; }
`;

const underline = keyframes`
  from { background-size: 0% 0.14em; }
  to { background-size: 100% 0.14em; }
`;

const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

export const Slide = styled("section")`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.92fr);
  align-items: center;
  gap: 64px;
  width: 100%;
  height: 100%;
  padding: 80px 100px 120px;
  background: ${brandColors.darkBg};
  color: ${brandColors.paper};

  &[data-tone="light"] {
    background: ${brandColors.paper};
    color: ${brandColors.ink};
  }

  &[data-tone="yellow"] {
    background: ${brandColors.flashYellow};
    color: ${brandColors.ink};
  }

  &[data-full="true"] {
    grid-template-columns: minmax(0, 1fr);
    align-content: center;
  }
`;

export const Copy = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 22px;
  min-width: 0;
`;

export const Eyebrow = styled("span")`
  padding: 8px 18px;
  border-radius: 999px;
  background: ${brandColors.flashYellow};
  color: ${brandColors.ink};
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  animation: ${appear} 0.4s ${ease} both;

  [data-tone="yellow"] & {
    background: ${brandColors.ink};
    color: ${brandColors.flashYellow};
  }
`;

export const Title = styled("h2")`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.h1.fontFamily};
  font-size: 76px;
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -0.055em;
  animation: ${appear} 0.45s ${ease} 0.04s both;

  [data-full="true"] & {
    max-width: 1300px;
  }
`;

export const Mark = styled("span")`
  background-image: linear-gradient(${brandColors.flashYellow}, ${brandColors.flashYellow});
  background-repeat: no-repeat;
  background-position: left 92%;
  background-size: 100% 0.14em;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  animation: ${underline} 0.5s ${ease} 0.2s both;

  [data-tone="dark"] & {
    color: ${brandColors.flashYellow};
    background-image: linear-gradient(${landingColors.yellowGlow}, ${landingColors.yellowGlow});
  }

  [data-tone="yellow"] & {
    background-image: linear-gradient(${brandColors.ink}, ${brandColors.ink});
  }
`;

export const Lead = styled("p")`
  max-width: 760px;
  margin: 0;
  font-size: 25px;
  line-height: 1.45;
  color: ${brandColors.darkTextSecondary};
  animation: ${appear} 0.45s ${ease} 0.08s both;

  [data-tone="light"] & {
    color: ${brandColors.textGray};
  }

  [data-tone="yellow"] & {
    color: ${brandColors.ink};
  }
`;

export const Visual = styled("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 0;
  max-height: 700px;
  animation: ${appear} 0.5s ${ease} 0.1s both;
`;

export const Item = styled("div")`
  animation: ${appear} 0.4s ${ease} both;
  animation-delay: calc(var(--i, 0) * 50ms + 120ms);
`;

export const Points = styled("div")`
  display: grid;
  gap: 16px;
  width: 100%;

  &[data-columns="2"] {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &[data-columns="3"] {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  &[data-columns="4"] {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

export const Point = styled("div")`
  height: 100%;
  padding: 18px 22px;
  border: 1px solid ${landingColors.glassBorder};
  border-radius: 24px;
  background: ${landingColors.glassLight};

  & strong {
    display: block;
    margin-bottom: 6px;
    font-family: ${({ theme }) => theme.typography.h4.fontFamily};
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  & span {
    font-size: 19px;
    line-height: 1.4;
    color: ${brandColors.darkTextSecondary};
  }

  [data-tone="light"] & {
    border-color: ${brandColors.lightBorder};
    background: ${brandColors.sand};
  }

  [data-tone="light"] & span {
    color: ${brandColors.textGray};
  }

  [data-tone="yellow"] & {
    border-color: transparent;
    background: ${brandColors.ink};
    color: ${brandColors.paper};
  }
`;

export const StepNumber = styled("span")`
  display: inline-grid;
  place-items: center;
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
  border-radius: 12px;
  background: ${brandColors.flashYellow};
  color: ${brandColors.ink};
  font-family: ${({ theme }) => theme.typography.h4.fontFamily};
  font-size: 22px;
  font-weight: 800;
`;
