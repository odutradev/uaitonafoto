import { createBrowserRouter } from 'react-router-dom'
import { createElement } from 'react'

import { ErrorPage, Home, Login, NotFound, Register, ResetPassword } from '@pages'

const appRouter = createBrowserRouter([
  {
    errorElement: createElement(ErrorPage),
    children: [
      { path: '/login', element: createElement(Login) },
      { path: '/register', element: createElement(Register) },
      { path: '/cadastro', element: createElement(Register) },
      { path: '/reset-password', element: createElement(ResetPassword) },
      { path: '/', element: createElement(Home) },
      { path: '*', element: createElement(NotFound) }
    ]
  }
])

export default appRouter
