import { styled } from "@mui/material/styles";

import { brandColors, landingColors } from "@styles/theme";

export const Section = styled("section")`
  position: relative;
  padding: ${({ theme }) => theme.spacing(12, 2)};
  background: ${brandColors.paper};
  color: ${brandColors.ink};

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
`;

export const Grid = styled("div")`
  display: grid;
  gap: ${({ theme }) => theme.spacing(2)};
  align-items: stretch;

  ${({ theme }) => theme.breakpoints.up("sm")} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${({ theme }) => theme.breakpoints.up("lg")} {
    grid-template-columns: repeat(var(--columns, 4), 1fr);
  }
`;

export const PlanCard = styled("article")`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${({ theme }) => theme.spacing(3)};
  border: 1px solid ${brandColors.lightBorder};
  border-radius: 26px;
  background: ${landingColors.flashWhite};
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.4s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 30px 60px -36px ${brandColors.textGray};
  }

  &[data-highlighted="true"] {
    border-color: ${brandColors.ink};
    background: ${brandColors.ink};
    color: ${brandColors.paper};
    box-shadow: 0 40px 80px -40px ${landingColors.shadowDeep};
  }

  ${({ theme }) => theme.breakpoints.up("lg")} {
    &[data-highlighted="true"] {
      transform: translateY(-14px);
    }

    &[data-highlighted="true"]:hover {
      transform: translateY(-20px);
    }
  }
`;

export const Popular = styled("span")`
  position: absolute;
  top: -12px;
  right: 20px;
  padding: 5px 12px;
  border-radius: 999px;
  background: ${brandColors.flashYellow};
  color: ${brandColors.ink};
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const Tag = styled("span")`
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${brandColors.textGray};

  [data-highlighted="true"] > & {
    color: ${brandColors.flashYellow};
  }
`;

export const Title = styled("h3")`
  margin: 6px 0 14px;
  font-family: ${({ theme }) => theme.typography.h4.fontFamily};
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.03em;
`;

export const Price = styled("div")`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px;

  & strong {
    font-family: ${({ theme }) => theme.typography.h2.fontFamily};
    font-size: 2.2rem;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.05em;
  }

  & span {
    font-size: 0.85rem;
    color: ${brandColors.textGray};
  }

  [data-highlighted="true"] & span {
    color: ${brandColors.darkTextSecondary};
  }
`;

export const SubBadge = styled("span")`
  align-self: flex-start;
  margin-top: 12px;
  padding: 4px 10px;
  border-radius: 8px;
  background: ${brandColors.sand};
  font-size: 0.74rem;
  font-weight: 700;

  &[data-variant="saving"] {
    background: ${brandColors.flashYellow};
    color: ${brandColors.ink};
  }

  [data-highlighted="true"] > &:not([data-variant="saving"]) {
    background: ${brandColors.darkSurface};
  }
`;

export const Description = styled("p")`
  margin: 14px 0 18px;
  font-size: 0.9rem;
  line-height: 1.5;
  color: ${brandColors.textGray};

  [data-highlighted="true"] > & {
    color: ${brandColors.darkTextSecondary};
  }
`;

export const Features = styled("ul")`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  margin: 0 0 24px;
  padding: 0;
  list-style: none;
`;

export const Feature = styled("li")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-size: 0.86rem;
  font-weight: 500;

  & > span {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  & > span > span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    flex: none;
    font-size: 1.05rem;
    color: ${brandColors.ink};
  }

  [data-highlighted="true"] & svg {
    color: ${brandColors.flashYellow};
  }

  & button {
    flex: none;
    color: inherit;
    opacity: 0.5;
  }

  & button:hover {
    opacity: 1;
  }
`;

export const Inherited = styled("li")`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 10px;
  background: ${brandColors.sand};
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;

  & svg {
    font-size: 1rem;
  }

  [data-highlighted="true"] & {
    background: ${landingColors.yellowSoft};
    color: ${brandColors.flashYellow};
  }
`;

export const Cta = styled("div")`
  & .MuiButton-root {
    width: 100%;
    min-height: 50px;
  }

  & .MuiButton-outlined {
    border-color: ${brandColors.ink};
    color: ${brandColors.ink};
  }
`;

export const Audiences = styled("div")`
  display: grid;
  gap: ${({ theme }) => theme.spacing(1.5)};

  ${({ theme }) => theme.breakpoints.up("sm")} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${({ theme }) => theme.breakpoints.up("md")} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const Audience = styled("div")`
  height: 100%;
  padding: ${({ theme }) => theme.spacing(2.5)};
  border-radius: 20px;
  background: ${brandColors.sand};

  & strong {
    display: block;
    margin-bottom: 4px;
    font-family: ${({ theme }) => theme.typography.h6.fontFamily};
    letter-spacing: -0.02em;
  }

  & p {
    margin: 0;
    font-size: 0.88rem;
    line-height: 1.5;
    color: ${brandColors.textGray};
  }
`;

export const tooltipSlotProps = {
  tooltip: {
    sx: {
      bgcolor: brandColors.ink,
      color: brandColors.paper,
      fontSize: "0.78rem",
      lineHeight: 1.45,
      p: 1.25,
      borderRadius: "8px",
      border: `1px solid ${landingColors.yellowGlow}`,
      maxWidth: 260
    }
  },
  arrow: {
    sx: { color: brandColors.ink }
  }
};
