import { styled } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";

import { brandColors, landingColors } from "@styles/theme";

export const FooterBox = styled("footer")`
  padding: ${({ theme }) => theme.spacing(6, 2, 4)};
  background: ${brandColors.ink};
  color: ${brandColors.darkTextSecondary};

  ${({ theme }) => theme.breakpoints.up("md")} {
    padding: ${({ theme }) => theme.spacing(8, 4, 5)};
  }
`;

export const Inner = styled("div")`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  max-width: 1240px;
  margin: 0 auto;
`;

export const Top = styled("div")`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};

  & p {
    margin: 0;
    max-width: 360px;
    font-size: 0.92rem;
    line-height: 1.55;
  }

  ${({ theme }) => theme.breakpoints.up("md")} {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
`;

export const Brand = styled("div")`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1.5)};
`;

export const Links = styled("nav")`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const FooterLink = styled(RouterLink)`
  padding: 8px 14px;
  border: 1px solid ${landingColors.glassBorder};
  border-radius: 999px;
  color: ${brandColors.paper};
  font-size: 0.84rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: ${brandColors.flashYellow};
    color: ${brandColors.ink};
  }
`;

export const Bottom = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: ${({ theme }) => theme.spacing(3)};
  border-top: 1px solid ${landingColors.glassBorder};
  font-size: 0.8rem;

  ${({ theme }) => theme.breakpoints.up("md")} {
    flex-direction: row;
    justify-content: space-between;
  }
`;
