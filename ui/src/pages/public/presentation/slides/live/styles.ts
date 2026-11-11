import { styled } from "@mui/material/styles";

export const Screens = styled("div")`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
  width: 100%;

  & > div:first-of-type {
    grid-column: 1 / -1;
  }
`;
