import { styled } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";

import { brandColors, landingColors } from "@styles/theme";

export const Header = styled("header")`
  --read: 0;
  position: fixed;
  top: 12px;
  left: 12px;
  right: 12px;
  z-index: 1100;
  display: flex;
  justify-content: center;
  pointer-events: none;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);

  &[data-hidden="true"] {
    transform: translateY(-140%);
  }

  ${({ theme }) => theme.breakpoints.up("md")} {
    top: 18px;
  }
`;

export const Bar = styled("nav")`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
  width: 100%;
  max-width: 1180px;
  padding: 8px 8px 8px 16px;
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: 999px;
  pointer-events: auto;
  transition:
    background 0.4s ease,
    border-color 0.4s ease,
    backdrop-filter 0.4s ease;

  &[data-scrolled="true"] {
    border-color: ${landingColors.glassBorder};
    background: ${landingColors.glass};
    backdrop-filter: blur(16px) saturate(1.4);
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    width: 100%;
    background: ${brandColors.flashYellow};
    transform-origin: left;
    transform: scaleX(var(--read));
  }
`;

export const Links = styled("ul")`
  display: none;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;

  & a {
    display: block;
    padding: 8px 14px;
    border-radius: 999px;
    color: ${brandColors.darkTextSecondary};
    font-size: 0.88rem;
    font-weight: 600;
    text-decoration: none;
    transition:
      color 0.2s ease,
      background 0.2s ease;
  }

  & a:hover {
    background: ${landingColors.glassLight};
    color: ${brandColors.paper};
  }

  ${({ theme }) => theme.breakpoints.up("md")} {
    display: flex;
  }
`;

export const Actions = styled("div")`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  & .MuiButton-root {
    padding: 8px 18px;
    font-size: 0.92rem;
  }
`;

export const UserBadge = styled(RouterLink)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px 4px 4px;
  border: 1px solid ${landingColors.glassBorder};
  border-radius: 999px;
  color: ${brandColors.paper};
  text-decoration: none;

  & .MuiAvatar-root {
    width: 30px;
    height: 30px;
    background: ${brandColors.flashYellow};
    color: ${brandColors.ink};
    font-size: 0.85rem;
    font-weight: 800;
  }

  & > span {
    display: none;
    flex-direction: column;
    line-height: 1.15;
  }

  & small {
    font-size: 0.62rem;
    color: ${brandColors.darkTextSecondary};
  }

  & strong {
    max-width: 120px;
    overflow: hidden;
    font-size: 0.82rem;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  ${({ theme }) => theme.breakpoints.up("sm")} {
    & > span {
      display: flex;
    }
  }
`;

export const ShortLabel = styled("span")`
  ${({ theme }) => theme.breakpoints.up("sm")} {
    display: none;
  }
`;

export const LongLabel = styled("span")`
  display: none;

  ${({ theme }) => theme.breakpoints.up("sm")} {
    display: inline;
  }
`;
