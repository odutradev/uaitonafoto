import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

import { ErrorContent } from './subcomponents/errorContent'

const ErrorPage = () => {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Ocorreu um erro inesperado.'

  return <ErrorContent message={message} />
}

export default ErrorPage
