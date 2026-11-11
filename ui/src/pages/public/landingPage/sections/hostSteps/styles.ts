import { styled } from "@mui/material/styles";

import { brandColors } from "@styles/theme";

export const Section = styled("section")`
  position: relative;
  padding: ${({ theme }) => theme.spacing(12, 2)};
  background: ${brandColors.sand};
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

  ${({ theme }) => theme.breakpoints.up("md")} {
    grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
    gap: ${({ theme }) => theme.spacing(8)};
  }
`;

export const Aside = styled("div")`
  ${({ theme }) => theme.breakpoints.up("md")} {
    position: sticky;
    top: 120px;
    align-self: start;
  }
`;

export const List = styled("ol")`
  --progress: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  margin: 0;
  padding: 0 0 0 64px;
  list-style: none;

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 23px;
    top: 24px;
    bottom: 24px;
    width: 3px;
    border-radius: 999px;
    background: ${brandColors.sandDark};
  }

  &::after {
    background: ${brandColors.ink};
    transform-origin: top;
    transform: scaleY(var(--progress));
  }

  ${({ theme }) => theme.breakpoints.up("sm")} {
    padding-left: 80px;

    &::before,
    &::after {
      left: 27px;
    }
  }
`;

export const Item = styled("li")`
  position: relative;
  padding: ${({ theme }) => theme.spacing(2.5)};
  border: 1px solid ${brandColors.lightBorder};
  border-radius: 22px;
  background: ${brandColors.paper};
  opacity: 0.55;
  transform: translateX(10px);
  transition:
    opacity 0.5s ease,
    transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.5s ease;

  &[data-active="true"] {
    opacity: 1;
    transform: none;
    box-shadow: 0 24px 50px -30px ${brandColors.textGray};
  }

  & h3 {
    margin: 0 0 6px;
    font-family: ${({ theme }) => theme.typography.h5.fontFamily};
    font-size: 1.15rem;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  & p {
    margin: 0 0 12px;
    font-size: 0.94rem;
    line-height: 1.55;
    color: ${brandColors.textGray};
  }

  & code {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 8px;
    background: ${brandColors.sand};
    font-family: inherit;
    font-size: 0.75rem;
    font-weight: 700;
  }
`;

export const StepNumber = styled("span")`
  position: absolute;
  left: -64px;
  top: 14px;
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  border-radius: 14px;
  background: ${brandColors.ink};
  color: ${brandColors.flashYellow};
  font-family: ${({ theme }) => theme.typography.h3.fontFamily};
  font-size: 1.3rem;
  font-weight: 800;
  transition:
    background 0.4s ease,
    color 0.4s ease,
    transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);

  [data-active="true"] > & {
    background: ${brandColors.flashYellow};
    color: ${brandColors.ink};
    transform: scale(1.08) rotate(-6deg);
  }

  ${({ theme }) => theme.breakpoints.up("sm")} {
    left: -80px;
    width: 58px;
    height: 58px;
  }
`;
