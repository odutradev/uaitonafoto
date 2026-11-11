import { keyframes, styled } from "@mui/material/styles";

import { brandColors, landingColors } from "@styles/theme";

const slide = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

export const Track = styled("div")`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1.5)};
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
`;

export const Row = styled("div")`
  display: flex;
  width: max-content;
  animation: ${slide} var(--marquee-duration, 40s) linear infinite;

  &[data-reverse="true"] {
    animation-direction: reverse;
  }

  [data-marquee]:hover & {
    animation-play-state: paused;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    flex-wrap: wrap;
    width: auto;
  }
`;

export const Item = styled("span")`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-right: ${({ theme }) => theme.spacing(1.5)};
  padding: 10px 18px;
  border: 1px solid ${landingColors.glassBorder};
  border-radius: 999px;
  background: ${landingColors.glassLight};
  color: ${brandColors.paper};
  font-size: 0.92rem;
  font-weight: 500;
  white-space: nowrap;
  transition:
    background 0.25s ease,
    color 0.25s ease,
    transform 0.25s ease;

  &::before {
    content: "";
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${brandColors.flashYellow};
  }

  &:hover {
    background: ${brandColors.flashYellow};
    color: ${brandColors.ink};
    transform: translateY(-2px);
  }

  &:hover::before {
    background: ${brandColors.ink};
  }
`;
