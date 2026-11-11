import { styled } from "@mui/material/styles";

import { brandColors, landingColors } from "@styles/theme";

export const Polaroids = styled("div")`
  display: grid;
  grid-template-columns: repeat(2, 220px);
  gap: 26px;
`;

export const Polaroid = styled("figure")`
  margin: 0;
  padding: 10px 10px 0;
  border-radius: 12px;
  background: ${brandColors.paper};
  color: ${brandColors.ink};
  box-shadow: 0 30px 50px -24px ${landingColors.shadowDeep};
  transform: rotate(var(--rot, 0deg));

  & > div {
    height: 190px;
    overflow: hidden;
    border-radius: 6px;
  }

  & figcaption {
    display: flex;
    justify-content: space-between;
    padding: 10px 2px 14px;
    font-size: 18px;
    font-weight: 700;
  }

  & figcaption span:last-of-type {
    color: ${brandColors.textGray};
  }
`;
