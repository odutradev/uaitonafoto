import { styled } from "@mui/material/styles";

import { brandColors, landingColors } from "@styles/theme";

export const Progress = styled("div")`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  height: 4px;
  background: ${landingColors.glassLight};

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: ${brandColors.flashYellow};
    transform-origin: left;
    transform: scaleX(var(--progress, 0));
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }
`;

export const Bar = styled("div")`
  position: fixed;
  left: ${({ theme }) => theme.spacing(2)};
  right: ${({ theme }) => theme.spacing(2)};
  bottom: ${({ theme }) => theme.spacing(2)};
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  pointer-events: none;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;

  &[data-idle="true"] {
    opacity: 0;
    transform: translateY(8px);
  }

  & > * {
    pointer-events: auto;
  }
`;

export const Dots = styled("div")`
  display: none;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 999px;
  background: ${landingColors.glass};
  backdrop-filter: blur(10px);

  ${({ theme }) => theme.breakpoints.up("sm")} {
    display: flex;
  }
`;

export const Dot = styled("button")`
  width: 10px;
  height: 10px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: ${landingColors.glassBorder};
  cursor: pointer;
  transition:
    width 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.3s ease;

  &[aria-current="true"] {
    width: 28px;
    background: ${brandColors.flashYellow};
  }

  &:focus-visible {
    outline: 2px solid ${brandColors.paper};
    outline-offset: 2px;
  }
`;

export const Actions = styled("div")`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  padding: 6px;
  border-radius: 999px;
  background: ${landingColors.glass};
  backdrop-filter: blur(10px);
  color: ${brandColors.paper};

  & .MuiIconButton-root {
    color: ${brandColors.paper};
  }

  & .MuiIconButton-root:hover {
    background: ${landingColors.glassLight};
    color: ${brandColors.flashYellow};
  }

  & .MuiIconButton-root.Mui-disabled {
    color: ${landingColors.glassBorder};
  }
`;

export const Counter = styled("span")`
  min-width: 64px;
  font-size: 0.9rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  text-align: center;
`;
