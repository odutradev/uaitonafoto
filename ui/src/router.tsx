import { createBrowserRouter } from 'react-router-dom'
import { createElement } from 'react'

import ResetPassword from '@pages/auth/resetPassword'
import LadingPage from '@pages/public/ladingPage'
import ErrorPage from '@pages/public/errorPage'
import NotFound from '@pages/public/notFound'
import AuthPage from '@pages/auth/authPage'

const appRouter = createBrowserRouter([
  {
    errorElement: createElement(ErrorPage),
    children: [
      { path: '/signin', element: createElement(AuthPage) },
      { path: '/signup', element: createElement(AuthPage) },
      { path: '/reset-password', element: createElement(ResetPassword) },
      { path: '/', element: createElement(LadingPage) },
      { path: '*', element: createElement(NotFound) }
    ]
  }
])

export default appRouter
