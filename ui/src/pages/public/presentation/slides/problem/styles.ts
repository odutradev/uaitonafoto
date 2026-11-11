import { styled } from "@mui/material/styles";

import { brandColors } from "@styles/theme";

export const Thumb = styled("div")`
  height: 120px;
  margin-bottom: 18px;
  overflow: hidden;
  border-radius: 16px;
`;

export const Conclusion = styled("p")`
  margin: 0;
  padding: 20px 26px;
  border-radius: 20px;
  background: ${brandColors.ink};
  color: ${brandColors.flashYellow};
  font-size: 26px;
  font-weight: 700;
`;
