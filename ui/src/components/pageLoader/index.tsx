import { CircularProgress } from '@mui/material'

import { Container } from './styles'

const PageLoader = () => (
  <Container role="status" aria-label="Carregando página">
    <CircularProgress />
  </Container>
)

export default PageLoader
