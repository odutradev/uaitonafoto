import { styled } from "@mui/material/styles";

import { brandColors, landingColors } from "@styles/theme";

export const Frame = styled("figure")`
  position: relative;
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
  background: ${brandColors.darkSurface};

  & > svg {
    display: block;
    width: 100%;
    height: 100%;
    transition:
      filter 0.6s ease,
      transform 0.6s ease;
  }

  &[data-quality="compressed"] > svg {
    filter: blur(2.4px) saturate(0.55) contrast(0.9);
    transform: scale(1.06);
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.6s ease;
    background-image:
      linear-gradient(90deg, ${landingColors.glassBorder} 1px, transparent 1px),
      linear-gradient(${landingColors.glassBorder} 1px, transparent 1px);
    background-size: 9px 9px;
  }

  &[data-quality="compressed"]::after {
    opacity: 1;
  }
`;

export const Caption = styled("figcaption")`
  position: absolute;
  left: 8px;
  bottom: 8px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  border-radius: 999px;
  max-width: calc(100% - 16px);
  background: ${landingColors.glass};
  backdrop-filter: blur(8px);
  color: ${brandColors.paper};
  font-size: 0.72rem;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  & strong {
    font-weight: 700;
  }

  & span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
