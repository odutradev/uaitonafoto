import { styled } from '@mui/material/styles'

export const Container = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing(2)};
`
