import { styled } from "@mui/material/styles";

import { brandColors } from "@styles/theme";

export const Section = styled("section")`
  position: relative;
  padding: ${({ theme }) => theme.spacing(12, 2)};
  background: ${brandColors.sand};
  color: ${brandColors.ink};

  ${({ theme }) => theme.breakpoints.up("md")} {
    padding: ${({ theme }) => theme.spacing(16, 4)};
  }
`;

export const Inner = styled("div")`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
  max-width: 960px;
  margin: 0 auto;
`;

export const List = styled("div")`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1.5)};
`;

export const Item = styled("details")`
  border: 1px solid ${brandColors.sandDark};
  border-radius: 20px;
  background: ${brandColors.paper};
  transition: border-color 0.3s ease;

  &[open] {
    border-color: ${brandColors.ink};
  }

  &[open] summary svg {
    transform: rotate(180deg);
  }
`;

export const Question = styled("summary")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(2.5, 3)};
  cursor: pointer;
  list-style: none;
  border-radius: 20px;

  &::-webkit-details-marker {
    display: none;
  }

  &:focus-visible {
    outline: 3px solid ${brandColors.flashYellow};
    outline-offset: 2px;
  }

  h3 {
    margin: 0;
    font-family: ${({ theme }) => theme.typography.h3.fontFamily};
    font-size: 1.05rem;
    font-weight: 800;
    line-height: 1.3;

    ${({ theme }) => theme.breakpoints.up("md")} {
      font-size: 1.2rem;
    }
  }

  svg {
    flex-shrink: 0;
    transition: transform 0.3s ease;
  }
`;

export const Answer = styled("p")`
  margin: 0;
  padding: ${({ theme }) => theme.spacing(0, 3, 3)};
  color: ${brandColors.textGray};
  line-height: 1.6;
`;
