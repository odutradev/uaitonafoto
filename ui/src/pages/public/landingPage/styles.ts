import { styled } from "@mui/material/styles";

import { brandColors } from "@styles/theme";

export const Page = styled("div")`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  overflow-x: clip;
  background: ${brandColors.darkBg};
  color: ${brandColors.paper};

  & main {
    display: flex;
    flex-direction: column;
  }

  & ::selection {
    background: ${brandColors.flashYellow};
    color: ${brandColors.ink};
  }

  & a:focus-visible,
  & button:focus-visible {
    outline: 2px solid ${brandColors.flashYellow};
    outline-offset: 3px;
  }
`;
