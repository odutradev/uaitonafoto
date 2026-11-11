import { styled } from "@mui/material/styles";

import { brandColors } from "@styles/theme";

export const QrBox = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: 30px;
  border-radius: 36px;
  background: ${brandColors.ink};
  color: ${brandColors.paper};

  & svg {
    width: 300px;
    height: 300px;
    padding: 16px;
    border-radius: 22px;
    background: ${brandColors.paper};
  }

  & strong {
    font-family: ${({ theme }) => theme.typography.h3.fontFamily};
    font-size: 34px;
    color: ${brandColors.flashYellow};
  }
`;

export const CtaWrap = styled("div")`
  & .MuiButton-root {
    padding: 18px 34px;
    background: ${brandColors.ink};
    color: ${brandColors.flashYellow};
    font-size: 24px;
  }

  & .MuiButton-root:hover {
    background: ${brandColors.darkPaper};
  }
`;
